import { defineStore } from "pinia";
import { computed, ref } from "vue";

// TODO: route 로직 확인 필요
const COMMON_ROUTES = [
    "/user/login",
    "/user/login/sso",
    "/user/preferences",
    "/user/auth-request",
    "/user/no-auth",
];

const ADMIN_ROUTES = [
    "/body/reference/notice/view",
    "/body/welding/destructive/list/detail",
    "/favorites",
];

// 사이드메뉴 표시여부를 결정하는 스토어
export const useMenu = defineStore(
    "menu",
    () => {
        const menus = ref([]);

        const mainMenu = ref({});
        const currentPage = ref({});

        const flatMenus = computed(() =>
            menus.value
                .flatMap(({ childList }) => childList)
                .flatMap(({ childList }) => childList)
        );

        const accessibleRoutes = computed(() => {
            let paths = flatMenus.value.map(({ pgm_path_adr }) => pgm_path_adr);

            paths = [...paths, ...COMMON_ROUTES, ...ADMIN_ROUTES];

            return paths;
        });

        return {
            menus,
            mainMenu,
            flatMenus,
            currentPage,
            accessibleRoutes,
            COMMON_ROUTES,
            ADMIN_ROUTES,
        };
    },
    {
        persist: true,
    }
);
