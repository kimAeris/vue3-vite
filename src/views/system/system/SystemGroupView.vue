<template>
    <TheContentHeader :buttons="contentHeaderButtons" />

    <VRow>
        <VCol cols="12" md="3">
            <VSheet class="elevation-1 pa-4">
                <VList color="primary">
                    <VListItem
                        rounded="lg"
                        :active="active === 'root'"
                        value="root"
                        @click="handleSelect(data, 'root')"
                    >
                        <!-- 전체목록 -->
                        {{ commonCode("RMS000020", "LB000205") }}
                    </VListItem>

                    <TreeList
                        :tree-data="rootGroup"
                        v-model:active="active"
                        id-key="hierarchyGroupId"
                        hide-last
                        @select="handleSelect"
                    />
                </VList>
            </VSheet>
        </VCol>
        <VCol cols="12" md="9">
            <VSheet class="elevation-1 pa-4">
                <DataTable />
            </VSheet>
        </VCol>
    </VRow>
</template>

<script setup>
import DataTable from "@/components/DataTable.vue";
import {
    getSystemGroup,
    createSystemGroup,
    removeSystemGroup,
} from "@/api/system/system";
import { onMounted, ref } from "vue";
import { commonCode, commonCodeGroup } from "@/utils/code";
import TreeList from "@/components/TreeList.vue";
import { useDataTable } from "@/stores/dataTableStore";
import { storeToRefs } from "pinia";
import { dateFormatting } from "@/utils/days";
import { usePageCodes } from "@/stores/pageCodesStore";
import { v4 } from "uuid";
import { useUser } from "@/stores/userStore";
import { useToast } from "@/stores/toastStore";
import { difference } from "@/utils/common";

///////////////////////// 페이지 공통 /////////////////////////
const userStore = useUser();
const { userSetInfo } = storeToRefs(userStore);

// 메시지 출력 용 토스트
const { newToast } = useToast();

///////////////////////// 테이블 /////////////////////////
const dataTableStore = useDataTable();

// 테이블 필요 스테이트
const {
    items,
    headers,
    loading,
    keyColumn,
    fetchApi,
    selected,
    addedItems,
    userParams,
} = storeToRefs(dataTableStore);

// 스토어 리셋
dataTableStore.resetDataTableStores();

keyColumn.value = "id";
userParams.value = userSetInfo;

// 공통코드 스토어
const pageCodesStore = usePageCodes();
const { codes } = storeToRefs(pageCodesStore);

// 행
const columns = {
    comCd: {
        type: "select",
        value: null,
    },
    descTxt: null,
    sortNo: {
        type: "number",
        value: null,
    },
    regDt: null,
    regNm: null,
    chgDt: null,
    chgNm: null,
};

// 헤더 명칭
const headerTitles = [
    commonCode("RMS000020", "LB000202"), // 코드명
    commonCode("RMS000020", "LB000203"), // 코드설명
    commonCode("RMS000020", "LB000204"), // 정렬번호
    commonCode("RMS000020", "LB000059"), // 등록일시
    commonCode("RMS000020", "LB000058"), // 등록자
    commonCode("RMS000020", "LB000061"), // 수정일시
    commonCode("RMS000020", "LB000060"), // 수정자
];

// 헤더
headers.value = dataTableStore.parseColumnHeaders(headerTitles, columns);

const fetchData = async () => {
    try {
        loading.value = true;
        return await getSystemGroup();
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    } finally {
        loading.value = false;
    }
};

let data;

const setData = async () => {
    data = await fetchData();
};

const active = ref("root");
const rootGroup = ref([]);

const CHILDREN_MAP = {
    root: "RMS000007",
    RMS000007: "RMS000008",
    RMS000008: "RMS000018",
    RMS000018: "RMS000002",
};

const ROOT_GROUP = {
    comCdId: "root",
    parentGroupId: null,
};
let activeItem = ROOT_GROUP;

const initGroup = () => {
    rootGroup.value = data;
};

const handleSelect = (item, id) => {
    if (id) active.value = id;

    let newItems = [];
    if (Array.isArray(item)) {
        newItems = item;
        activeItem = ROOT_GROUP;
    }
    if (item.children) {
        newItems = item.children;
        activeItem = item;
    }

    setCodeList();

    addedItems.value = [];
    selected.value = [];
    items.value = [];

    items.value = newItems.map((el) => ({
        ...columns,
        ...el,
        id: v4(),
        comCd: {
            type: "select",
            value: el.comCd,
        },
        sortNo: {
            type: "number",
            value: el.sortNo,
        },
        regDt: dateFormatting(el.regDt),
        chgDt: dateFormatting(el.chgDt),
    }));
};

const setCodeList = () => {
    const newCodes = commonCodeGroup(CHILDREN_MAP[activeItem.comCdId]);
    codes.value = {
        comCd: Object.keys(newCodes).map((item) => ({
            com_cd: item,
            code_nm: newCodes[item],
        })),
    };
};

onMounted(async () => {
    await setData();
    initGroup();
    handleSelect(data, "root");
});

// 버튼별 핸들러
const { addHandler } = dataTableStore;
fetchApi.value = setData;

const handleSave = async () => {
    try {
        const params = dataTableStore.parseRaw(selected.value);
        await createSystemGroup(
            params.map((item) => ({
                ...item,
                comCdId: CHILDREN_MAP[activeItem.comCdId],
                parentGroupId: activeItem.hierarchyGroupId,
            }))
        );

        addedItems.value = [];
        selected.value = [];

        await setData();
        initGroup();
        handleSelect(findActiveItem(data, active.value));

        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    }
};

const handleRemove = async () => {
    try {
        selected.value = difference(
            selected.value,
            addedItems.value,
            keyColumn.value
        );

        items.value = difference(
            items.value,
            addedItems.value,
            keyColumn.value
        );

        addedItems.value = [];

        if (!selected.value.length) return;

        const params = dataTableStore.parseRaw(selected.value);
        await removeSystemGroup(params);

        selected.value = [];

        await setData();
        initGroup();
        handleSelect(findActiveItem(data, active.value));

        newToast(commonCode("MESSAGE", "MSG000017"), "primary"); // 삭제되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000018"), "error"); // 삭제를 실패했습니다
    }
};

const findActiveItem = (treeArray, targetId) => {
    const searchNode = (tree, targetId) => {
        if (!tree) return null;
        if (tree.hierarchyGroupId === targetId) return tree;

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

// 컨텐트헤더 우상단 버튼
const contentHeaderButtons = [
    {
        text: commonCode("RMS000020", "LB000074"), // 추가,
        handler: () => addHandler(columns),
        method: [import.meta.env.VITE_BUTTON_TYPE_CREATE],
    },
    {
        text: commonCode("RMS000020", "LB000075"), // 삭제
        type: "error",
        handler: handleRemove,
        method: [import.meta.env.VITE_BUTTON_TYPE_DELETE],
    },
    {
        text: commonCode("RMS000020", "LB000076"), // 저장
        type: "primary",
        handler: handleSave,
        method: [import.meta.env.VITE_BUTTON_TYPE_UPDATE],
    },
];
</script>
