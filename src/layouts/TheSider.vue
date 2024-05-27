<template>
    <VNavigationDrawer v-model="sider" temporary width="320">
        <!-- 사용자정보: xs만 렌더링 -->
        <LayoutUserInfo class="d-sm-none py-2 px-4" />
        <VDivider class="d-sm-none mb-1" />

        <!-- 샵버튼: sm까지 렌더링 -->
        <LayoutShopButton
            v-if="smAndDown"
            class="d-md-none py-1"
            :class="SIDER_PADING_X"
            @click="openShopCodeMap"
        />

        <!-- Mobile 메뉴리스트: sm까지 렌더링 -->
        <VList v-model:opened="open" nav class="d-md-none">
            <template v-for="depth_1 in menus">
                <VListGroup
                    v-if="depth_1.level_no === 2"
                    :value="depth_1.menu_cd"
                >
                    <template #activator="{ props }">
                        <VListItem v-bind="props" :title="depth_1.menu_nm" />
                    </template>

                    <template v-for="depth_2 in depth_1.childList">
                        <VListGroup
                            v-if="
                                depth_2.level_no === 3 &&
                                depth_1.menu_cd === depth_2.supi_menu_cd
                            "
                            :value="depth_2.menu_cd"
                            :v-slot:activator="true"
                        >
                            <template #activator="{ props }">
                                <VListItem
                                    v-bind="props"
                                    :title="depth_2.menu_nm"
                                />
                            </template>

                            <template
                                v-for="depth_3 in depth_2.childList"
                                :key="depth_3.menu_cd"
                            >
                                <VListItem
                                    v-if="
                                        depth_3.level_no === 4 &&
                                        depth_2.menu_cd === depth_3.supi_menu_cd
                                    "
                                    :title="depth_3.menu_nm"
                                    :value="depth_3.menu_cd"
                                    :active="
                                        currentPage?.menu_cd === depth_3.menu_cd
                                    "
                                    @click="() => navHandler(depth_3)"
                                    color="primary"
                                />
                            </template>
                        </VListGroup>
                    </template>
                </VListGroup>
            </template>
        </VList>

        <!-- PC 메뉴리스트: md부터 렌더링 -->
        <VList nav class="d-none d-md-block" :lines="false">
            <template v-for="sub in mainMenu.childList">
                <VListSubheader
                    color="primary"
                    :title="sub.menu_nm"
                    class="font-weight-medium text-subtitle-2"
                />
                <VDivider class="mb-1" />

                <VListItem
                    v-for="menu in sub.childList"
                    :title="menu.menu_nm"
                    :value="menu.menu_cd"
                    :active="currentPage?.menu_cd === menu.menu_cd"
                    @click="() => navHandler(menu)"
                    color="primary"
                    class="pl-6"
                />
            </template>
        </VList>

        <template #append>
            <!-- 유틸버튼: xs만 렌더링 -->
            <LayoutUtilButtons
                v-if="xs"
                class="d-flex d-sm-none justify-end py-1"
                :class="SIDER_PADING_X"
            />
        </template>
    </VNavigationDrawer>

    <TheShopCodeMapModal v-if="shopCodeMap" v-model="shopCodeMap" />
</template>

<script setup>
import LayoutUserInfo from "@/components/layout/LayoutUserInfo.vue";
import LayoutUtilButtons from "@/components/layout/LayoutUtilButtons.vue";
import LayoutShopButton from "@/components/layout/LayoutShopButton.vue";
import { useMenu } from "@/stores/menuStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUi } from "@/stores/uiStore";
import TheShopCodeMapModal from "@/components/modals/TheShopCodeMapModal.vue";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

// 패딩 값 통일화
const SIDER_PADING_X = "px-2";

// 사이드바 오픈여부
const { sider } = storeToRefs(useUi());

// 메뉴 정보 스토어
const menuStore = useMenu();
const { menus, mainMenu, currentPage } = storeToRefs(menuStore);

const { xs, smAndDown } = useDisplay();

// Mobile에서 펼쳐질 메뉴가 담길 배열
const openCodes = ref([]);

// Mobile에서 펼쳐질 메뉴
const open = computed({
    get: () => {
        if (openCodes.value.length === 0) {
            openCodes.value.push(
                mainMenu.value.menu_cd,
                currentPage.value?.supi_menu_cd
            );
        }
        return openCodes.value;
    },
    set: (newCodes) => {
        openCodes.value = [...newCodes];
    },
});

// 라우팅 이벤트
const router = useRouter();
const navHandler = (menu) => {
    currentPage.value = menu;

    mainMenu.value = menus.value.find(
        (item) =>
            item.childList.findIndex(
                (child) => child.menu_cd === currentPage.value?.supi_menu_cd
            ) > -1
    );

    // 라우터
    router.push({ path: menu.pgm_path_adr });

    openCodes.value = [];

    // 사이드메뉴 닫기
    sider.value = false;
};

// 공장별구성도
const shopCodeMap = ref(false);
const openShopCodeMap = () => {
    shopCodeMap.value = true;
};
</script>
