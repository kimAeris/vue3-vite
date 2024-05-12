import axios from "axios";
import dayjs from "dayjs";
import { useMenu } from "@/stores/menuStore.js";
import { useFeedback } from "@/stores/feedbackStore.js";
import { useUser } from "@/stores/userStore.js";
import router from "@/routes";
import { dateFormatting } from "@/utils/days";
import { commonCode } from "@/utils/code";

const LAST_ACTION_KEY = "lastAction";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
            `${BASE_URL}/logout`,
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
        baseURL,
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
                    req.url !== "/system/S3/upload" &&
                    req.url !== "/system/S3/download" &&
                    req.url !== "/file/download" &&
                    req.url !== "/file/upload"
                ) {
                    const baseCodes = getBaseCodes();

                    if (req.method === "get") {
                        if (typeof req.params === "string") {
                            req.params = JSON.parse(req.params);
                        }

                        req.params = {
                            ...req.params,
                            ...baseCodes,
                        };
                    } else if (req.method === "post") {
                        if (typeof req.data === "string") {
                            req.data = JSON.parse(req.data);
                        }

                        req.data = {
                            ...req.data,
                            ...baseCodes,
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
                    } = await axios.post(`${BASE_URL}/refreshToken`);

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

export const common = create(`${BASE_URL}`);

export const status = create(`${BASE_URL}/status`);

export const routine = create(`${BASE_URL}/res`);

export const subsidiary = create(`${BASE_URL}/smmInpsRes`);

export const dpu = create(`${BASE_URL}/dpuInspRes`);

export const cleaning = create(`${BASE_URL}/cleaning`);

export const bdm = create(`${BASE_URL}/bdm`);

export const system = create(`${BASE_URL}/system`);

/************* 차체 *************/
export const bdCommon = create(`${BASE_URL}/body/common`);

export const bdBdm = create(`${BASE_URL}/body/standard`);

export const journalStd = create(`${BASE_URL}/body/journal/cc/std`);

export const journalInquiry = create(`${BASE_URL}/body/journal/cc/inquiry`);

export const journalRes = create(`${BASE_URL}/body/journal/cc/res`);
