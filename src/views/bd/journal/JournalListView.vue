<template>
    <TheContentHeader
        v-model:filters="filters"
        :custom-refresh-function="refresh"
        :custom-search-function="setData"
        hide-excel-button
    >
        <template #prependActions>
            <div class="d-flex ga-3">
                <VChip color="green">
                    {{ `${codes.resultCd?.[0].code_nm}: ${okCount}` }}
                </VChip>
                <VChip>
                    {{ `${codes.resultCd?.[4].code_nm}: ${skipCount}` }}
                </VChip>

                <VChip color="warning">
                    {{ `${codes.resultCd?.[3].code_nm}: ${uncheckedCount}` }}
                </VChip>

                <VChip color="error">
                    {{ `${codes.resultCd?.[1].code_nm}: ${ngCount}` }}
                </VChip>
            </div>
        </template>

        <template #actions>
            <!-- 엑셀버튼 -->
            <VBtn
                v-if="buttonValidate(EXCEL_METHOD_CODE)"
                color="primary"
                prepend-icon="mdi-microsoft-excel"
                variant="outlined"
                :disabled="items?.length < 1"
                :loading="excelLoading"
                @click="excelHandler"
            >
                {{ commonCode("RMS000020", "LB000071") }}
            </VBtn>
        </template>
    </TheContentHeader>

    <ContainerSheet>
        <DataTablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :length="pageLength"
            :loading="loading"
        />
        <VDataTable
            v-model="selected"
            :headers="headers"
            :items="items"
            :page="page"
            :loading="loading"
            :items-per-page="itemsPerPage"
            return-object
        >
            <template #item.title="{ item }">
                <a class="text-link" @click="selectTitle(item)">
                    {{ item.title }}
                </a>
            </template>

            <template #item.shiftCd="{ item }">
                {{ item.shiftCd.text }}
            </template>

            <template #item.regDt="{ item }">
                {{ dateFormatting(item.regDt) }}
            </template>

            <template #bottom />
        </VDataTable>
    </ContainerSheet>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import {
    commonCode,
    bodyCommonCode,
    commonCodeGroup,
    bodyCommonCodeGroup,
} from "@/utils/code";
import { dateFormatting } from "@/utils/days";
import { useUser } from "@/stores/userStore";
import { usePageCodes } from "@/stores/pageCodesStore";
import { useToast } from "@/stores/toastStore";
import DataTablePagination from "@/components/DataTablePagination.vue";
import { vehlMgntRetrive } from "@/api/bd/bdm/vehicle";
import { getJournalInquiryWeekList } from "@/api/bd/journal/inquiry";
import { useRoute, useRouter } from "vue-router";
import { useDataTable } from "@/stores/dataTableStore";
import emitter from "@/utils/emitter";
import { useFavorite } from "@/stores/favoriteStore";
import { useMenu } from "@/stores/menuStore";
import { buttonValidate } from "@/utils/common";
import { downloadExcel } from "@/utils/excel";

const userStore = useUser();
const { shopShiftCodeGroup } = storeToRefs(userStore);
const { newToast } = useToast();

const props = defineProps({
    favoriteId: {
        type: String,
    },
    pathName: {
        type: String,
        required: true,
    },
});

// 공통코드 스토어
const pageCodesStore = usePageCodes();
const { codes } = storeToRefs(pageCodesStore);
const { user, shop } = storeToRefs(userStore);

const comCodeId = {
    resultCd: "RMS000034",
    shiftCd: shopShiftCodeGroup.value,
};

const comBdCodeId = {
    processId: "PROCESS",
};

const setCodes = async () => {
    let newCodes = {};

    // 시스템 공통코드
    for (const col in comCodeId) {
        const codeGroup = commonCodeGroup(comCodeId[col]);

        newCodes[col] = Object.keys(codeGroup).map((item) => ({
            com_cd: item,
            code_nm: codeGroup[item],
        }));
    }

    // 차체 공통코드
    for (const col in comBdCodeId) {
        const codeGroup = bodyCommonCodeGroup(comBdCodeId[col]);

        newCodes[col] = Object.keys(codeGroup).map((item) => ({
            com_cd: item,
            code_nm: codeGroup[item],
        }));
    }

    // 생산차종 목록
    await setVehlCodes();

    codes.value = Object.assign({}, codes.value, newCodes);
};

const setVehlCodes = async () => {
    const data = await vehlMgntRetrive();

    let codeKey = "";

    switch (shop.value.vehl_dsp_cd) {
        case "V":
            codeKey = "vehlCd";
            break;
        case "M":
            codeKey = "modelCd";
            break;
        case "P":
            codeKey = "prjVehlCd";
            break;
    }
    const codeList = data.map((item) => item[codeKey]);
    codes.value.vehlCd = codeList;
};

const setWeekDay = () => {
    let weekArray = [];

    const firstDay = dateFormatting(dayjs(dayjs()).format("YYYY-MM-DD"));

    for (let i = 0; i < 7; i++) {
        weekArray.push(
            dateFormatting(dayjs(firstDay).add(i, "day"), "YYYY-MM-DD")
        );
    }

    // const newDate = dateFormatting(dayjs());
    // const fromWeek = dayjs(newDate).day(1).format("YYYY-MM-DD");
    // let weekArray = [];

    // let startIndex = 1;
    // let endIndex = 7;

    // // 일요일 선택 시
    // if (dayjs(newDate).isBefore(fromWeek)) {
    //     startIndex = -6;
    //     toWeek = 0;
    // }

    // for (let i = startIndex; i <= endIndex; i++) {
    //     weekArray.push(dayjs(newDate).day(i).format("YYYY-MM-DD"));
    // }

    return weekArray;
};

const favoriteStore = useFavorite();
const menuStore = useMenu();

const favoriteParams = ref(null);
if (props.favoriteId) {
    favoriteParams.value = favoriteStore.getFavoriteParams(props.favoriteId);
}

let filters = ref([
    {
        key: "startDt",
        type: "weekDate",
        name: commonCode("RMS000020", "LB000333"), // 주단위 선택
        value: setWeekDay(),
        colsSm: 4,
        colsMd: 4,
        colsLg: 4,
        isRange: true,
    },
    {
        key: "shiftCd",
        type: "select",
        name: commonCode("RMS000020", "LB000334"),
        value: null,
        selectList: codes.value.shiftCd,
    },
    {
        key: "title",
        type: "text",
        name: commonCode("RMS000020", "LB000335"),
        value: null,
        colsSm: 6,
        colsMd: 6,
        colsLg: 6,
    },
    {
        key: "processId",
        type: "select",
        name: commonCode("RMS000020", "LB000020"),
        value: null,
        selectList: codes.value.processId,
    },
    {
        key: "vehlCd",
        type: "select",
        name: commonCode("RMS000020", "LB000041"),
        value: null,
        selectList: codes.value.vehlCd,
    },
]);

const searchParams = computed(() => {
    const params = {};
    filters.value.forEach((filter) => {
        if (filter?.value && filter.type !== "weekDate") {
            params[filter.key] = filter.value;
        }
    });
    return params;
});

// 서버사이드 처리를 위한 필터 초기화 시 리페칭
let originFilters = JSON.parse(JSON.stringify(filters.value));

const refresh = () => {
    filters.value = JSON.parse(JSON.stringify(originFilters));
    setData();
};

const dataTableStore = useDataTable();

const { page, itemsPerPage, pageLength, items, headers, selected, loading } =
    storeToRefs(dataTableStore);

// 카운트
const okCount = ref(0);
const skipCount = ref(0);
const uncheckedCount = ref(0);
const ngCount = ref(0);

// 테이블

const fetchData = async () => {
    try {
        loading.value = true;

        dataTableStore.resetDataTableStores();

        const selectedWeek = filters.value[0].value;

        const data = await getJournalInquiryWeekList({
            startDt: selectedWeek[0],
            endDt: selectedWeek[6],
            title: searchParams.value.title,
            shiftId: "RMS000025",
            shiftCd: searchParams.value.shiftCd,
            processId: searchParams.value.processId,
            vehlCd: searchParams.value.vehlCd,
        });

        okCount.value = data.inspectResCdCnt.okCnt;
        skipCount.value = data.inspectResCdCnt.skipCnt;
        uncheckedCount.value = data.inspectResCdCnt.uncheckedCnt;
        ngCount.value = data.inspectResCdCnt.ngCnt;

        setTableHeader();

        return data.list.map((item) => ({
            ...item,
            shiftCd: {
                type: "code",
                text: item.shiftCd
                    ? commonCode(userStore.shopShiftCodeGroup, item.shiftCd)
                    : null,
                value: item.shiftCd,
            },
            // shiftCd: item.shiftCd
            //     ? commonCode(userStore.shopShiftCodeGroup, item.shiftCd)
            //     : null,

            processId: item.processId
                ? bodyCommonCode("PROCESS", item.processId)
                : null,
        }));
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    } finally {
        loading.value = false;
    }
};

const setTableHeader = () => {
    const tableHeaderTitle = [
        { key: "title", title: commonCode("RMS000020", "LB000335") },
        { key: "shiftCd", title: commonCode("RMS000020", "LB000334") },
        { key: "processId", title: commonCode("RMS000020", "LB000020") },
        { key: "vehlCd", title: commonCode("RMS000020", "LB000041") },
    ];

    tableHeaderTitle.push(
        ...[
            { key: "okCnt", title: codes.value.resultCd[0].code_nm },
            { key: "skipCnt", title: codes.value.resultCd[4].code_nm },
            { key: "uncheckedCnt", title: codes.value.resultCd[3].code_nm },
            { key: "ngCnt", title: codes.value.resultCd[1].code_nm },
        ]
    );

    headers.value = tableHeaderTitle;
};

const router = useRouter();

const selectTitle = (item) => {
    const selectedWeek = filters.value[0].value;

    router.push({
        name: props.pathName,
        query: {
            jnlId: item.jnlId,
            startDt: selectedWeek[0],
            endDt: selectedWeek[6],
            version: item.version,
            shiftCd: item.shiftCd.value,
        },
    });
};

const setData = async () => {
    items.value = await fetchData();
};

const init = () => {
    if (props.favoriteId) {
        filters.value[1].value = favoriteParams.value?.shiftCd
            ? favoriteParams.value.shiftCd.value
            : null;
        filters.value[2].value = favoriteParams.value?.title
            ? favoriteParams.value.title.value
            : null;
        filters.value[3].value = favoriteParams.value?.processId
            ? favoriteParams.value.processId.value
            : null;
        filters.value[4].value = favoriteParams.value?.vehlCd
            ? favoriteParams.value.vehlCd.value
            : null;
    }

    emitter.on("addFavorite", async () => {
        const params = {
            shiftCd: {
                name: commonCode("RMS000020", "LB000334"),
                value: searchParams.value.shiftCd,
                valueNm: codes.value.shiftCd.find(
                    (item) => item.com_cd === searchParams.value.shiftCd
                )?.code_nm,
            },
            title: {
                name: commonCode("RMS000020", "LB000335"),
                value: searchParams.value.title,
                valueNm: searchParams.value.title,
            },
            processId: {
                name: commonCode("RMS000020", "LB000020"), // 공정
                value: searchParams.value.processId,
                valueNm: codes.value.processId.find(
                    (item) => item.com_cd === searchParams.value.processId
                )?.code_nm,
            },
            vehlCd: {
                name: commonCode("RMS000020", "LB000041"),
                value: searchParams.value.vehlCd,
                valueNm: searchParams.value.vehlCd,
            },
        };

        // 입력하지 않은 파라미터 제거
        for (const key in params) {
            if (!params[key].value) delete params[key];
        }

        await favoriteStore.addFavorite({
            menuCd: menuStore.currentPage.menu_cd,
            userId: user.value.user_id,
            shopCd: shop.value.shop_cd,
            parameter: JSON.stringify(params),
        });

        favoriteStore.getFavorite();
    });

    setCodes();

    setData();
};

// 엑셀버튼 기능코드
const EXCEL_METHOD_CODE = [import.meta.env.VITE_BUTTON_TYPE_EXCEL];

const excelLoading = ref(false);
const excelHandler = async () => {
    excelLoading.value = true;
    await downloadExcel(
        headers.value,
        items.value.map((item) => ({ ...item, shiftCd: item.shiftCd.text })),
        `${menuStore.currentPage.menu_nm} (${filters.value[0].value[0]}~${filters.value[0].value[6]})`
    );
    excelLoading.value = false;
};

onMounted(() => {
    init();
});

onUnmounted(() => {
    emitter.off("addFavorite");
});

watch(
    () => props.pathName,
    () => {
        init();
    }
);
</script>
