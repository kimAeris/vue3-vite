<template></template>

<script setup>
import {
    getNotRole,
    getUserInfo,
    getUserMenu,
    refreshToken,
} from "@/api/common";
import { sysMgmtRetrive } from "@/api/system/system";
import { useMenu } from "@/stores/menuStore";
import { useToast } from "@/stores/toastStore";
import { useUser } from "@/stores/userStore";
import { commonCode } from "@/utils/code";
import { dateFormatting } from "@/utils/days";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useFavorite } from "@/stores/favoriteStore";

// 로그인 이벤트
const router = useRouter();
const { newToast } = useToast();

const userStore = useUser();
const { user, accessToken, shop, userSetInfo } = storeToRefs(userStore);

const menuStore = useMenu();
const { menus, mainMenu, currentPage, flatMenus } = storeToRefs(menuStore);

const theme = useTheme();

// 즐겨찾기
const favoriteStore = useFavorite();

const loginHandler = async () => {
    try {
        const res = await refreshToken();

        accessToken.value = res.accessToken;

        const userInfo = await getUserInfo();
        user.value = userInfo;
        theme.global.name.value = userInfo.theme;

        if (userInfo.role.length < 1) {
            const disabledRole = await getNotRole(userSetInfo.value);

            if (disabledRole.length < 1) {
                router.replace({ name: "AuthRequest" });
            } else {
                router.replace({ name: "NoAuth" });
            }
        } else {
            if (userInfo.role.length === 1) {
                const roleId = userInfo.role[0].role_id;
                const shopCode = userInfo.role[0].shop_cd;

                if (roleId === "ROL000000") {
                    shop.value = {
                        sys_nm: "SYSTEM",
                    };
                } else {
                    const shops = await sysMgmtRetrive(userSetInfo.value);
                    shop.value = shops.find(
                        (item) => shopCode === item.shop_cd
                    );
                }

                const menuData = await getUserMenu(
                    shopCode,
                    roleId,
                    userInfo.lang_cd
                );

                menus.value = menuData;
                mainMenu.value = menuData[0];

                const firstMenu = flatMenus.value.find(
                    (menu) => !!menu.pgm_path_adr
                );
                currentPage.value = firstMenu;
                router.replace({ path: firstMenu.pgm_path_adr });
            } else {
                shopCodeMap.value = true;
            }
        }
        favoriteStore.getFavorite();
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000058"), "error"); // 로그인에 실패했습니다

        router.replace({ name: "Login" });
    }
};

localStorage.setItem(
    "lastAction",
    dateFormatting(dayjs(), "YYYY-MM-DD HH:mm:ss")
);

loginHandler();
</script>
