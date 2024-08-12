import dayjs from "dayjs";

import { getCurrentShopDate, logout, refreshToken } from "@/api/common";
import { getNewNoticeCount } from "@/api/system/notice";
import { useMenu, useToast, useUser } from "@/store";
import {
    checkBodyFetchNecessity,
    checkFetchNecessity,
    commonCode,
    getBodyCommonCodes,
    getCommonCodes,
} from "@/utils/code";
import { getLocaleCode, resetUserAndMenuStores } from "@/utils/common";

// 스토어에 메뉴 정보 못 찾은 경우
const kick = (id, token) => {
    if (id && token) logout(id);
    resetUserAndMenuStores();
    return "/user/login";
};

// 다국어 변경유무 체크
const checkCommonCode = async (path) => {
    const languageCode = getLocaleCode();

    const isFetchNecessity = await checkFetchNecessity(languageCode);
    if (isFetchNecessity) await getCommonCodes(languageCode);

    if (path.startsWith("/body/")) {
        const isBodyFetchNecessity = await checkBodyFetchNecessity(
            languageCode
        );
        if (isBodyFetchNecessity) await getBodyCommonCodes(languageCode);
    }
};

// 공지사항 카운트 업데이트
const setNoti = async (userStore) => {
    try {
        if (userStore.user?.role.length < 1) return;

        const count = await getNewNoticeCount(userStore.userSetInfo.user_id);
        userStore.newNoticeCount = count;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
    }
};

const setWorkDate = async (userStore) => {
    const now = dayjs();

    if (
        now.format("YYYY-MM-DD HH") !== userStore.shopDate.lastCheck ||
        userStore.shopDate.shop !== userStore.shop.shop_cd ||
        !userStore.shopDate.date
    ) {
        userStore.shopDate.lastCheck = now.format("YYYY-MM-DD HH");
        userStore.shopDate.shop = userStore.shop.shop_cd;

        try {
            userStore.shopDate.date = await getCurrentShopDate();
        } catch (error) {
            if (import.meta.env.DEV) console.error(error);
            userStore.shopDate.date = now.format("YYYY-MM-DD");
        }
    }
};

// 토큰 유무에 따라 로그인 페이지 진입 제어
const checkAuth = async (from, to, userStore) => {
    let accessToken = userStore.accessToken;
    const id = userStore.user.user_id;

    const LOGIN_PATHS = ["/user/login"];
    const COMMON_PATHS = ["/error"];

    const { newToast } = useToast();

    const menuStore = useMenu();
    // 메뉴스토어의 첫 화면
    const firstMenu = menuStore.flatMenus.find((menu) => !!menu?.pgm_path_adr);
    const firstMenuPath = firstMenu?.pgm_path_adr;

    // 토큰 있는데 로그인 관련 라우터 접근 시도
    if (LOGIN_PATHS.includes(to.path) && accessToken) {
        // 스토어에 메뉴 정보 있는 경우
        const home = menuStore.flatMenus.find((menu) => !!menu?.pgm_path_adr);
        if (home) return home.pgm_path_adr;

        return kick(id, accessToken);
    }

    // 토큰 없는데 다른 라우터 접근 시도
    if (
        !LOGIN_PATHS.includes(to.path) &&
        !COMMON_PATHS.includes(to.path) &&
        !accessToken
    ) {
        try {
            const tokenData = await refreshToken();
            userStore.accessToken = accessToken = tokenData?.accessToken;
        } catch (error) {
            if (import.meta.env.DEV) console.error(error);
            return kick(id, accessToken);
        }
    }

    // 토큰 없고 로그인 접근 시도 (로그인 한 상태로 다른 창 띄우는 경우)
    if (LOGIN_PATHS.includes(to.path) && !accessToken) {
        if (firstMenuPath) return firstMenuPath;
    }

    // 권한 없는 페이지 접근 제한
    if (!menuStore.accessibleRoutes.includes(to.path)) {
        if (import.meta.env.DEV) console.error(`Try access ${to.path}`);
        newToast(commonCode("MESSAGE", "MSG000034"), "warning"); // 잘못된 주소입니다

        if (!from?.name) {
            if (firstMenuPath) return firstMenuPath;
            return kick(id, accessToken);
        }

        return false;
    }
};

export default async (to, from) => {
    const userStore = useUser();

    await checkCommonCode(to.path);
    const next = await checkAuth(from, to, userStore);
    if (userStore.accessToken) await setNoti(userStore);
    if (userStore.accessToken && userStore.shop.shop_cd)
        await setWorkDate(userStore);
    return next;
};
