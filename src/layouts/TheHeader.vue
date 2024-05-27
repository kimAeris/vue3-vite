<template>
    <VAppBar v-if="header" color="surface" height="56" class="border-b">
        <VContainer class="fill-height py-0 px-10 flex-nowrap" fluid>
            <VAppBarNavIcon #prepend @click="toggleSider" />
            <div @click="moveHome" class="home mx-3">
                <AppLogo />
            </div>
            <!-- 샵버튼 : md부터 렌더링 -->
            <LayoutShopButton v-if="mdAndUp" class="d-none d-md-flex" />
        </VContainer>
    </VAppBar>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUi } from "@/stores/uiStore";

import AppLogo from "@/components/app/AppLogo.vue";
import LayoutShopButton from "@/components/layout/LayoutShopButton.vue";

import { useDisplay } from "vuetify/lib/framework.mjs";
import { useRoute } from "vue-router";
import { useMenu } from "@/stores/menuStore";

// UI 스토어
const ui = useUi();
const { header, sider } = storeToRefs(ui);
const { toggleSider } = ui;

// 메뉴 정보 스토어
const { menus, mainMenu, currentPage, flatMenus } = storeToRefs(useMenu());

const { smAndUp, mdAndUp } = useDisplay();

// 메뉴 클릭 이벤트
const handleMenu = (menu) => {
    if (!sider.value) {
        sider.value = true;
    }
    mainMenu.value = menu;
};

const route = useRoute();

// 현재 선택 대메뉴코드
const currentMainMenuCode = ref(null);

// fullscreenPaths 배열에 등록 된 path에서는 헤더 제거
const fullscreenPaths = [
    "/",
    "/user/login",
    "/user/login/sso",
    "/user/auth-request",
    "/user/no-auth",
    "/error",
];

watch(
    () => route.path,
    (newPath) => {
        if (fullscreenPaths.indexOf(newPath) < 0) {
            header.value = true;
        } else {
            header.value = false;
        }
        currentMainMenuCode.value = mainMenu.value.menu_cd;
    }
);
</script>
