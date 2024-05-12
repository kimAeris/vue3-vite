import { createRouter, createWebHashHistory } from "vue-router";
import user from "./user";
import { useToast } from "@/stores/toastStore";
import { useMenu } from "@/stores/menuStore";
import { useUser } from "@/stores/userStore";
import system from "./system";
// import body from "./bd";
// import paint from "./pt";
import {
    checkBodyFetchNecessity,
    checkFetchNecessity,
    commonCode,
    getBodyCommonCodes,
    getCommonCodes,
} from "@/utils/code";
import { getLocaleCode, resetUserAndMenuStores } from "@/utils/common";
import { logout, refreshToken } from "@/api/common";
// import { getNewNoticeCount } from "@/api/system/notice";

const routes = [
    // 공통
    ...user,
    ...system,
];

const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
});

const kick = (id, token) => {
    // 스토어에 메뉴 정보 못 찾은 경우
    if (id && token) logout(id);
    resetUserAndMenuStores();
    return "/user/login";
};

router.beforeEach(async (to, from) => {
    const userStore = useUser();

    // 다국어 변경유무 체크
    const languageCode = getLocaleCode();

    const isFetchNecessity = await checkFetchNecessity(languageCode);
    if (isFetchNecessity) await getCommonCodes(languageCode);

    // 차체 공통코드 따로 가져옴
    if (to.path.startsWith("/body/")) {
        const isBodyFetchNecessity = await checkBodyFetchNecessity(
            languageCode
        );
        if (isBodyFetchNecessity) await getBodyCommonCodes(languageCode);
    }

    // 토큰 유무에 따라 로그인 페이지 진입 제어
    let accessToken = userStore.accessToken;
    const id = userStore.user.user_id;
    const LOGIN_PATHS = ["/user/login", "/user/login/sso"];
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
    if (!LOGIN_PATHS.includes(to.path) && !accessToken) {
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

    // 관리자 페이지 접근 제한
    if (
        menuStore.accessibleRoutes.includes(to.path) &&
        menuStore.ADMIN_ROUTES.includes(to.path)
    ) {
        const adminRoles = ["ROL000000", "ROL000002"];
        const hasAdminRole = !!userStore.user.role?.find(({ role_id }) =>
            adminRoles.includes(role_id)
        );

        if (!hasAdminRole) {
            newToast(commonCode("MESSAGE", "MSG000064"), "warning"); // 접근 권한이 없습니다
            if (!from?.name) {
                if (firstMenuPath) return firstMenuPath;
                return kick(id, accessToken);
            }
            return false;
        }
    }

    // 공지사항 카운트 업데이트
    // if (accessToken) {
    //     try {
    //         const count = await getNewNoticeCount(
    //             userStore.userSetInfo.user_id
    //         );
    //         userStore.newNoticeCount = count;
    //     } catch (error) {
    //         if (import.meta.env.DEV) console.error(error);
    //     }
    // }
});

export default router;
