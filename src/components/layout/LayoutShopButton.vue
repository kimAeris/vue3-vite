<template>
    <div>
        <VBtn variant="text" prepend-icon="mdi-car-outline" class="text-body-1">
            <span class="font-weight-medium">{{ user.shop?.sys_nm }}</span>
        </VBtn>
    </div>
</template>

<script setup>
import { useUser } from "@/stores/userStore";

// 샵 정보
const user = useUser();
</script>
