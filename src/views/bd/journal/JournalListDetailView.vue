<template>
    <VRow>
        <VCol cols="12">
            <VSheet class="py-4 px-6" elevation="1">
                <ContentSubheader>
                    <div class="d-flex align-center ga-2">
                        <h6>
                            {{ pageTitle }}
                        </h6>
                    </div>

                    <template #append>
                        <div class="d-flex align-center ga-2 mb-2">
                            <VBtn
                                @click="router.back"
                                variant="outlined"
                                color="primary"
                            >
                                <!-- 이전 -->
                                {{ commonCode("RMS000020", "LB000134") }}
                            </VBtn>
                            <VBtn
                                color="primary"
                                prepend-icon="mdi-microsoft-excel"
                                variant="outlined"
                                @click="downloadExcel"
                            >
                                <!-- 엑셀 -->
                                {{ commonCode("RMS000020", "LB000071") }}
                            </VBtn>
                        </div>
                    </template>
                </ContentSubheader>

                <div class="d-flex ga-12 px-2">
                    <UpperLabelText
                        :label="commonCode('RMS000020', 'LB000335')"
                        :text="resultData?.std?.title"
                    />
                    <UpperLabelText
                        :label="commonCode('RMS000020', 'LB000383')"
                        :text="stdPeriod"
                    />

                    <UpperLabelText
                        v-if="resultData?.std?.shiftYn === 'Y'"
                        :label="commonCode('RMS000020', 'LB000334')"
                        :text="
                            commonCode(
                                shopShiftCodeGroup,
                                selectedList?.shiftCd
                            )
                        "
                    />
                </div>
            </VSheet>
        </VCol>
    </VRow>

    <VRow>
        <VCol cols="12">
            <VSheet class="py-4 px-6" elevation="1">
                <ContentSubheader>
                    <div class="d-flex align-end ga-2">
                        <h6>{{ commonCode("RMS000020", "LB000384") }}</h6>
                        <span
                            v-if="resultData?.imageList?.length > 0"
                            class="text-body-2 d-none d-sm-inline mb-1"
                        >
                            {{
                                `(${imgPage}/${resultData?.imageList?.length})`
                            }}
                        </span>
                    </div>

                    <template #append>
                        <div class="ml-auto d-flex ga-3 mb-2">
                            <VBtn
                                variant="outlined"
                                color="primary"
                                prepend-icon="mdi-minus"
                                @click="toggleImageFilter"
                            >
                                <template #prepend>
                                    <VIcon
                                        v-if="imageVisibleFilter"
                                        icon="mdi-minus"
                                    >
                                    </VIcon>
                                    <VIcon
                                        v-if="!imageVisibleFilter"
                                        icon="mdi-plus"
                                    >
                                    </VIcon>
                                </template>

                                <span v-if="imageVisibleFilter">
                                    <!-- 접기 -->
                                    {{ commonCode("RMS000020", "LB000370") }}
                                </span>
                                <span v-if="!imageVisibleFilter">
                                    <!-- 펼치기 -->
                                    {{ commonCode("RMS000020", "LB000371") }}
                                </span>
                            </VBtn>
                        </div>
                    </template>
                </ContentSubheader>

                <VExpandTransition>
                    <div v-show="imageVisibleFilter">
                        <VCarousel
                            v-if="resultData?.imageList?.length > 0"
                            v-model="imgPage"
                            hide-delimiters
                            style="height: 300px"
                        >
                            <template #prev>
                                <VBtn
                                    variant="text"
                                    icon="mdi-chevron-left"
                                    @click="movePage(-1)"
                                />
                            </template>

                            <template #next>
                                <VBtn
                                    variant="text"
                                    icon="mdi-chevron-right"
                                    @click="movePage(1)"
                                />
                            </template>

                            <VCarouselItem
                                v-for="(img, index) in imageItems"
                                :value="index + 1"
                            >
                                <VSkeletonLoader
                                    :loading="img.loading"
                                    class="w-100 h-100 rounded-lg"
                                >
                                    <VImg :src="img.src" :lazy-src="img.src" />
                                </VSkeletonLoader>
                            </VCarouselItem>
                        </VCarousel>

                        <div v-else class="px-1 text-medium-emphasis">
                            {{ commonCode("MESSAGE", "MSGI000147") }}
                        </div>
                    </div>
                </VExpandTransition>
            </VSheet>
        </VCol>
    </VRow>

    <VRow>
        <VCol cols="12">
            <VSheet class="py-4 px-6" elevation="1">
                <ContentSubheader>
                    <div class="d-flex align-center ga-2">
                        <h6>{{ commonCode("RMS000020", "LB000045") }}</h6>
                    </div>

                    <template #append>
                        <div class="ml-auto d-flex ga-3 mb-2">
                            <VBtn
                                variant="outlined"
                                color="primary"
                                prepend-icon="mdi-minus"
                                @click="toggleInfoFilter"
                            >
                                <template #prepend>
                                    <VIcon
                                        v-if="infoVisibleFilter"
                                        icon="mdi-minus"
                                    >
                                    </VIcon>
                                    <VIcon
                                        v-if="!infoVisibleFilter"
                                        icon="mdi-plus"
                                    >
                                    </VIcon>
                                </template>

                                <span v-if="infoVisibleFilter">
                                    <!-- 접기 -->
                                    {{ commonCode("RMS000020", "LB000370") }}
                                </span>
                                <span v-if="!infoVisibleFilter">
                                    <!-- 펼치기 -->
                                    {{ commonCode("RMS000020", "LB000371") }}
                                </span>
                            </VBtn>
                        </div>
                    </template>
                </ContentSubheader>

                <VExpandTransition>
                    <div v-show="infoVisibleFilter">
                        <VDataTable
                            class="overflow-auto"
                            :headers="infoTableHeaders"
                            :items="infoTableItems"
                            fixed-header
                            return-object
                        >
                            <template #bottom />
                        </VDataTable>
                    </div>
                </VExpandTransition>
            </VSheet>
        </VCol>
    </VRow>

    <VRow>
        <VCol cols="12">
            <VSheet class="py-4 px-6" elevation="1">
                <ContentSubheader>
                    <div class="d-flex align-center ga-2">
                        <h6>{{ commonCode("RMS000020", "LB000032") }}</h6>
                    </div>
                    <template #append>
                        <div class="ml-auto d-flex ga-3 mb-2">
                            <VBtn
                                variant="outlined"
                                color="primary"
                                prepend-icon="mdi-minus"
                                @click="toggleDataFilter"
                            >
                                <template #prepend>
                                    <VIcon
                                        v-if="dataVisibleFilter"
                                        icon="mdi-minus"
                                    >
                                    </VIcon>
                                    <VIcon
                                        v-if="!dataVisibleFilter"
                                        icon="mdi-plus"
                                    >
                                    </VIcon>
                                </template>

                                <span v-if="dataVisibleFilter">
                                    <!-- 접기 -->
                                    {{ commonCode("RMS000020", "LB000370") }}
                                </span>
                                <span v-if="!dataVisibleFilter">
                                    <!-- 펼치기 -->
                                    {{ commonCode("RMS000020", "LB000371") }}
                                </span>
                            </VBtn>
                        </div>
                    </template>
                </ContentSubheader>

                <VExpandTransition>
                    <div v-show="dataVisibleFilter">
                        <!-- 부위 X -->
                        <VDataTable
                            v-if="resultData?.std?.partYn === 'N'"
                            :headers="dataTableHeaders"
                            :items="dataTableItems"
                            return-object
                            style="max-height: 9999px"
                        >
                            <template #headers="{ columns }">
                                <tr>
                                    <template v-for="col in columns">
                                        <th
                                            v-if="col.header === 'round'"
                                            rowspan="2"
                                            class="text-center"
                                            :style="borderRightStyle"
                                        >
                                            {{ col.title }}
                                        </th>
                                    </template>

                                    <th
                                        v-for="col in daysHeaders"
                                        class="text-center"
                                        :colspan="col.colspan"
                                        :style="borderHeaderStyle"
                                    >
                                        {{ col.title }}
                                    </th>
                                </tr>

                                <tr>
                                    <!-- 차종 -->
                                    <template v-for="col in columns">
                                        <th
                                            v-if="col.header === 'data'"
                                            class="text-center"
                                            :style="borderRightStyle"
                                        >
                                            {{ col.title }}
                                        </th>
                                    </template>
                                </tr>
                            </template>

                            <template #item="{ item }">
                                <tr>
                                    <template v-for="(v, k) in item">
                                        <td
                                            v-if="v.visible && !v.colspan"
                                            :class="v.class"
                                            class="text-center"
                                        >
                                            {{ v.value }}
                                        </td>

                                        <td
                                            v-if="v.visible && v.colspan"
                                            :colspan="v.colspan"
                                            class="text-center td-skip"
                                        >
                                            {{ v.value }}
                                        </td>
                                    </template>
                                </tr>
                            </template>

                            <template #bottom />
                        </VDataTable>

                        <!-- 부위 O -->
                        <VDataTable
                            v-if="resultData?.std?.partYn === 'Y'"
                            :headers="dataTableHeaders"
                            :items="dataTableItems"
                            :items-per-page="Number.MAX_SAFE_INTEGER"
                            return-object
                            style="max-height: 9999px"
                        >
                            <template #headers="{ columns }">
                                <tr>
                                    <template v-for="col in columns">
                                        <th
                                            class="text-center"
                                            :colspan="col?.colspan"
                                        >
                                            {{ col.title }}
                                        </th>
                                    </template>
                                </tr>
                            </template>

                            <template #item="{ item }">
                                <tr>
                                    <template v-for="(v, k) in item">
                                        <td
                                            v-if="v?.visible !== false"
                                            :rowspan="v?.rowspan"
                                            class="text-center"
                                            :class="v?.class"
                                        >
                                            <span v-if="typeof v === 'object'">
                                                {{ v.text }}
                                            </span>
                                            <span v-else> {{ v }}</span>
                                        </td>
                                    </template>
                                </tr>
                            </template>

                            <template #bottom />
                        </VDataTable>
                    </div>
                </VExpandTransition>
            </VSheet>
        </VCol>
    </VRow>

    <VRow>
        <VCol cols="12">
            <VSheet class="py-4 px-6" elevation="1">
                <ContentSubheader>
                    <div class="d-flex align-center ga-2">
                        <h6>{{ commonCode("RMS000020", "LB000386") }}</h6>
                    </div>
                    <template #append>
                        <DataTablePagination
                            :hideTitle="true"
                            v-model:page="faultPage"
                            v-model:items-per-page="faultItemsPerPage"
                            :length="faultPageLength"
                            :loading="faultLoading"
                            hideDivider
                        />
                        <div class="ml-auto d-flex ga-3 mb-2">
                            <VBtn
                                variant="outlined"
                                color="primary"
                                prepend-icon="mdi-minus"
                                @click="toggleFaultFilter"
                            >
                                <template #prepend>
                                    <VIcon
                                        v-if="faultVisibleFilter"
                                        icon="mdi-minus"
                                    >
                                    </VIcon>
                                    <VIcon
                                        v-if="!faultVisibleFilter"
                                        icon="mdi-plus"
                                    >
                                    </VIcon>
                                </template>

                                <span v-if="faultVisibleFilter">
                                    <!-- 접기 -->
                                    {{ commonCode("RMS000020", "LB000370") }}
                                </span>
                                <span v-if="!faultVisibleFilter">
                                    <!-- 펼치기 -->
                                    {{ commonCode("RMS000020", "LB000371") }}
                                </span>
                            </VBtn>
                        </div>
                    </template>
                </ContentSubheader>

                <VExpandTransition>
                    <div v-show="faultVisibleFilter">
                        <VDataTable
                            class="overflow-auto"
                            :headers="faultTableHeaders"
                            :items="faultTableItems"
                            :page="faultPage"
                            :loading="faultLoading"
                            :items-per-page="faultItemsPerPage"
                            fixed-header
                            return-object
                        >
                            <template #bottom />
                        </VDataTable>
                    </div>
                </VExpandTransition>
            </VSheet>
        </VCol>
    </VRow>

    <VRow>
        <VCol cols="12">
            <VSheet class="py-4 px-6" elevation="1">
                <ContentSubheader>
                    <div class="d-flex align-center ga-2">
                        <h6>{{ commonCode("RMS000020", "LB000036") }}</h6>
                    </div>
                    <template #append>
                        <DataTablePagination
                            :hideTitle="true"
                            v-model:page="remarkPage"
                            v-model:items-per-page="remarkItemsPerPage"
                            :length="remarkPageLength"
                            :loading="remarkLoading"
                            hideDivider
                        />

                        <div class="ml-auto d-flex ga-3 mb-2">
                            <VBtn
                                variant="outlined"
                                color="primary"
                                prepend-icon="mdi-minus"
                                @click="toggleRemarkFilter"
                            >
                                <template #prepend>
                                    <VIcon
                                        v-if="remarkVisibleFilter"
                                        icon="mdi-minus"
                                    >
                                    </VIcon>
                                    <VIcon
                                        v-if="!remarkVisibleFilter"
                                        icon="mdi-plus"
                                    >
                                    </VIcon>
                                </template>

                                <span v-if="remarkVisibleFilter">
                                    <!-- 접기 -->
                                    {{ commonCode("RMS000020", "LB000370") }}
                                </span>
                                <span v-if="!remarkVisibleFilter">
                                    <!-- 펼치기 -->
                                    {{ commonCode("RMS000020", "LB000371") }}
                                </span>
                            </VBtn>
                        </div>
                    </template>
                </ContentSubheader>

                <VExpandTransition>
                    <div v-show="remarkVisibleFilter">
                        <VDataTable
                            class="overflow-auto"
                            :headers="remarkTableHeaders"
                            :items="remarkTableItems"
                            :page="remarkPage"
                            :loading="remarkLoading"
                            :items-per-page="remarkItemsPerPage"
                            fixed-header
                            return-object
                        >
                            <template #bottom />
                        </VDataTable>
                    </div>
                </VExpandTransition>
            </VSheet>
        </VCol>
    </VRow>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMenu } from "@/stores/menuStore";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

import { commonCode, commonCodeGroup } from "@/utils/code";

import UpperLabelText from "@/components/UpperLabelText.vue";
import ContentSubheader from "@/components/ContentSubheader.vue";
import DataTablePagination from "@/components/DataTablePagination.vue";

import { usePageCodes } from "@/stores/pageCodesStore";
import { useUser } from "@/stores/userStore";
import { useToast } from "@/stores/toastStore";

import { getJournalInquiryWeekDetailList } from "@/api/bd/journal/inquiry";

import { bodyDownload } from "@/api/bd/bdCommon";
import noImage from "@/assets/no-image.svg";

import ExcelJS from "exceljs";
import theme from "@/plugins/vuetify/config/theme";

import { columnsToHeaders, drawBody, drawHaeders } from "@/utils/excel";
import { styles } from "@/utils/excel";
import { removeSpecialCharAndSpace } from "@/utils/regex";
import { useFavorite } from "@/stores/favoriteStore";
import { onUnmounted } from "vue";

const props = defineProps({
    parentPath: {
        type: String,
        required: true,
    },
    jnlId: {
        type: String,
    },
    startDt: {
        type: String,
    },
    endDt: {
        type: String,
    },
    version: {
        type: String,
    },
    shiftCd: {
        type: String,
    },
});

const pageTitle = computed(
    () => `${currentPage.value?.supi_menu_cd_nm} 결과조회 상세`
);

// 필터 숨김
const imageVisibleFilter = ref(true);
const infoVisibleFilter = ref(true);
const dataVisibleFilter = ref(true);
const faultVisibleFilter = ref(true);
const remarkVisibleFilter = ref(true);

const toggleImageFilter = () => {
    imageVisibleFilter.value = !imageVisibleFilter.value;
};
const toggleInfoFilter = () => {
    infoVisibleFilter.value = !infoVisibleFilter.value;
};
const toggleDataFilter = () => {
    dataVisibleFilter.value = !dataVisibleFilter.value;
};
const toggleFaultFilter = () => {
    faultVisibleFilter.value = !faultVisibleFilter.value;
};
const toggleRemarkFilter = () => {
    remarkVisibleFilter.value = !remarkVisibleFilter.value;
};
// 현재 페이지
const { currentPage, flatMenus } = storeToRefs(useMenu());
const selectedList = ref({});

const router = useRouter();

const userStore = useUser();
const { shopShiftCodeGroup } = storeToRefs(userStore);
const { newToast } = useToast();

// 공통코드 스토어
const pageCodesStore = usePageCodes();
const { codes } = storeToRefs(pageCodesStore);

const comCodeId = {
    shiftCd: shopShiftCodeGroup.value,
};

const setCodes = () => {
    let newCodes = {};

    // 시스템 공통코드
    for (const col in comCodeId) {
        const codeGroup = commonCodeGroup(comCodeId[col]);

        newCodes[col] = Object.keys(codeGroup).map((item) => ({
            com_cd: item,
            code_nm: codeGroup[item],
        }));
    }

    codes.value = newCodes;
};

const infoTableHeaders = [
    { key: "title", title: commonCode("RMS000020", "LB000245") },
    { key: "contents", title: commonCode("RMS000020", "LB000026") },
];

const dataTableHeaders = ref([]);

const faultTableHeaders = computed(() => {
    let headers = [
        { key: "resYmd", title: commonCode("RMS000020", "LB000332") },
        { key: "vehlCd", title: commonCode("RMS000020", "LB000041") },
        { key: "bodyNo", title: resultData.value?.std?.bodyNoTypeCd },
        { key: "zoneNm", title: commonCode("RMS000022", "ZONE") },
        { key: "equip", title: commonCode("RMS000020", "LB000042") }, // 설비
        { key: "point", title: commonCode("RMS000020", "LB000405") }, // 불량부위
        { key: "fault", title: commonCode("RMS000022", "FAULT") },
        { key: "action", title: commonCode("RMS000022", "ACTION") },
    ];

    if (resultData.value?.std?.zoneYn === "N") {
        headers = headers.filter((item) => item.key !== "zoneNm");
    }
    if (resultData.value?.std?.bodyNoYn === "N") {
        headers = headers.filter((item) => item.key !== "bodyNo");
    }

    return headers;
});

const remarkTableHeaders = [
    { key: "resYmd", title: commonCode("RMS000020", "LB000332") },
    { key: "shiftCd", title: commonCode("RMS000020", "LB000051") },
    { key: "remark", title: commonCode("RMS000020", "LB000026") },
];

// border style
const themeOnSurface = "--v-theme-surface";
const borderOpacity = "--v-medium-emphasis-opacity";

const borderRightStyle = ref({
    borderRight: `1px solid rgba(var(${themeOnSurface}),var(${borderOpacity})) !important`,
});

const borderHeaderStyle = ref({
    borderBottom: `1px solid rgba(var(${themeOnSurface}),var(${borderOpacity})) !important`,
    borderRight: `1px solid rgba(var(${themeOnSurface}),var(${borderOpacity})) !important`,
});

// 페이징
const faultLoading = ref(false);
const faultPage = ref(1);
const faultItemsPerPage = ref(10);
const faultPageLength = computed(() => {
    const length = Math.ceil(
        faultTableItems.value?.length / faultItemsPerPage.value
    );
    if (length > 0 && length < faultPage.value) faultPage.value = length;
    return length;
});

const remarkLoading = ref(false);
const remarkPage = ref(1);
const remarkItemsPerPage = ref(10);
const remarkPageLength = computed(() => {
    const length = Math.ceil(
        remarkTableItems.value?.length / remarkItemsPerPage.value
    );
    if (length > 0 && length < remarkPage.value) remarkPage.value = length;
    return length;
});

const stdPeriod = ref("");
const resultData = ref({});

const infoTableItems = ref([]);
const dataTableItems = ref([]);
const faultTableItems = ref([]);
const remarkTableItems = ref([]);

const imageItems = ref([]);

const fetchData = async () => {
    try {
        const data = await getJournalInquiryWeekDetailList({
            startDt: selectedList.value.startDt,
            endDt: selectedList.value.endDt,
            jnlId: selectedList.value.jnlId,
            version: selectedList.value.version,
            shiftCd: selectedList.value.shiftCd,
        });

        resultData.value = data;

        faultTableItems.value = data.faultList.map((item) => ({
            ...item,
            equip: item.pointNm && JSON.parse(item.pointNm).equip,
            point: item.pointNm && JSON.parse(item.pointNm).point,
        }));

        infoTableItems.value = data.infoList;
        remarkTableItems.value = data.remarkList.map((item) => ({
            ...item,
            shiftCd: commonCode(shopShiftCodeGroup.value, item.shiftCd),
        }));
        imageItems.value = data.imageList;

        if (data.std.partYn === "N") setInspectList(data);
        else setInspectPartList(data);

        setVehicleImages(data);
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    }
};

const daysHeaders = ref([]);

// 부위 X 목록
const setInspectList = (data) => {
    const startDt = dayjs(selectedList.value.startDt);
    const endDt = dayjs(selectedList.value.endDt);

    const roundHeader = [
        {
            header: "round",
            key: "round",
            title: commonCode("RMS000029", "ROUND"),
        },
    ];
    const daysHeader = [];
    let dataHeader = [];

    const cols = data.std.bodyNoYn === "Y" ? "3" : "2";

    for (let day = startDt; day <= endDt; day = day.add(1, "day")) {
        daysHeader.push({
            header: "day",
            key: day.format("MM/DD"),
            title: `${day.format("MM/DD")}(${day.format("dddd")})`,
            colspan: cols,
        });

        dataHeader.push(
            {
                header: "data",
                key: `vehlCd${day.format("DD")}`,
                title: commonCode("RMS000020", "LB000041"),
            },
            {
                header: "data",
                key: `bodyNo${day.format("DD")}`,
                title: data.std.bodyNoTypeCd,
            },
            {
                header: "data",
                key: `result${day.format("DD")}`,
                title: commonCode("RMS000020", "LB000047"),
            }
        );
    }

    // 바디번호 사용안할 때 데이터 제거
    if (data.std.bodyNoYn === "N") {
        dataHeader = dataHeader.filter((item) => !item.key.includes("bodyNo"));
    }

    daysHeaders.value = daysHeader;
    dataTableHeaders.value = [...roundHeader, ...dataHeader];

    const dataList = [];
    for (let i = 1; i <= data.std.maxRound; i++) {
        let rowData = {
            round: {
                visible: true,
                value: `${i}${commonCode("RMS000020", "LB000337")}`,
            },
        };

        for (let day = startDt; day <= endDt; day = day.add(1, "day")) {
            rowData[`vehlCd${day.format("DD")}`] = { visible: true, value: "" };
            rowData[`bodyNo${day.format("DD")}`] = { visible: true, value: "" };
            rowData[`result${day.format("DD")}`] = { visible: true, value: "" };
        }

        const list = data.inspectList.filter((item) => item.round === i);
        list.forEach((item) => {
            if (item.skipYn === "N") {
                rowData[`vehlCd${item.resYmd.slice(-2)}`] = {
                    visible: true,
                    value: item?.vehlCd,
                };
                rowData[`bodyNo${item.resYmd.slice(-2)}`] = {
                    visible: true,
                    value: item?.bodyNo,
                };
                rowData[`result${item.resYmd.slice(-2)}`] = {
                    visible: true,
                    value: item?.inspectVal,
                    class: item.result === "NG" && "td-ng",
                };
            } else {
                rowData[`vehlCd${item.resYmd.slice(-2)}`] = {
                    visible: true,
                    colspan: cols,
                    value: commonCode("RMS000020", "LB000403"),
                };
                rowData[`bodyNo${item.resYmd.slice(-2)}`] = {
                    visible: false,
                    value: item?.bodyNo,
                };
                rowData[`result${item.resYmd.slice(-2)}`] = {
                    visible: false,
                    value: item?.inspectVal,
                    class: item.result === "NG" && "td-ng",
                };
            }
        });

        // 바디번호 사용안할 때 데이터 제거
        if (data.std.bodyNoYn === "N") {
            for (const key in rowData) {
                if (key.includes("bodyNo")) {
                    delete rowData[key];
                }
            }
        }
        dataList.push(JSON.parse(JSON.stringify(rowData)));
    }

    dataTableItems.value = dataList;
};
// 부위 O 목록
const setInspectPartList = (data) => {
    const startDt = dayjs(selectedList.value.startDt);
    const endDt = dayjs(selectedList.value.endDt);

    let tableHeader = [];
    if (data.std.shiftYn === "Y")
        tableHeader = [
            {
                key: "round",
                title: commonCode("RMS000020", "LB000051"),
                colspan: "2",
            },
        ];
    else
        tableHeader = [
            { key: "division", title: commonCode("RMS000020", "LB000051") },
        ];

    for (let day = startDt; day <= endDt; day = day.add(1, "day")) {
        tableHeader.push({
            key: `day${day.format("DD")}`,
            title: `${day.format("MM/DD")}(${day.format("dddd")})`,
        });
    }

    dataTableHeaders.value = tableHeader;

    const dataList = [];
    for (let i = 1; i <= data.std.maxRound; i++) {
        const roundList = [];

        const vehlRow = {};
        const bodyRow = {};

        // 교대 없으면 회차 제거
        if (data.std.shiftYn === "Y")
            vehlRow.round = {
                visible: true,
                text: `${i}${commonCode("RMS000020", "LB000337")}`,
            };
        vehlRow.division = commonCode("RMS000020", "LB000041");

        if (data.std.shiftYn === "Y") {
            bodyRow.round = { visible: false, text: i };
        }
        bodyRow.division = data.std.bodyNoTypeCd;

        const partList = data.partList.filter((item) => item.round === i);

        const partData = [];

        // rowspan 갯수
        let rowspanCnt = 2 + partList.length;

        partList.forEach((item) => {
            const partRow = {};

            // 부위 이름
            let name = "";
            const partName = Object.keys(item).filter((key) =>
                key.includes("PartNm")
            );
            for (let key of partName) {
                name += item[key];
            }

            // 라운드 rowspan 값 지정
            if (data.std.shiftYn === "Y") vehlRow.round.rowspan = rowspanCnt;

            // 행 저장
            partRow.round = {
                visible: false,
                text: i,
            };

            partRow.division = {
                text: name,
                value: item.partId,
            };
            partData.push(partRow);
        });

        for (let day = startDt; day <= endDt; day = day.add(1, "day")) {
            const row = data.inspectList.find(
                (item) =>
                    item.round === i &&
                    item.resYmd.slice(-2) === day.format("DD")
            );

            if (row?.roundSkipYn === "Y") {
                vehlRow[`day${day.format("DD")}`] = {
                    text: commonCode("RMS000034", "4"),
                    rowspan: rowspanCnt,
                    class: "td-skip",
                };
                bodyRow[`day${day.format("DD")}`] = {
                    text: commonCode("RMS000034", "4"),
                    visible: false,
                };
            } else {
                vehlRow[`day${day.format("DD")}`] = row?.vehlCd;
                bodyRow[`day${day.format("DD")}`] = row?.bodyNo;
            }

            partData.forEach((part) => {
                const row = data.inspectList.find(
                    (item) =>
                        item.round === i &&
                        item.resYmd.slice(-2) === day.format("DD") &&
                        item.partId === part.division.value
                );

                // 라운드 전체 스킵
                if (row?.roundSkipYn === "Y") {
                    part[`day${day.format("DD")}`] = {
                        text: commonCode("RMS000034", "4"),
                        visible: false,
                    };
                }
                // 부위 스킵
                else if (row?.skipYn === "Y") {
                    part[`day${day.format("DD")}`] = {
                        text: commonCode("RMS000034", "4"),
                        class: "td-skip",
                    };
                } else {
                    part[`day${day.format("DD")}`] = {
                        text: row?.inspectVal,
                        value: row?.inspectVal,
                        class: row?.result === "NG" && "td-ng",
                    };
                }
            });
        }
        roundList.push(vehlRow);

        // 바디번호 사용할때만 데이터 push
        if (data.std.bodyNoYn === "Y") {
            roundList.push(bodyRow);
        }
        roundList.push(...partData);

        dataList.push(...roundList);
    }

    dataTableItems.value = dataList;
};

// 이미지 뷰어
const imgPage = ref(1);
const movePage = (value) => {
    const newPage = imgPage.value + value;
    if (newPage > imageItems.value.length) {
        imgPage.value = 1;
    } else if (newPage < 1) {
        imgPage.value = imageItems.value.length;
    } else {
        imgPage.value = newPage;
    }
};

// 이미지 다운로드
const setVehicleImages = async () => {
    const newImages = [];

    imageItems.value.forEach((item) => {
        if (!item.download) {
            item.loading = true;
        }

        const isDownloaded = !!imageItems.value.find(
            (item) => item.download === true
        );

        if (!isDownloaded) {
            newImages.push({
                imgId: item.imgId,
                path: item.path,
                src: null,
                loading: true,
            });
        }
    });

    if (newImages.length < 1) return;

    for (const item of newImages) {
        try {
            const file = await bodyDownload(item.path);
            const image = imageItems.value.find(
                (img) => img.imgId === item.imgId
            );

            // image.src = URL.createObjectURL(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                image.src = reader.result;
                image.loading = false;
                image.download = true;
            };
        } catch (error) {
            // 실패 시 이미지 대체
            const image = imageItems.value.find(
                (img) => img.imgId === item.imgId
            );
            image.src = noImage;
            image.loading = false;
            image.download = false;

            if (import.meta.env.DEV) console.error(error);
            newToast(commonCode("MESSAGE", "MSG000023"), "error"); // 이미지를 불러오지 못했습니다
        }
    }
};

const setInit = () => {
    selectedList.value = {
        startDt: props.startDt,
        endDt: props.endDt,
        jnlId: props.jnlId,
        version: props.version,
        shiftCd: props.shiftCd,
    };
    stdPeriod.value = `${selectedList.value?.startDt} ~ ${selectedList.value?.endDt}`;
};

const drawNoData = (worksheet, rowIndex, columnIndex, endColumnIndex) => {
    rowIndex++;

    const cell = worksheet.getCell(rowIndex, columnIndex);
    cell.value = commonCode("MESSAGE", "MSG000005"); // 데이터가 없습니다
    cell.border = styles.border;
    cell.alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    worksheet.mergeCells(rowIndex, columnIndex, rowIndex, endColumnIndex);
};
const downloadExcel = async () => {
    try {
        const title = removeSpecialCharAndSpace(resultData.value.std.title);

        const TITLE_BORDER_COLOR = `00${theme.themes.light.colors[
            "on-surface"
        ].slice(1)}`;
        const titleBorder = {
            top: { style: "thin", color: { argb: TITLE_BORDER_COLOR } },
            left: { style: "thin", color: { argb: TITLE_BORDER_COLOR } },
            bottom: { style: "thin", color: { argb: TITLE_BORDER_COLOR } },
            right: { style: "thin", color: { argb: TITLE_BORDER_COLOR } },
        };

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title);

        let maxColumnLength = 0;

        const tableHeaders = [
            infoTableHeaders,
            dataTableHeaders.value,
            faultTableHeaders.value,
            remarkTableHeaders,
        ];

        tableHeaders.forEach((el) => {
            let length = el.length;
            el.forEach((item) => {
                if (item?.colspan) {
                    length += item.colspan - 1;
                }
            });
            if (maxColumnLength < length) maxColumnLength = length;
        });

        // 제목
        const titleCell = worksheet.getCell("A1");
        titleCell.value = title;
        titleCell.font = {
            size: 18,
            bold: true,
        };
        titleCell.alignment = {
            vertical: "middle",
        };
        titleCell.border = titleBorder;
        worksheet.mergeCells(1, 1, 2, maxColumnLength - 4);

        const periodLabelCell = worksheet.getCell(1, maxColumnLength - 3);
        periodLabelCell.value = commonCode("RMS000020", "LB000383"); // 기간
        periodLabelCell.border = titleBorder;

        const periodCell = worksheet.getCell(1, maxColumnLength - 2);
        periodCell.value = stdPeriod.value;
        periodCell.border = titleBorder;

        if (resultData.value.std.shiftYn) {
            const shiftLabelCell = worksheet.getCell(2, maxColumnLength - 3);
            shiftLabelCell.value = commonCode("RMS000020", "LB000334"); //교대근무
            shiftLabelCell.border = titleBorder;

            const shiftCell = worksheet.getCell(2, maxColumnLength - 2);
            shiftCell.value = commonCode(
                shopShiftCodeGroup.value,
                selectedList.value.shiftCd
            );
            shiftCell.border = titleBorder;

            // 기간
            worksheet.mergeCells(1, maxColumnLength - 2, 1, maxColumnLength);

            // 교대
            worksheet.mergeCells(2, maxColumnLength - 2, 2, maxColumnLength);
        } else {
            // 기간
            worksheet.mergeCells(
                1,
                maxColumnLength - 3,
                2,
                maxColumnLength - 3
            );
            worksheet.mergeCells(1, maxColumnLength - 2, 2, maxColumnLength);
        }

        // 테이블 시작
        let currentRow = 22;

        // 이미지
        const workbookImageIds = [];
        imageItems.value.forEach((image) => {
            if (image.download) {
                const imgId = workbook.addImage({
                    base64: image.src,
                    extension: "png",
                });

                workbookImageIds.push(imgId);
            }
        });

        let top = 2;
        let left = 0;
        let bottom = 0;
        let right = maxColumnLength / 2;

        workbookImageIds.forEach((id, index) => {
            if (workbookImageIds.length === 1) {
                worksheet.addImage(id, {
                    tl: {
                        row: top,
                        col: left,
                    },
                    br: {
                        row: currentRow - 1,
                        col: maxColumnLength,
                    },
                    editAs: "oneCell",
                });
            } else if (workbookImageIds.length === 2) {
                worksheet.addImage(id, {
                    tl: {
                        row: top,
                        col: left,
                    },
                    br: {
                        row: currentRow - 1,
                        col: right,
                    },
                    editAs: "oneCell",
                });
                left = right;
                right += maxColumnLength / 2;
            } else {
                if (index % 2 === 0) {
                    top = 2;
                    bottom = 11;
                } else {
                    top = 11;
                    bottom = 21;
                }
                worksheet.addImage(id, {
                    tl: {
                        row: top,
                        col: left,
                    },
                    br: {
                        row: bottom,
                        col: right,
                    },
                    editAs: "oneCell",
                });

                if (index % 2 === 1) {
                    left += maxColumnLength / 2;
                    right += maxColumnLength / 2;
                }
            }
        });

        // 부가정보
        const infoColumns = infoTableHeaders.map((item, index) => {
            let colspan;
            const length = infoTableHeaders.length;
            if (maxColumnLength % length === 0) {
                colspan = maxColumnLength / length;
            } else {
                if (index < length - 1) {
                    colspan = Math.floor(maxColumnLength / length);
                } else {
                    colspan =
                        Math.floor(maxColumnLength / length) +
                        (maxColumnLength % length);
                }
            }
            return {
                ...item,
                colspan,
            };
        });

        const infoHeaders = columnsToHeaders(infoColumns);
        drawHaeders(worksheet, infoColumns, 1, currentRow, 1, currentRow);
        if (infoTableItems.value.length > 0) {
            drawBody(worksheet, infoHeaders, infoTableItems.value, currentRow);
            currentRow += infoTableItems.value.length + 3;
        } else {
            drawNoData(worksheet, currentRow, 1, maxColumnLength);
            currentRow += 4;
        }

        // 목록
        const listColumns = [];
        let dayIndex = 0;
        let headerDepth = 1;

        dataTableHeaders.value.forEach((item, index) => {
            if (index === 0) {
                listColumns.push(item);
            } else {
                if (item.key.startsWith("vehlCd")) {
                    listColumns.push(daysHeaders.value[dayIndex]);
                    listColumns[dayIndex + 1].children = [];
                }

                if (listColumns[dayIndex + 1]?.children) {
                    listColumns[dayIndex + 1].children.push(item);
                    headerDepth = 2;
                } else {
                    listColumns.push(item);
                }

                if (item.key.startsWith("result")) dayIndex++;
            }
        });

        const dataHeaders = columnsToHeaders(listColumns);
        drawHaeders(
            worksheet,
            listColumns,
            headerDepth,
            currentRow,
            1,
            currentRow
        );
        currentRow += headerDepth - 1;

        if (dataTableItems.value.length > 0) {
            dataTableItems.value.forEach((item, index) => {
                let dataColumnIndex = 1;
                let endColumnIndex;

                if (resultData.value.std.partYn === "N") {
                    dataHeaders.forEach(({ key, align }) => {
                        const rowIndex = currentRow + index + 1; // 시작위치 + 인덱스 + 인덱스가0부터니까 1

                        const cell = worksheet.getCell(
                            rowIndex,
                            dataColumnIndex
                        );
                        cell.value = item[key]?.value;
                        cell.border = styles.border;

                        if (align) {
                            cell.alignment = {
                                vertical: "middle",
                                horizontal: align,
                            };
                        }

                        endColumnIndex = dataColumnIndex;
                        if (item[key]?.colspan)
                            endColumnIndex += item[key].colspan - 1;

                        worksheet.mergeCells(
                            rowIndex,
                            dataColumnIndex,
                            rowIndex,
                            endColumnIndex
                        );

                        dataColumnIndex = endColumnIndex + 1;
                    });
                } else {
                    for (const key in item) {
                        if (item[key]?.visible !== false) {
                            const rowIndex = currentRow + index + 1; // 시작위치 + 인덱스 + 인덱스가0부터니까 1

                            const cell = worksheet.getCell(
                                rowIndex,
                                dataColumnIndex
                            );

                            if (item[key]?.text) {
                                cell.value = item[key].text;
                            } else {
                                if (typeof item[key] !== "object") {
                                    cell.value = item[key];
                                } else {
                                    cell.value = null;
                                }
                            }

                            cell.border = styles.border;

                            if (item[key]?.align) {
                                cell.alignment = {
                                    vertical: "middle",
                                    horizontal: item[key].align,
                                };
                            }

                            endColumnIndex = dataColumnIndex;
                            if (item[key]?.colspan)
                                endColumnIndex += item[key].colspan - 1;

                            let rowspan = 0;
                            if (item[key]?.rowspan) {
                                rowspan = item[key].rowspan - 1;

                                cell.alignment = {
                                    vertical: "middle",
                                    horizontal: "center",
                                };
                            }

                            worksheet.mergeCells(
                                rowIndex,
                                dataColumnIndex,
                                rowIndex + rowspan,
                                endColumnIndex
                            );

                            dataColumnIndex = endColumnIndex + 1;
                        } else {
                            dataColumnIndex++;
                        }
                    }
                }

                dataColumnIndex = 1;
            });
            currentRow += dataTableItems.value.length + 3;
        } else {
            drawNoData(worksheet, currentRow, 1, maxColumnLength);
            currentRow += 4;
        }

        // 불량내역
        const faultColumns = faultTableHeaders.value.map((item, index) => {
            let colspan;
            const length = faultTableHeaders.value.length;
            if (maxColumnLength % length === 0) {
                colspan = maxColumnLength / length;
            } else {
                if (index < length - 1) {
                    colspan = Math.floor(maxColumnLength / length);
                } else {
                    colspan =
                        Math.floor(maxColumnLength / length) +
                        (maxColumnLength % length);
                }
            }
            return {
                ...item,
                colspan,
            };
        });

        const faultHeaders = columnsToHeaders(faultColumns);
        drawHaeders(worksheet, faultColumns, 1, currentRow, 1, currentRow);
        if (faultTableItems.value.length > 0) {
            drawBody(
                worksheet,
                faultHeaders,
                faultTableItems.value,
                currentRow
            );
            currentRow += faultTableItems.value.length + 3;
        } else {
            drawNoData(worksheet, currentRow, 1, maxColumnLength);
            currentRow += 4;
        }

        // 특이사항
        const remarkColumns = remarkTableHeaders.map((item, index) => {
            let colspan;
            const length = remarkTableHeaders.length;
            if (maxColumnLength % length === 0) {
                colspan = maxColumnLength / length;
            } else {
                if (index < length - 1) {
                    colspan = Math.floor(maxColumnLength / length);
                } else {
                    colspan =
                        Math.floor(maxColumnLength / length) +
                        (maxColumnLength % length);
                }
            }
            return {
                ...item,
                colspan,
            };
        });
        const remarkHeaders = columnsToHeaders(remarkColumns);
        drawHaeders(worksheet, remarkColumns, 1, currentRow, 1, currentRow);
        if (remarkTableItems.value.length > 0) {
            drawBody(
                worksheet,
                remarkHeaders,
                remarkTableItems.value,
                currentRow
            );
        } else {
            drawNoData(worksheet, currentRow, 1, maxColumnLength);
        }

        // 다운로드
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const listener = document.createElement("a");
        listener.href = window.URL.createObjectURL(blob);
        listener.download = `${title}.xlsx`;
        listener.click();
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
    }
};
const favoriteStore = useFavorite();

onMounted(() => {
    favoriteStore.disableFavorite = true;
    currentPage.value = flatMenus.value.find(
        (menu) => menu?.pgm_path_adr === props.parentPath
    );

    setCodes();
    setInit();

    fetchData();
});

onUnmounted(() => {
    favoriteStore.disableFavorite = false;
});
</script>

<style scoped>
.td-skip {
    text-align: center;
    background-color: rgba(
        var(--v-theme-onSurfaceVariant),
        var(--v-activated-opacity)
    );
}

.td-ng {
    background-color: rgba(var(--v-theme-error), var(--v-activated-opacity));
    color: rgb(var(--v-theme-error));
}
</style>
