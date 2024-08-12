import axios from "axios";
import dayjs from "dayjs";
import { useMenu } from "@/stores/menuStore.js";
import { useFeedback } from "@/stores/feedbackStore.js";
import { useUser } from "@/stores/userStore.js";
import router from "@/routes";
import { dateFormatting } from "@/utils/days";
import { commonCode } from "@/utils/code";

const LAST_ACTION_KEY = "lastAction";

const API = import.meta.env.VITE_API;

const getBaseCodes = () => {
    const menuStore = useMenu();
    const userStore = useUser();

    return {
        menu_cd: menuStore.currentPage?.menu_cd,
        menuCd: menuStore.currentPage?.menu_cd,
        shopCd: userStore.shop?.shop_cd,
        langCd: userStore.user?.lang_cd,
    };
};

const getFeedback = (type, title, message, cancel, confirm) => {
    const { openFeedback } = useFeedback();
    openFeedback(type, title, message, cancel, confirm);
};

const kick = () => {
    const menuStore = useMenu();
    const userStore = useUser();

    if (userStore.user.user_id) {
        axios.post(
            `${API}/logout`,
            {
                user_id: userStore.user.user_id,
            },
            {
                headers: {
                    Authorization: userStore.accessToken,
                },
                withCredentials: true,
            }
        );
    }

    localStorage.removeItem(LAST_ACTION_KEY);

    userStore.user = {};
    userStore.shop = {};
    menuStore.menus = [];
    menuStore.mainMenu = {};
    menuStore.currentPage = {};

    router.push({ name: "Login" });
};

const create = (baseURL, options) => {
    const instance = axios.create({
        baseURL: `${API}${baseURL}`,
        ...options,
        withCredentials: true,
    });

    instance.interceptors.request.use(
        async (req) => {
            try {
                const userStore = useUser();

                const accessToken = userStore.accessToken;

                const expireTime = dayjs(
                    localStorage.getItem(LAST_ACTION_KEY)
                ).add(1, "hour");

                // 헤더에 토큰 추가
                req.headers.Authorization = accessToken;

                // 로그인세션 만료 검증
                if (
                    !import.meta.env.DEV &&
                    accessToken &&
                    dayjs().isAfter(expireTime)
                ) {
                    kick();

                    getFeedback(
                        "error",
                        commonCode("MESSAGE", "MSG000059"), // 로그인 만료
                        commonCode("MESSAGE", "MSG000060"), // 로그인이 만료되었습니다
                        commonCode("RMS000020", "LB000137") // 확인
                    );

                    return Promise.reject(
                        new Error(commonCode("MESSAGE", "MSG000059"))
                    ); // 로그인 만료
                }

                // 메뉴코드 추가
                if (
                    req.url !== "/S3/upload" &&
                    req.url !== "/S3/download" &&
                    req.url !== "/file/download" &&
                    req.url !== "/file/upload"
                ) {
                    const baseCodes = getBaseCodes();

                    if (req.method === "get") {
                        if (typeof req.params === "string") {
                            req.params = JSON.parse(req.params);
                        }

                        req.params = {
                            ...baseCodes,
                            ...req.params,
                        };
                    } else if (req.method === "post") {
                        if (typeof req.data === "string") {
                            req.data = JSON.parse(req.data);
                        }

                        req.data = {
                            ...baseCodes,
                            ...req.data,
                        };
                    }
                }

                if (accessToken) {
                    localStorage.setItem(
                        LAST_ACTION_KEY,
                        dateFormatting(dayjs(), "YYYY-MM-DD HH:mm:ss")
                    );
                }
                return req;
            } catch (error) {
                if (import.meta.env.DEV) console.error(error);
            }
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        async (res) => {
            if (res.data?.returnCode === 22) {
                kick();

                getFeedback(
                    "error",
                    commonCode("MESSAGE", "MSG000061"), // 중복 로그인
                    commonCode("MESSAGE", "MSG000062"), // 다른 곳에서 로그인 되었습니다
                    commonCode("RMS000020", "LB000137") // 확인
                );

                return Promise.reject(res.data.returnMessage);
            }

            return res;
        },
        async (error) => {
            if (error.response.status === 401) {
                try {
                    const {
                        data: { accessToken },
                    } = await axios.post(`${API}/refreshToken`);

                    if (accessToken) {
                        const userStore = useUser();
                        error.config.headers.Authorization =
                            userStore.accessToken = accessToken;
                        return await axios.request(error.config);
                    }
                } catch (refreshError) {
                    if (import.meta.env.DEV) console.error(refreshError);
                    kick();

                    getFeedback(
                        "error",
                        commonCode("MESSAGE", "MSG000063"), // 권한 없음
                        commonCode("MESSAGE", "MSG000064"), // 접근 권한이 없습니다
                        commonCode("RMS000020", "LB000137") // 확인
                    );

                    return Promise.reject(error);
                }
            }

            if (error.response.status === 403) {
                kick();

                getFeedback(
                    "error",
                    commonCode("MESSAGE", "MSG000063"), // 권한 없음
                    commonCode("MESSAGE", "MSG000064"), // 접근 권한이 없습니다
                    commonCode("RMS000020", "LB000137") // 확인
                );

                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export const common = create("/");

export const status = create("/status");

export const routine = create("/res");

export const subsidiary = create("/smmInpsRes");

export const dpu = create("/dpuInspRes");

export const cleaning = create("/cleaning");

export const bdm = create("/bdm");

export const system = create("/system");

export const quality = create("/paint/quality");

export const qualityJournal = create("/paint/quality/journal");

export const qualityOverview = create("/paint/quality/overview");

/************* 차체 *************/
export const bdCommon = create("/body/common");

export const bdBdm = create("/body/standard");

export const bdJournal = create("/body/journal");

export const overview = create("/body/overview");
