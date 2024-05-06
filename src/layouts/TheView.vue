<template>
    <VMain>
        <!-- 헤더 보일 경우 -->
        <VContainer v-if="header" fluid class="h-100" :class="getPadding">
            <RouterView />
        </VContainer>

        <!-- 헤더 숨길 경우 -->
        <VContainer
            v-else
            fluid
            class="h-100 d-flex justify-center align-center pa-0"
        >
            <RouterView />
        </VContainer>
    </VMain>
</template>

<script setup>
import { useUi } from "@/stores/uiStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useDisplay } from "vuetify";

const { header } = storeToRefs(useUi());
const { xlAndUp, lgAndUp, mdAndUp, smAndUp } = useDisplay();

const getPadding = computed(() => {
    if (xlAndUp.value) return "px-10";
    if (lgAndUp.value) return "px-8";
    if (mdAndUp.value) return "px-6";
    if (smAndUp.value) return "px-4";
    return "px-2";
});
</script>
