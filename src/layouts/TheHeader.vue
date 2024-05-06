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
import { useUi } from "@/stores/uiStore";
import { storeToRefs } from "pinia";

import AppLogo from "@/components/app/AppLogo.vue";
import LayoutShopButton from "@/components/layout/LayoutShopButton.vue";

import { useDisplay } from "vuetify/lib/framework.mjs";

// UI 스토어
const ui = useUi();
const { header, sider } = storeToRefs(ui);

const { mdAndUp } = useDisplay();
</script>
