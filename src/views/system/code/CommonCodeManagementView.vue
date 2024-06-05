<template>
    <TheContentHeader
        v-model:filters="filters"
        :buttons="contentHeaderButtons"
        :custom-search-function="init"
        :custom-refresh-function="refresh"
    />

    <VRow height="100%">
        <VCol cols="12" md="3" height="100%">
            <ContainerSheet height="100%">
                <ContentSubheader>
                    <!-- 코드 -->
                    {{ commonCode("RMS000020", "LB000200") }}
                </ContentSubheader>

                <VList color="primary" max-height="600">
                    <VListItem
                        @click="handleSelect(data, BASE_CODE)"
                        rounded="lg"
                        :active="active === BASE_CODE"
                        :value="BASE_CODE"
                    >
                        <!-- 전체목록 -->
                        {{ commonCode("RMS000020", "LB000205") }}
                    </VListItem>

                    <TreeList
                        :tree-data="codeList"
                        v-model:active="active"
                        id-key="comCd"
                        :max-level="treeMaxLevel"
                        @select="handleSelect"
                    />
                </VList>
            </ContainerSheet>
        </VCol>
        <VCol cols="12" md="9" height="100%">
            <ContainerSheet height="100%">
                <DataTable language-pairing />
            </ContainerSheet>
        </VCol>
    </VRow>
</template>

<script setup>
import { ref, computed } from "vue";
import DataTable from "@/components/DataTable.vue";
import TreeList from "@/components/TreeList.vue";
import { useToast } from "@/stores/toastStore";
import { useDataTable } from "@/stores/dataTableStore";
import { storeToRefs } from "pinia";
import { difference } from "@/utils/common";
import {
    commCodeCreate,
    commCodeUpdate,
    commCodeDelete,
    getCommonCodeData,
} from "@/api/system/code";
import { useUser } from "@/stores/userStore";
import ContentSubheader from "@/components/ContentSubheader.vue";
import { commonCode } from "@/utils/code";
import { onMounted } from "vue";
import { useFeedback } from "@/stores/feedbackStore";

///////////////////////// 페이지 공통 /////////////////////////
const userStore = useUser();
const { userSetInfo } = storeToRefs(userStore);

///////////////////////// 테이블 /////////////////////////
const dataTableStore = useDataTable();

// 테이블 필요 스테이트
const {
    items,
    headers,
    loading,
    addedItems,
    selected,
    page,
    userParams,
    keyColumn,
    pairingColumns,
} = storeToRefs(dataTableStore);

// 파라미터에 필요한 유저 정보
userParams.value = userSetInfo.value;

// 메시지 출력 용 토스트
const { newToast } = useToast();

// 스토어 리셋
dataTableStore.resetDataTableStores();

// 행
const columns = {
    comCdId: null,
    comCd: null,
    langCd: null,
    codeNm: {
        type: "text",
        value: null,
    },
    descTxt: {
        type: "text",
        value: null,
    },
    sortNo: {
        type: "text",
        value: null,
    },
    useYn: {
        type: "switch",
        value: "N",
    },
};

// 언어에 따라 같이 변할 값
pairingColumns.value.push("comCd", "sortNo", "useYn");

// 헤더 명칭
const headerTitles = [
    "ID",
    commonCode("RMS000020", "LB000200"), // 코드
    commonCode("RMS000020", "LB000201"), // 언어
    commonCode("RMS000020", "LB000202"), // 코드명
    commonCode("RMS000020", "LB000203"), // 코드설명
    commonCode("RMS000020", "LB000204"), // 정렬번호
    commonCode("RMS000020", "LB000085"), // 사용여부
];

// 헤더
headers.value = dataTableStore.parseColumnHeaders(headerTitles, columns);

// 컨텐트헤더 하단 검색필터
const filters = ref([
    {
        key: "comCd",
        type: "text",
        name: commonCode("RMS000020", "LB000200"), // 코드
        value: null,
    },
    {
        key: "codeNm",
        type: "text",
        name: commonCode("RMS000020", "LB000202"), // 코드명
        value: null,
    },
    {
        key: "useYn",
        type: "select",
        name: commonCode("RMS000020", "LB000085"), // 사용여부
        value: null,
        selectList: [
            {
                code_nm: commonCode("RMS000020", "LB000006"), // 전체
                com_cd: null,
                status: "info",
            },
            {
                code_nm: commonCode("RMS000020", "LB000090"), // 사용
                com_cd: "Y",
                status: "success",
            },
            {
                code_nm: commonCode("RMS000020", "LB000091"), // 미사용
                com_cd: "N",
                status: "error",
            },
        ],
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
    init();
};

// 좌측 코드그룹
const codeList = ref([]);

const getMaxLevelAndBuildTree = (data, targetLangCd) => {
    let maxLevel = 1;
    const map = {};
    const roots = [];

    data.forEach((item) => {
        const { comCd } = item;
        if (!map[comCd] || map[comCd].langCd !== targetLangCd) {
            map[comCd] = { ...item, children: [] };
        }

        if (maxLevel < item.levelNo) maxLevel = item.levelNo;
    });

    Object.values(map).forEach((node) => {
        if (node.comCdId === "GROUP000000") {
            roots.push(node);
        } else {
            if (!map[node.comCdId]) {
                map[node.comCdId] = { children: [] };
            }
            map[node.comCdId].children.push(node);
        }
    });

    return {
        maxLevel,
        tree: roots,
    };
};

const active = ref(null);

///////////////////////// 페칭 /////////////////////////
let data = [];
let treeMaxLevel;

const fetchData = async () => {
    try {
        data = await getCommonCodeData(
            searchParams.value.comCd,
            searchParams.value.codeNm,
            searchParams.value.useYn
        );
    } catch (error) {
        throw error;
    }
};

const setData = async () => {
    try {
        loading.value = true;

        await fetchData();

        const { maxLevel, tree } = getMaxLevelAndBuildTree(
            data,
            userSetInfo.value.lang_cd
        );

        treeMaxLevel = maxLevel - 1;
        codeList.value = tree;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    } finally {
        loading.value = false;
    }
};

const BASE_CODE = "GROUP000000";

const ROOT_GROUP = {
    comCdId: null,
    comCd: BASE_CODE,
    langCd: userSetInfo.value.lang_cd.toUpperCase(),
    levelNo: 0,
};
let activeItem = ROOT_GROUP;

const handleSelect = (item, id) => {
    if (id) active.value = id;

    if (Array.isArray(item)) {
        activeItem = ROOT_GROUP;
    }
    if (item?.children) {
        activeItem = item;
    }

    const newItems = data.filter((el) => el.comCdId === activeItem.comCd);

    items.value = newItems.map((el) => ({
        ...columns,
        ...el,
        codeNm: {
            type: "text",
            value: el.codeNm,
        },
        descTxt: {
            type: "text",
            value: el.descTxt,
        },
        useYn: {
            type: "switch",
            value: el.useYn,
        },
    }));

    page.value = 1;
};

const init = async () => {
    await setData();
    handleSelect(codeList.value, BASE_CODE);
};

onMounted(async () => {
    await init();
});

// 키
keyColumn.value = "comCd";

const findActiveItem = (treeArray, targetId) => {
    const searchNode = (tree, targetId) => {
        if (!tree) return null;
        if (tree.comCd === targetId) return tree;

        if (tree.children && tree.children.length > 0) {
            for (const child of tree.children) {
                const result = searchNode(child, targetId);
                if (result) return result;
            }
        }

        return null;
    };

    for (const tree of treeArray) {
        const result = searchNode(tree, targetId);
        if (result) return result;
    }

    return null;
};

///////////////////////// 컨텐츠헤더 정의 /////////////////////////
// 버튼별 핸들러
const { languageAddHandler, parseRaw } = dataTableStore;

// 추가버튼 로직
const newColumns = (columns) => {
    const maxLevel = Math.max(...data.map((item) => item.levelNo));
    const nextLevel = activeItem.levelNo + 1;

    const newColumn = {
        ...columns,
        comCdId: activeItem.comCd,
        levelNo: nextLevel,
    };

    if (nextLevel === maxLevel) {
        newColumn.comCd = { type: "text", value: null };
    }

    return newColumn;
};

// 저장버튼 핸들러
const comCdSaveHandler = async () => {
    try {
        if (addedItems.value.length === 0 && selected.value.length === 0) {
            throw {
                msg: commonCode("MESSAGE", "MSG000036"), // 변경 사항이 없습니다
                type: "warning",
            };
        }

        // 추가사항
        if (addedItems.value.length > 0) {
            await commCodeCreate(
                userSetInfo.value,
                parseRaw(addedItems.value).map((item) => ({
                    com_cd_id: item.comCdId,
                    com_cd: item.comCd,
                    lang_cd: item.langCd,
                    code_nm: item.codeNm,
                    desc_txt: item.descTxt,
                    sort_no: item.sortNo,
                    use_yn: item.useYn,
                    level_no: item.levelNo,
                    langCd: item.langCd,
                }))
            );
        }

        // 선택 항목 중에서 추가버튼으로 추가 된 아이템 제거하고 수정 항목만 남김
        const updateItems = difference(
            selected.value,
            addedItems.value,
            keyColumn.value
        );

        // 수정사항
        if (updateItems.length > 0) {
            await commCodeUpdate(
                userSetInfo.value,
                parseRaw(updateItems).map((item) => ({
                    com_cd_id: item.comCdId,
                    com_cd: item.comCd,
                    lang_cd: item.langCd,
                    code_nm: item.codeNm,
                    desc_txt: item.descTxt,
                    sort_no: item.sortNo,
                    use_yn: item.useYn,
                    level_no: item.levelNo,
                    langCd: item.langCd,
                }))
            );
        }

        // 데이터 초기화 리페칭
        addedItems.value = [];
        selected.value = [];
        await setData();

        const selectedData = findActiveItem(codeList.value, active.value);
        handleSelect(selectedData);

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

const { openFeedback } = useFeedback();

// 삭제 핸들러
const deleteHandler = async () => {
    try {
        if (selected.value.length === 0) {
            throw {
                msg: commonCode("MESSAGE", "MSG000105"), // 값을 선택해주세요
                type: "warning",
            };
        }

        const confirm = await openFeedback(
            "error",
            commonCode("RMS000020", "LB000075"), // 삭제
            commonCode("MESSAGE", "MSGI000174"), // 공통코드를 삭제 할 시 예상치 못 한 시스템 오류가 발생 할 수 있습니다. 삭제하시겠습니까?,
            commonCode("RMS000020", "LB000120"), // 취소
            {
                type: "error",
                text: commonCode("RMS000020", "LB000075"), // 삭제
            },
            commonCode("MESSAGE", "MSGI000175") // 공통코드 삭제
        );
        if (!confirm) return;

        await commCodeDelete(
            userSetInfo.value,
            parseRaw(selected.value).map((item) => ({
                com_cd_id: item.comCdId,
                com_cd: item.comCd,
                lang_cd: item.langCd,
                langCd: item.langCd,
            }))
        );

        items.value = difference(items.value, selected.value, keyColumn.value);

        selected.value = [];
        await setData();

        const selectedData = findActiveItem(codeList.value, active.value);
        handleSelect(selectedData);

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
        handler: deleteHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_DELETE],
    },
    {
        text: commonCode("RMS000020", "LB000076"), // 저장
        type: "primary",
        handler: comCdSaveHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_UPDATE],
    },
];
</script>
