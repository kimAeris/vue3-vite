```
<template>
    <VCard class="py-10 d-flex" width="900px" min-width="300px" elevation="7">
        <VRow class="mx-auto">
            <VCol class="pa-10 d-none d-sm-flex justify-center align-center">
                <div class="d-block w-100 pt-16">
                    <AppLogo variant="full" />

                    <VSelect
                        v-model="currentLanguage"
                        @update:model-value="changeLanguage"
                        :items="languages"
                        class="mt-4"
                        variant="underlined"
                    >
                        <!-- <template #prepend>
                            <VSlideXTransition>
                                <AppLanguageIcon
                                    :model-value="currentLanguage"
                                />
                            </VSlideXTransition>
                        </template> -->

                        <template #item="{ props, item: { raw } }">
                            <VListItem v-bind="props">
                                <template #prepend>
                                    <VChip
                                        class="text-medium-emphasis text-caption mr-3"
                                        rounded="lg"
                                        size="small"
                                    >
                                        {{ raw.value }}
                                    </VChip>
                                </template>
                            </VListItem>
                        </template>
                    </VSelect>
                </div>
            </VCol>

            <VDivider class="d-none d-sm-flex" vertical />

            <VCol class="py-6 px-10">
                <h4 class="d-none d-sm-block text-center font-weight-bold">
                    LOGIN
                </h4>

                <div class="d-block d-sm-none mx-auto px-2">
                    <AppLogo variant="full" />
                </div>

                <VForm
                    ref="form"
                    @submit.prevent
                    validate-on="submit"
                    class="mt-6"
                >
                    <VTextField
                        v-model="id"
                        label="ID"
                        variant="filled"
                        density="default"
                        :rules="idRules"
                    />

                    <VTextField
                        v-model="password"
                        label="PW"
                        variant="filled"
                        density="default"
                        :append-inner-icon="passwordAttrs(showPassword).icon"
                        :type="passwordAttrs(showPassword).type"
                        :rules="pwRules"
                        @click:append-inner="toggleShowPassword"
                    />

                    <VBtn
                        type="submit"
                        variant="elevated"
                        color="primary"
                        class="mt-4"
                        @click="loginHandler(false)"
                        :loading="loading"
                        block
                    >
                        {{ loginButtonText }}
                    </VBtn>

                    <VBtn
                        variant="text"
                        color="on-surface"
                        class="mt-4"
                        @click="missingPassword"
                        block
                    >
                        {{ passwordButtonText }}
                    </VBtn>
                </VForm>
            </VCol>
        </VRow>
    </VCard>

    <!-- <TheShopCodeMapModal
        v-if="shopCodeMap"
        v-model="shopCodeMap"
        close-logout
        persistent
    />

    <PasswordChangeModal
        v-if="passwordModal"
        v-model="passwordModal"
        :user-id="id"
        persistent
    /> -->
</template>

/*
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLogo from "@/components/app/AppLogo.vue";
import { useLocale, useTheme } from "vuetify/lib/framework.mjs";
import { useUser } from "@/stores/userStore";
import { storeToRefs } from "pinia";

const userStore = useUser();
const { user, accessToken, shop, userSetInfo } = storeToRefs(userStore);

user.value = {};
accessToken.value = null;
shop.value = null;

const loginButtonText = "로그인"; //ref(commonCode("RMS000020", "LB000240"));
const passwordButtonText = "비밀번호 찾기"; //ref(commonCode("RMS000020", "LB000241"));

// const currentLanguage = ref(getLocaleCode());
const languages = [
    {
        title: "한국어",
        value: "ko",
    },
    {
        title: "English",
        value: "en",
    },
];

// 패스워드 필드 글자 표시여부 로직
const showPassword = ref(false);
const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const passwordAttrs = (isShow) => {
    if (isShow) {
        return {
            icon: "mdi-eye",
            type: "text",
        };
    } else {
        return {
            icon: "mdi-eye-off",
            type: "password",
        };
    }
};

/*

import {
    getUserInfo,
    login,
    getNotRole,
    getUserMenu,
    getRefreshToken,
    changePwdNext,
} from "@/api/common";
import { useToast } from "@/stores/toastStore";

import { useUser } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { sysMgmtRetrive } from "@/api/system/system";
import TheShopCodeMapModal from "@/components/modals/TheShopCodeMapModal.vue";
import { useMenu } from "@/stores/menuStore";

import { useFeedback } from "@/stores/feedbackStore";
import PasswordChangeModal from "@/components/modals/PasswordChangeModal.vue";
import { commonCode, getCommonCodes } from "@/utils/code";
import { dateFormatting, setLocale } from "@/utils/days";
import dayjs from "dayjs";
import { getLocaleCode } from "@/utils/common";
import AppLanguageIcon from "@/components/app/AppLanguageIcon.vue";




// 비밀번호 변경 팝업
const passwordModal = ref(false);
const openPasswordModal = () => {
    passwordModal.value = true;
};



// 유효성
const idRules = [(v) => !!v || commonCode("MESSAGE", "MSG000053")]; // 아이디를 입력하세요.

const pwRules = [(v) => !!v || commonCode("MESSAGE", "MSG000054")]; // 비밀번호를 입력하세요.

// 로그인 데이터
const form = ref(null);
const id = ref(null);
const password = ref(null);
const loading = ref(false);

// 로그인 이벤트
const router = useRouter();
const { newToast } = useToast();

const menuStore = useMenu();
const { menus, mainMenu, currentPage, flatMenus } = storeToRefs(menuStore);

menus.value = [];
mainMenu.value = {};
currentPage.value = {};

// 모달
const shopCodeMap = ref(false);

// vuetify 테마
const theme = useTheme();

const CALL_SYSTEM_MANAGER = `${commonCode(
    "RMS000020",
    "LB000242"
)} (SF기술운영팀 김현민 책임)`;

// 피드백
const { openFeedback } = useFeedback();

const authentication = async () => {
    try {
        const { valid } = await form.value.validate();
        if (!valid) return;

        loading.value = true;

        const loginResponse = await login(id.value, password.value);
        accessToken.value = loginResponse.accessToken;

        localStorage.setItem(
            "lastAction",
            dateFormatting(dayjs(), "YYYY-MM-DD HH:mm:ss")
        );

        switch (loginResponse.returnCode) {
            case 14:
                // 비밀번호 미일치
                newToast(commonCode("MESSAGE", "MSG000050"), "error"); // ID/PW가 틀렸습니다.
                return;
            case 15:
                // 계정 잠김
                await openFeedback(
                    "error",
                    commonCode("MESSAGE", "MSG000051"), // 계정 잠김
                    `${commonCode(
                        "MESSAGE",
                        "MSG000052"
                    )} ${CALL_SYSTEM_MANAGER}`, // 계정이 잠금 처리 되었습니다.
                    commonCode("RMS000020", "LB000137") // 확인
                );
                return;
            case 16:
                // 계정 초기화
                openPasswordModal();
                return;
            case 20:
                // 비밀번호 변경 180일 지남
                const confirm = await openFeedback(
                    "warning",
                    commonCode("MESSAGE", "MSG000087"), // 비밀번호 변경 필요
                    commonCode("MESSAGE", "MSG000088"), // 비밀번호 변경 후 180일이 지났습니다. 비밀번호를 변경하시겠습니까?
                    commonCode("RMS000020", "LB000243"), // 다음에 변경
                    {
                        type: "warning",
                        text: commonCode("RMS000021", "ST000013"), // 변경
                    }
                );

                if (confirm) {
                    openPasswordModal();
                    return;
                } else {
                    await changePwdNext(id.value);
                    break;
                }
            case 21:
                // 비밀번호 10회 틀림
                await openFeedback(
                    "error",
                    commonCode("MESSAGE", "MSG000089"), // 계정 잠금
                    `${commonCode(
                        "MESSAGE",
                        "MSG000090" // 비밀번호를 10회 이상 틀렸습니다
                    )} (${commonCode(
                        "MESSAGE",
                        "MSG000091" // 해제 시간
                    )}: ${loginResponse.res})`,
                    commonCode("RMS000020", "LB000137") // 확인
                );
                return;
        }

        await getRefreshToken(id.value, password.value);
    } catch (error) {
        throw {
            ...error,
            msg: commonCode("MESSAGE", "MSG000058"), // 로그인에 실패했습니다
        };
    } finally {
        password.value = null;
        loading.value = false;
    }
};

const loginHandler = async () => {
    try {
        await authentication();

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
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);

        if (error?.msg) {
            newToast(error.msg, "error");
        } else {
            newToast(commonCode("MESSAGE", "MSG000055"), "error"); // 유저 정보를 불러오지 못했습니다
        }
    }
};

const missingPassword = async () => {
    await openFeedback(
        "primary",
        commonCode("MESSAGE", "MSG000092"), // 분실 문의
        `${CALL_SYSTEM_MANAGER}`,
        commonCode("RMS000020", "LB000137") // 확인
    );
};
*/
</script>
