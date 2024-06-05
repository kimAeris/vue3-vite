<template>
    <TheContentHeader
        :title="commonCode('RMSG000001', 'RMS000021')"
        hide-excel-button
    />
    <ContainerSheet>
        <VList>
            <VListItem
                prepend-icon="mdi-translate"
                :title="commonCode('RMS000021', 'ST000001')"
                :subtitle="currentLanguage"
            >
                <template #append>
                    <VSelect
                        v-model="user.lang_cd"
                        :items="languageList"
                        @update:model-value="updateLanguageHandler"
                        item-title="code_nm"
                        item-value="com_cd"
                        variant="solo"
                        hide-details
                        flat
                    />
                </template>
            </VListItem>
            <VDivider />

            <VListItem
                prepend-icon="mdi-theme-light-dark"
                :title="commonCode('RMS000021', 'ST000004')"
                :subtitle="currentTheme"
            >
                <template #append>
                    <VSelect
                        v-model="user.theme"
                        :items="themeList"
                        @update:model-value="updateThemeHandler"
                        item-title="code_nm"
                        item-value="com_cd"
                        variant="solo"
                        hide-details
                        flat
                    />
                </template>
            </VListItem>
            <VDivider />

            <VListItem
                prepend-icon="mdi-account-multiple-plus"
                :title="commonCode('RMS000021', 'ST000007')"
                :subtitle="commonCode('RMS000021', 'ST000008')"
            >
                <template #append>
                    <VBtn
                        color="grey-darken-1"
                        icon="mdi-menu-right"
                        variant="text"
                        @click="openAuthModal"
                    />
                </template>
            </VListItem>
            <VDivider />

            <VListItem
                prepend-icon="mdi-key-change"
                :title="commonCode('RMS000021', 'ST000009')"
            >
                <template #append>
                    <VBtn
                        color="grey-darken-1"
                        icon="mdi-menu-right"
                        variant="text"
                        @click="openPasswordModal"
                    />
                </template>
            </VListItem>
            <VDivider />
        </VList>
    </ContainerSheet>

    <AddAuthModal v-if="addAuthModal" v-model="addAuthModal" />

    <PasswordChangeModal
        v-if="passwordModal"
        v-model="passwordModal"
        :user-id="user.user_id"
    />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useLocale, useTheme } from "vuetify/lib/framework.mjs";
import { useUser } from "@/stores/userStore";
import { ref, computed } from "vue";
import { getUserInfo, getUserMenu, updateUserInfo } from "@/api/common";
import { useToast } from "@/stores/toastStore";
import { sysMgmtRetrive } from "@/api/system/system";
import { useMenu } from "@/stores/menuStore";
import { setLocale } from "@/utils/days";
import AddAuthModal from "@/components/modals/AddAuthModal.vue";
import PasswordChangeModal from "@/components/modals/PasswordChangeModal.vue";
import { commonCode, getCommonCodes } from "@/utils/code";
import dayjs from "dayjs";

// 유저 스토어
const userStore = useUser();
const { user, shop, userSetInfo } = storeToRefs(userStore);

// TODO: 공통코드 추가 시 실데이터로
const languageList = ref([
    {
        com_cd: "KO",
        code_nm: commonCode("RMS000021", "ST000003"),
    },
    {
        com_cd: "EN",
        code_nm: commonCode("RMS000021", "ST000002"),
    },
]);

const themeList = ref([
    {
        com_cd: "light",
        code_nm: commonCode("RMS000021", "ST000005"),
    },
    {
        com_cd: "dark",
        code_nm: commonCode("RMS000021", "ST000006"),
    },
]);

// 토스트
const { newToast } = useToast();

// 권한추가신청 팝업
const addAuthModal = ref(false);
const openAuthModal = () => {
    addAuthModal.value = true;
};

// 비밀번호 변경 팝업
const passwordModal = ref(false);
const openPasswordModal = () => {
    passwordModal.value = true;
};

// 유저 정보 업데이트
const updateHandler = async () => {
    try {
        await updateUserInfo({
            theme: user.value.theme,
            lang_cd: user.value.lang_cd,
            // "shop_cd": user.value.
        });
        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        throw error;
    }
};

// 현재 언어명
const currentLanguage = computed(
    () =>
        languageList.value?.find((item) => item.com_cd === user.value.lang_cd)
            ?.code_nm
);

// 변경 된 언어로 메뉴 재로드를 위한 메뉴 스토어
const menuStore = useMenu();
const { menus, mainMenu, currentPage, flatMenus } = storeToRefs(menuStore);

const locale = useLocale();

const updateLanguageHandler = async () => {
    try {
        await updateHandler();

        // 메뉴 리페칭
        const currentShopRole = user.value?.role.find(
            (item) => item.shop_cd === shop.value.shop_cd
        );

        let roleId;
        if (currentShopRole) {
            roleId = currentShopRole.role_id;
        } else {
            const systemManager = user.value?.role.find(
                (item) => item.role_id === "ROL000000"
            );
            if (systemManager) {
                roleId = systemManager.role_id;
            } else {
                throw "No Role";
            }
        }

        const menuData = await getUserMenu(
            shop.value.shop_cd,
            roleId,
            user.value.lang_cd
        );

        menus.value = menuData;
        mainMenu.value = menuData[0];
        currentPage.value = flatMenus.value.find((menu) => !!menu.pgm_path_adr);

        const userInfo = await getUserInfo();
        user.value = userInfo;

        const shops = await sysMgmtRetrive(userSetInfo.value);
        shop.value = shops.find((item) => shop.value.shop_cd === item.shop_cd);

        if (!shop.value) {
            shop.value = {
                sys_nm: "SYSTEM",
            };
        }

        const language = user.value.lang_cd.toLowerCase();
        if (language === "ko") {
            locale.current.value = language;
            setLocale(language);
        } else {
            locale.current.value = "en";
            setLocale("en");
        }
        dayjs.locale(locale.current.value);

        await getCommonCodes(user.value.lang_cd);
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000056"), "error");
    }
};

// 현재 테마명
const currentTheme = computed(
    () =>
        themeList.value?.find((item) => item.com_cd === user.value.theme)
            ?.code_nm
);

// vuetify 테마
const theme = useTheme();

const updateThemeHandler = async () => {
    try {
        await updateHandler();

        theme.global.name.value = user.value.theme;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000057"), "error");
    }
};
</script>
