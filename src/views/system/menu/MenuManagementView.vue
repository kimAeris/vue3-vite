<template>
    <TheContentHeader
        v-model:filters="filters"
        :buttons="contentHeaderButtons"
        :custom-search-function="fetchData"
        :custom-refresh-function="refresh"
    />

    <VRow height="100%">
        <VCol cols="12" md="3" height="100%">
            <ContainerSheet height="100%">
                <ContentSubheader>
                    <!-- 메뉴 -->
                    {{ commonCode("RMS000009", "MENU") }}
                </ContentSubheader>

                <VList color="primary" max-height="700">
                    <VListItem
                        @click="setTableItems(menus)"
                        rounded="lg"
                        value="root"
                        :active="isActive(BASE_MENU)"
                    >
                        <!-- 전체목록 -->
                        {{ commonCode("RMS000020", "LB000205") }}
                    </VListItem>

                    <template v-for="depth_1 in menus">
                        <VListGroup
                            v-if="depth_1.lang_cd === user.lang_cd"
                            :value="depth_1.menu_cd.value"
                        >
                            <template #activator="{ props, isOpen }">
                                <VListItem
                                    @click="setTableItems(depth_1)"
                                    :value="depth_1.menu_cd.value"
                                    rounded="lg"
                                    :active="isActive(depth_1.menu_cd.value)"
                                >
                                    {{ depth_1.menu_nm.value }}
                                    <template #append>
                                        <VBtn
                                            v-if="isOpen"
                                            v-bind="props"
                                            icon="mdi-chevron-up"
                                            variant="text"
                                            size="small"
                                        >
                                        </VBtn>
                                        <VBtn
                                            v-else
                                            v-bind="props"
                                            icon="mdi-chevron-down"
                                            variant="text"
                                            size="small"
                                        />
                                    </template>
                                </VListItem>
                            </template>

                            <template v-for="depth_2 in depth_1?.childList">
                                <VListGroup
                                    v-if="depth_2.lang_cd === user.lang_cd"
                                    :value="depth_2.menu_cd.value"
                                >
                                    <template #activator="{ props, isOpen }">
                                        <VListItem
                                            @click="setTableItems(depth_2)"
                                            :value="depth_2.menu_cd.value"
                                            rounded="lg"
                                            class="pl-6"
                                            :active="
                                                isActive(depth_2.menu_cd.value)
                                            "
                                        >
                                            {{ depth_2.menu_nm.value }}
                                            <template #append>
                                                <VBtn
                                                    v-if="isOpen"
                                                    v-bind="props"
                                                    icon="mdi-chevron-up"
                                                    variant="text"
                                                    size="small"
                                                >
                                                </VBtn>
                                                <VBtn
                                                    v-else
                                                    v-bind="props"
                                                    icon="mdi-chevron-down"
                                                    variant="text"
                                                    size="small"
                                                />
                                            </template>
                                        </VListItem>
                                    </template>

                                    <template
                                        v-for="depth_3 in depth_2?.childList"
                                    >
                                        <VListItem
                                            v-if="
                                                depth_3.lang_cd === user.lang_cd
                                            "
                                            @click="setTableItems(depth_3)"
                                            :value="depth_3.menu_cd.value"
                                            rounded="lg"
                                            class="pl-10"
                                            :active="
                                                isActive(depth_3.menu_cd.value)
                                            "
                                        >
                                            {{ depth_3.menu_nm.value }}
                                        </VListItem>
                                    </template>
                                </VListGroup>
                            </template>
                        </VListGroup>
                    </template>
                </VList>
            </ContainerSheet>
        </VCol>
        <VCol cols="12" md="9" height="100%">
            <ContainerSheet height="100%">
                <DataTable
                    :title="activeMenu?.menu_nm?.value"
                    :language-pairing="true"
                />
            </ContainerSheet>
        </VCol>
    </VRow>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DataTable from "@/components/DataTable.vue";
import { useToast } from "@/stores/toastStore";
import { useDataTable } from "@/stores/dataTableStore";
import { usePageCodes } from "@/stores/pageCodesStore";
import { storeToRefs } from "pinia";
import { difference } from "@/utils/common";
import {
    menuMgmtRetrive,
    menuMgmtCreate,
    menuMgmtUpdate,
    menuMgmtDelete,
} from "@/api/system/menu";
import { useUser } from "@/stores/userStore";
import { dateFormatting } from "@/utils/days";
import { pgmMgmtRetrive } from "@/api/system/program";
import ContentSubheader from "@/components/ContentSubheader.vue";
import { getUserMenu } from "@/api/common";
import { useMenu } from "@/stores/menuStore";
import { commonCode, commonCodeGroup } from "@/utils/code";

///////////////////////// 페이지 공통 /////////////////////////
const userStore = useUser();
const { user, shop, userSetInfo } = storeToRefs(userStore);

// 공통코드 스토어
const pageCodesStore = usePageCodes();
const { codes } = storeToRefs(pageCodesStore);

const setCodes = async () => {
    const prgData = await pgmMgmtRetrive(userSetInfo.value);
    const currntLanguagePrgData = prgData.filter(
        (item) => item.lang_cd === user.value.lang_cd
    );
    const prgCode = currntLanguagePrgData.map((item) => ({
        com_cd: item.pgm_id,
        code_nm: item.pgm_nm,
    }));

    const tcdCodeGroup = commonCodeGroup("RMS000003");

    const tcdCode = Object.keys(tcdCodeGroup).map((item) => ({
        com_cd: item,
        code_nm: tcdCodeGroup[item],
    }));

    codes.value = {
        pgm_id: prgCode,
        shop_tcd: tcdCode,
    };
};

///////////////////////// 테이블 /////////////////////////
const dataTableStore = useDataTable();

// 테이블 필요 스테이트
const {
    items,
    headers,
    loading,
    page,
    keyColumn,
    pairingColumns,
    selected,
    addedItems,
    deleteApi,
} = storeToRefs(dataTableStore);

// 현재 테이블에 표출 중인 데이터들의 부모
const currentParent = ref([]);

// 메시지 출력 용 토스트
const { newToast } = useToast();

// 스토어 리셋
dataTableStore.resetDataTableStores();

// 행
const columns = {
    menu_cd: {
        type: "key",
        text: null,
        value: null,
    },
    lang_cd: null,
    menu_nm: {
        type: "text",
        value: null,
    },
    sort_sn: {
        type: "number",
        value: null,
    },
    use_yn: {
        type: "switch",
        value: "N",
    },
    supi_menu_nm: null,
    pgm_id: {
        type: "autocomplete",
        value: null,
    },
    reg_dt: null,
    reg_user_nm: null,
    modi_dt: null,
    modi_user_nm: null,
    shop_tcd: {
        type: "autocomplete",
        value: null,
    },
    supi_menu_cd: null,

    level_no: null,
};

// 언어에 따라 같이 변할 값
pairingColumns.value.push(
    "sort_sn",
    "screen_menu_yn",
    "use_yn",
    "pgm_id",
    "shop_tcd"
);

// 헤더 명칭
const headerTitles = [
    commonCode("RMS000020", "LB000200"), // 코드
    commonCode("RMS000020", "LB000201"), // 언어
    commonCode("RMS000009", "MENU"), // 메뉴
    commonCode("RMS000020", "LB000204"), // 정렬번호
    commonCode("RMS000020", "LB000085"), // 사용여부
    commonCode("RMS000020", "LB000207"), // 상위메뉴
    commonCode("RMS000020", "LB000208"), // 프로그램
    commonCode("RMS000020", "LB000059"), // 등록일시
    commonCode("RMS000020", "LB000058"), // 등록자
    commonCode("RMS000020", "LB000061"), // 수정일시
    commonCode("RMS000020", "LB000060"), // 수정자
    commonCode("RMS000020", "LB000258"), // 샵유형
];

// 헤더
headers.value = dataTableStore.parseColumnHeaders(headerTitles, columns);

///////////////////////// 컨텐츠헤더 정의 /////////////////////////
// 컨텐트헤더 하단 검색필터
let filters = ref([
    {
        key: "menu_nm",
        type: "text",
        name: commonCode("RMS000009", "MENU"), // 메뉴
        value: null,
    },
]);

const searchParams = computed(() => {
    const params = {};
    filters.value.forEach((filter) => {
        if (filter?.value) {
            params[filter.key] = filter.value;
        }
    });
    return params;
});

// 서버사이드 처리를 위한 필터 초기화 시 리페칭
let originFilters = JSON.parse(JSON.stringify(filters.value));

const refresh = () => {
    filters.value = JSON.parse(JSON.stringify(originFilters));
    fetchData();
};

const menus = ref([]);

///////////////////////// 페칭 /////////////////////////
const fetchData = async () => {
    try {
        loading.value = true;

        items.value = [];
        menus.value = [];

        const parseData = (arr) => {
            let result = [];
            for (const item of arr) {
                const objectCols = {
                    menu_cd: {
                        type: "key",
                        text: item.menu_cd,
                        value: item.menu_cd,
                    },
                    menu_nm: {
                        type: "text",
                        value: item.menu_nm,
                    },
                    sort_sn: {
                        type: "number",
                        value: item.sort_sn,
                    },
                    screen_menu_yn: {
                        type: "switch",
                        value: item.screen_menu_yn,
                    },
                    use_yn: {
                        type: "switch",
                        value: item.use_yn,
                    },
                    pgm_id: {
                        type: "autocomplete",
                        value: item.pgm_id,
                    },
                    reg_dt: dateFormatting(item.reg_dt),
                    modi_dt: dateFormatting(item.modi_dt),
                    shop_tcd: {
                        type: "code",
                        value: item.shop_tcd,
                    },
                };

                if (Array.isArray(item.childList)) {
                    result.push({
                        ...columns,
                        ...item,
                        ...objectCols,
                        childList: parseData(item.childList),
                    });
                } else {
                    result.push({
                        ...columns,
                        ...item,
                        ...objectCols,
                    });
                }
            }
            return result;
        };

        const param = {
            lang_cd: userSetInfo.value.lang_cd,

            sys_lang_cd: searchParams.value.sys_lang_cd,
            sys_menu_cd: searchParams.value.sys_menu_cd,
            menu_nm: searchParams.value.menu_nm,
            supi_menu_cd: searchParams.value.supi_menu_cd,
            use_yn: searchParams.value.use_yn,
            pgm_nm: searchParams.value.pgm_nm,
            reg_user_nm: searchParams.value.reg_user_nm,
            reg_dt: searchParams.value.reg_dt,
        };
        // 테이블
        const data = await menuMgmtRetrive(param);

        menus.value = JSON.parse(JSON.stringify(parseData(data)));
        items.value = parseData(data);
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await setCodes();
    await fetchData();
});

// 키, API
keyColumn.value = "menu_cd";
deleteApi.value = menuMgmtDelete;

// 좌측 리스트 선택
const BASE_MENU = "RMSM000000";
const activeMenu = ref(BASE_MENU);
const isActive = (menuCd) => {
    if (typeof activeMenu.value === "string") {
        return activeMenu.value === menuCd;
    } else {
        return activeMenu.value.menu_cd.value === menuCd;
    }
};

// 메뉴 리페칭
const menuStore = useMenu();

const refetchMenus = async () => {
    try {
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

        menuStore.menus = menuData;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);

        if (error.msg) {
            throw error;
        } else {
            throw {
                msg: commonCode("MESSAGE", "MSG000014"), // 데이터를 불러오지 못했습니다
                type: "error",
            };
        }
    }
};

// 버튼별 핸들러
const { languageAddHandler, deleteHandler, parseRaw } = dataTableStore;

const newColumns = (columns) => {
    let shop_tcd;
    if (activeMenu.value === BASE_MENU) {
        shop_tcd = {
            type: "autocomplete",
            value: null,
        };
    } else {
        shop_tcd = currentParent.value.shop_tcd;
    }

    return {
        ...columns,
        level_no: Array.isArray(currentParent.value)
            ? 1
            : currentParent.value.level_no + 1,
        supi_menu_cd: currentParent.value.menu_cd,
        shop_tcd,
    };
};

// 저장버튼 핸들러
const menuSaveHandler = async () => {
    try {
        if (addedItems.value.length === 0 && selected.value.length === 0) {
            throw {
                msg: commonCode("MESSAGE", "MSG000036"), // 변경 사항이 없습니다
                type: "warning",
            };
        }

        // 추가사항
        if (addedItems.value.length > 0) {
            await menuMgmtCreate(userSetInfo.value, parseRaw(addedItems.value));
        }

        // 선택 항목 중에서 추가버튼으로 추가 된 아이템 제거하고 수정 항목만 남김
        const updateItems = difference(
            selected.value,
            addedItems.value,
            keyColumn.value
        );

        // 수정사항
        if (updateItems.length > 0) {
            await menuMgmtUpdate(userSetInfo.value, parseRaw(updateItems));
        }

        // 데이터 초기화 리페칭
        addedItems.value = [];
        selected.value = [];
        await fetchData();

        const findCurrnetParent = (arr) => {
            for (const el of arr) {
                if (el.menu_cd.value === currentParent.value.menu_cd.value) {
                    currentParent.value = el;
                    items.value = el.childList;
                    return;
                }
                if (Array.isArray(el.childList)) {
                    findCurrnetParent(el.childList);
                }
            }
        };
        if (activeMenu.value !== BASE_MENU) {
            findCurrnetParent(menus.value);
        }

        await refetchMenus();

        return {
            msg: commonCode("MESSAGE", "MSG000020"), // 저장되었습니다
            type: "primary",
        };
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);

        if (error.msg) {
            throw error;
        } else {
            throw {
                msg: commonCode("MESSAGE", "MSG000021"), // 저장을 실패했습니다
                type: "error",
            };
        }
    }
};

const menuDeleteHandler = async () => {
    try {
        await deleteHandler();
        await refetchMenus();
        await fetchData();

        return {
            msg: commonCode("MESSAGE", "MSG000017"), // 삭제되었습니다
            type: "primary",
        };
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);

        if (error.msg) {
            throw error;
        } else {
            throw {
                msg: commonCode("MESSAGE", "MSG000018"), // 삭제를 실패했습니다
                type: "error",
            };
        }
    }
};

// 컨텐트헤더 우상단 버튼
const contentHeaderButtons = [
    {
        text: commonCode("RMS000020", "LB000074"), // 추가,
        handler: () => languageAddHandler(newColumns(columns)),
        method: [import.meta.env.VITE_BUTTON_TYPE_CREATE],
    },
    {
        text: commonCode("RMS000020", "LB000075"), // 삭제
        type: "error",
        handler: menuDeleteHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_DELETE],
    },
    {
        text: commonCode("RMS000020", "LB000076"), // 저장
        type: "primary",
        handler: menuSaveHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_UPDATE],
    },
];

///////////////////////// 메뉴선택 /////////////////////////
const setTableItems = (item) => {
    if (Array.isArray(item)) {
        items.value = item;
        activeMenu.value = BASE_MENU;
    } else {
        items.value = item.childList;
        activeMenu.value = item;
    }
    currentParent.value = item;
    page.value = 1;
    selected.value = [];
    addedItems.value = [];
};
</script>
