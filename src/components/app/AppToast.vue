<template>
    <VSnackbar
        v-model="visible"
        :timeout="timeout"
        :color="type"
        variant="tonal"
        rounded="pill"
        class="mb-6"
    >
        <VIcon :icon="getFeedbackIcon(type)" class="mr-2" />
        {{ message }}
    </VSnackbar>
</template>

<script setup>
import { useToast } from "@/stores/toastStore.js";
import { storeToRefs } from "pinia";
import { getFeedbackIcon } from "@/utils/common";

const { visible, type, message, timeout } = storeToRefs(useToast());
</script>
