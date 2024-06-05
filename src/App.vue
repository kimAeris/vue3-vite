<template>
    <VApp class="hide-scroll">
        <TheHeader />
        <TheSider />
        <TheView />
        <AppToast />
        <AppFeedbackModal />
    </VApp>
</template>

<script setup>
import TheHeader from "@/layouts/TheHeader.vue";
import TheSider from "@/layouts/TheSider.vue";
import TheView from "@/layouts/TheView.vue";
import AppToast from "@/components/app/AppToast.vue";
import AppFeedbackModal from "./components/app/AppFeedbackModal.vue";
import { useLocale, useTheme } from "vuetify/lib/framework.mjs";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useMenu } from "./stores/menuStore";
import dayjs from "dayjs";
import { getLocaleCode } from "./utils/common";

// 테마 지정
const savedTheme = JSON.parse(localStorage.getItem("user"))?.user?.theme;
if (savedTheme) {
    const theme = useTheme();
    theme.global.name.value = savedTheme;
}

// 로케일 지정 (Vuetify, dayjs, 스토어)
const language = getLocaleCode();

const locale = useLocale();
locale.current.value = language;

dayjs.locale(language);

// 라우터 이동 시 currentPage 재지정
// TODO: 내비게이션 beforeEach 쪽으로 옮길 수 있을지 확인
const route = useRoute();
const menuStore = useMenu();
watch(
    () => route.path,
    () => {
        const toPath = route.path;

        if (
            !menuStore.COMMON_ROUTES.includes(toPath) &&
            menuStore.currentPage?.pgm_path_adr !== toPath
        ) {
            menuStore.currentPage = menuStore.flatMenus.find(
                (menu) => menu?.pgm_path_adr === toPath
            );
        }
    }
);
</script>
