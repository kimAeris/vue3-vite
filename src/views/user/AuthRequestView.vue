<template>
    <VContainer>
        <ContainerSheet class="mb-6">
            <div
                class="d-flex justify-space-between align-center"
                style="height: 48px"
            >
                <div class="d-flex align-center ga-2">
                    <h6 class="text-primary d-inline">
                        <!-- 권한신청 -->
                        {{ commonCode("RMS000020", "LB000238") }}
                    </h6>
                </div>

                <div>
                    <VBtn
                        variant="text"
                        append-icon="mdi-logout"
                        class="ml-2"
                        @click="logoutHandler"
                    >
                        <!-- 로그아웃 -->
                        {{ commonCode("MESSAGE", "MSG000067") }}
                    </VBtn>
                </div>
            </div>
        </ContainerSheet>

        <ContainerSheet>
            <AuthRequest @submit="done" />
        </ContainerSheet>
    </VContainer>
</template>

<script setup>
import AuthRequest from "@/components/AuthRequest.vue";
import { commonCode } from "@/utils/code";
import { logout } from "@/api/common";
import { useToast } from "@/stores/toastStore";
import { useUser } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { resetUserAndMenuStores } from "@/utils/common";

const { newToast } = useToast();
const userStore = useUser();

const router = useRouter();

const done = () => {
    router.push({ name: "NoAuth" });
};

const logoutHandler = async () => {
    try {
        await logout(userStore.userSetInfo.user_id);
        resetUserAndMenuStores();

        newToast(commonCode("MESSAGE", "MSG000008"), "primary"); // 로그아웃 되었습니다
        router.push({ name: "Login" });
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000009"), "error"); // 로그아웃에 실패했습니다
    }
};
</script>
