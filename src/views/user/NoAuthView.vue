<template>
    <VContainer style="max-width: 720px">
        <ContainerSheet>
            <ContentSubheader>
                <!-- 권한신청 -->
                {{ commonCode("RMS000020", "LB000238") }}
            </ContentSubheader>

            <VList>
                <template v-for="role in roles">
                    <VListItem
                        :prepend-icon="getUserIcon(role.role_id)"
                        :append-icon="getStatusIcon(role.prog_cd)"
                        rounded="lg"
                    >
                        <VListItemTitle>
                            <span class="mr-2">{{ role.shop_nm }}</span>
                            <span class="text-body-2 text-medium-emphasis">
                                {{ role.role_nm }}
                            </span>
                        </VListItemTitle>

                        <VListItemSubtitle>
                            <template v-if="role.prog_cd === 'R'">
                                <!-- 권한 신청이 진행중입니다 -->
                                {{ commonCode("MESSAGE", "MSG000093") }}
                            </template>
                            <template v-else>
                                <!-- 권한이 회수/반려 되었습니다. -->
                                {{ commonCode("MESSAGE", "MSG000094") }}
                            </template>
                        </VListItemSubtitle>

                        <VListItemSubtitle
                            v-if="role.prog_cd !== 'R' && role.prog_rsn_txt"
                        >
                            <span>
                                <!-- 사유 -->
                                {{ commonCode("RMS000020", "LB000244") }}:
                            </span>
                            <span>
                                {{ role.prog_rsn_txt }}
                            </span>
                        </VListItemSubtitle>
                    </VListItem>

                    <VDivider class="my-2" />
                </template>
            </VList>

            <div class="w-100 d-flex justify-end my-2">
                <VBtn
                    variant="text"
                    prepend-icon="mdi-logout"
                    class="mr-2"
                    @click="logoutHandler"
                >
                    <!-- 로그아웃 -->
                    {{ commonCode("MESSAGE", "MSG000067") }}
                </VBtn>
                <VBtn variant="flat" color="primary" @click="moveRequest">
                    <!-- LB000238 -->
                    {{ commonCode("RMS000020", "LB000238") }}
                </VBtn>
            </div>
        </ContainerSheet>
    </VContainer>
</template>

<script setup>
import { getNotRole, logout } from "@/api/common";
import { useToast } from "@/stores/toastStore";
import { useUser } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { commonCode } from "@/utils/code";
import { resetUserAndMenuStores } from "@/utils/common";
import ContentSubheader from "@/components/ContentSubheader.vue";
import { onMounted } from "vue";

// 메시지 출력 용 토스트
const { newToast } = useToast();

const userStore = useUser();
const { userSetInfo, user } = storeToRefs(userStore);

const roles = ref([]);

const fetchData = async () => {
    try {
        roles.value = await getNotRole(userSetInfo.value);
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    }
};

onMounted(async () => {
    await fetchData();
});

const getUserIcon = (roleId) => {
    if (roleId === "ROL000003") return "mdi-account-supervisor"; // 뷰어
    if (roleId === "ROL000002") return "mdi-account-tie"; // 매니저
    return "mdi-account"; // 유저 및 기타
};

const getStatusIcon = (progressCode) => {
    if (progressCode === "R") return "mdi-pause-circle-outline";
    return "mdi-close-circle-outline";
};

const router = useRouter();
const logoutHandler = async () => {
    try {
        await logout(user.value.user_id);
        resetUserAndMenuStores();

        newToast(commonCode("MESSAGE", "MSG000008"), "primary"); // 로그아웃 되었습니다
        router.push({ name: "Login" });
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000009"), "error"); // 로그아웃에 실패했습니다
    }
};

const moveRequest = async () => {
    router.push({ name: "AuthRequest" });
};
</script>
