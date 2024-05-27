<template>
    <ContainerSheet class="mb-5">
        <div class="d-flex flex-wrap px-2">
            <!-- 타이틀 -->
            <div class="d-flex align-end ga-2">
                <div>
                    <!-- 중메뉴 -->
                    <div
                        v-if="!title"
                        class="d-flex justify-space-between d-sm-none"
                    >
                        <span class="text-caption">
                            {{ currentPage.supi_menu_cd_nm }}
                        </span>
                    </div>

                    <h5 class="text-primary">
                        <template v-if="title">
                            {{ title }}
                        </template>
                        <template v-else>
                            {{ currentPage.menu_nm }}
                        </template>
                    </h5>
                </div>

                <!-- 중메뉴 -->
                <span v-if="!title" class="text-body-2 d-none d-sm-inline">
                    {{ currentPage.supi_menu_cd_nm }}
                </span>
            </div>

            <div
                v-if="
                    buttons ||
                    filters ||
                    statusChips ||
                    $slots['actions'] ||
                    $slots['prepend-actions']
                "
                class="ml-auto d-flex ga-3"
            >
                <div class="d-flex align-end ga-3">
                    <!-- 상태칩 -->
                    <VChip
                        v-for="chip in statusChips"
                        :color="chip.type"
                        class="d-none d-md-flex"
                    >
                        {{ chip.text }}
                    </VChip>
                </div>

                <!-- 버튼 -->
                <div class="d-flex align-end ga-3 flex-wrap">
                    <slot name="prependActions"></slot>

                    <!-- 필터버튼 -->
                    <VBtn
                        v-if="filters && !hideFilterButton"
                        color="primary"
                        variant="outlined"
                        :prepend-icon="
                            visibleFilter
                                ? 'mdi-filter-variant-minus'
                                : 'mdi-filter-variant-plus'
                        "
                        @click="toggleFilter"
                    >
                        {{ commonCode("RMS000020", "LB000035") }}
                    </VBtn>

                    <!-- 엑셀버튼 -->
                    <VBtn
                        v-if="
                            !hideExcelButton &&
                            buttonValidate(EXCEL_METHOD_CODE, currentPage)
                        "
                        color="primary"
                        prepend-icon="mdi-microsoft-excel"
                        variant="outlined"
                        :disabled="items?.length < 1"
                        :loading="excelLoading"
                        @click="excelHandler"
                    >
                        {{ commonCode("RMS000020", "LB000071") }}
                    </VBtn>

                    <template v-for="btn in buttons">
                        <VBtn
                            v-if="buttonValidate(btn.method, currentPage)"
                            v-show="!btn.hidden"
                            @click="
                                () => buttonHandler(btn.handler, btn.method)
                            "
                            :variant="
                                btn.type === 'primary' ? 'elevated' : 'outlined'
                            "
                            :color="btn.type ? btn.type : 'primary'"
                            :prepend-icon="btn.icon"
                            :loading="btn.loading"
                            :disabled="btn.disabled"
                        >
                            {{ btn.text }}
                        </VBtn>
                    </template>

                    <slot name="actions"></slot>
                </div>
            </div>
        </div>

        <!-- 필터 -->
        <VExpandTransition v-if="filters && filters.length > 0">
            <!-- 애니메이션 위한 div -->
            <div v-show="visibleFilter">
                <VDivider v-if="!tabs" class="mt-3 mb-5" />

                <!-- 탭 -->
                <VTabs v-if="tabs" v-model="currentTab" class="mt-3 mb-5">
                    <template v-for="(tab, index) in tabs">
                        <VTab
                            rounded="lg"
                            :value="index"
                            @click="moveNested(tab.router)"
                        >
                            {{ typeof tab === "object" ? tab.title : tab }}
                        </VTab>
                    </template>
                </VTabs>

                <VRow class="px-2">
                    <VCol
                        v-for="(filter, i) in filters"
                        :key="i"
                        :cols="filter.cols || 12"
                        :sm="filter.colsSm || 6"
                        :md="filter.colsMd || 3"
                        :lg="filter.colsLg || 2"
                    >
                        <AppDatePicker
                            v-if="filter.type === 'date'"
                            v-model="filter.value"
                            :label="filter.name"
                            :min="filter.min"
                            :max="filter.max"
                        />

                        <AppDateRangePicker
                            v-if="filter.type === 'weekDate'"
                            v-model="filter.value"
                            :label="filter.name"
                            :min="filter.min"
                            :max="filter.max"
                        />

                        <VSelect
                            v-if="filter.type === 'select'"
                            v-model="filter.value"
                            :label="filter.name"
                            :items="
                                filter.selectList
                                    ? filter.selectList
                                    : codes[filter.key]
                            "
                            item-title="code_nm"
                            item-value="com_cd"
                            no-data-text="NO DATA"
                            @keyup.enter="customSearchFunction(filters)"
                        >
                            <template #item="{ props, item: { raw } }">
                                <VListItem v-bind="props">
                                    <template v-if="raw?.status" #prepend>
                                        <VBadge
                                            inline
                                            dot
                                            :color="raw.status"
                                        />
                                    </template>

                                    <template v-if="raw?.icon" #prepend>
                                        <VIcon :icon="raw.icon" size="small" />
                                    </template>
                                </VListItem>
                            </template>
                        </VSelect>

                        <VSelect
                            v-if="filter.type === 'selectMulti'"
                            v-model="filter.value"
                            multiple
                            item-color="primary"
                            :label="filter.name"
                            :items="
                                filter.selectList
                                    ? filter.selectList
                                    : codes[filter.key]
                            "
                            item-title="code_nm"
                            item-value="com_cd"
                            no-data-text="NO DATA"
                            :style="{ height: '56px' }"
                        >
                            <template #selection="{ item, index }">
                                <template v-if="index === 0">
                                    <span
                                        v-if="filter.value.length < 2"
                                        class="text-truncate"
                                    >
                                        {{ item.title }}
                                    </span>

                                    <span
                                        v-else-if="
                                            filter.value.length ===
                                                filter.selectList?.length ||
                                            filter.value.length ===
                                                codes[filter.key]?.length
                                        "
                                        class="text-body-1"
                                    >
                                        <!-- 전체 -->
                                        {{
                                            commonCode("RMS000020", "LB000006")
                                        }}
                                    </span>

                                    <template v-else>
                                        <span class="text-truncate">
                                            {{ item.title }}
                                        </span>
                                        <span class="text-no-wrap pl-1">
                                            {{
                                                commonCode(
                                                    "RMS000020",
                                                    "LB000283",
                                                    filter.value.length
                                                )
                                            }}
                                        </span>
                                    </template>
                                </template>
                            </template>
                        </VSelect>

                        <VSelect
                            v-if="filter.type === 'relationSelect'"
                            v-model="filter.value"
                            @update:model-value="selectRelation(filter)"
                            :label="filter.name"
                            :items="
                                filter.selectList
                                    ? filter.selectList
                                    : codes[filter.key]
                            "
                            no-data-text="NO DATA"
                        />

                        <VSelect
                            v-if="filter.type === 'relationSelectMulti'"
                            v-model="filter.value"
                            @update:model-value="selectRelationMulti(filter)"
                            multiple
                            item-color="primary"
                            :label="filter.name"
                            :items="
                                filter.selectList
                                    ? filter.selectList?.filter(
                                          (item) => !!item.value
                                      )
                                    : codes[filter.key]?.filter(
                                          (item) => !!item.value
                                      )
                            "
                            no-data-text="NO DATA"
                            :style="{ height: '56px' }"
                            @keyup.enter="customSearchFunction(filters)"
                        >
                            <template #selection="{ item, index }">
                                <template v-if="index === 0">
                                    <span
                                        v-if="filter.value.length < 2"
                                        class="text-truncate"
                                    >
                                        {{ item.title }}
                                    </span>
                                    <template v-else>
                                        <span class="text-truncate">
                                            {{ item.title }}
                                        </span>
                                        <span class="text-no-wrap pl-1">
                                            {{
                                                commonCode(
                                                    "RMS000020",
                                                    "LB000283",
                                                    filter.value.length
                                                )
                                            }}
                                        </span>
                                    </template>
                                </template>
                            </template>
                        </VSelect>

                        <VAutocomplete
                            v-if="filter.type === 'autocomplete'"
                            v-model="filter.value"
                            :label="filter.name"
                            :items="
                                filter.selectList
                                    ? filter.selectList
                                    : codes[filter.key]
                            "
                            item-title="code_nm"
                            item-value="com_cd"
                            no-data-text="NO DATA"
                            @keyup.enter="customSearchFunction(filters)"
                        />

                        <VAutocomplete
                            v-if="filter.type === 'relationAutocomplete'"
                            v-model="filter.value"
                            @update:model-value="selectRelation(filter)"
                            :label="filter.name"
                            :items="
                                filter.selectList
                                    ? filter.selectList
                                    : codes[filter.key]
                            "
                            no-data-text="NO DATA"
                            @keyup.enter="customSearchFunction(filters)"
                        />

                        <VSelect
                            v-if="filter.type === 'yn'"
                            v-model="filter.value"
                            :label="filter.name"
                            :items="yn"
                        />

                        <VTextField
                            v-if="filter.type === 'text'"
                            v-model="filter.value"
                            :label="filter.name"
                            @keyup.enter="customSearchFunction(filters)"
                        />
                    </VCol>
                </VRow>

                <VRow class="px-2">
                    <VCol
                        cols="12"
                        class="d-flex flex-wrap justify-end py-0 pb-2"
                    >
                        <VBtn
                            prepend-icon="mdi-refresh"
                            variant="text"
                            :loading="loading"
                            @click="
                                customRefreshFunction
                                    ? customRefreshFunction(filters)
                                    : refresh()
                            "
                        >
                            <!-- 초기화 -->
                            {{ commonCode("RMS000020", "LB000033") }}
                        </VBtn>
                        <VBtn
                            variant="tonal"
                            color="secondary"
                            :class="BUTTONS_MARGIN"
                            :loading="loading"
                            @click="customSearchFunction(filters)"
                        >
                            <!-- 조회 -->
                            {{ commonCode("RMS000020", "LB000034") }}
                        </VBtn>
                    </VCol>
                </VRow>
            </div>
        </VExpandTransition>
    </ContainerSheet>
</template>

<script setup>
import { ref, computed } from "vue";
import AppDatePicker from "@/components/app/AppDatePicker.vue";
import AppDateRangePicker from "@/components/app/AppDateRangePicker.vue";
import { useDataTable } from "@/stores/dataTableStore";
import { useMenu } from "@/stores/menuStore";
import { useToast } from "@/stores/toastStore";
import { downloadExcel } from "@/utils/excel";
import { storeToRefs } from "pinia";
import { usePageCodes } from "@/stores/pageCodesStore";
import { useRouter } from "vue-router";
import { buttonValidate, parseSelectList } from "@/utils/common";
import { useFeedback } from "@/stores/feedbackStore";
import { commonCode } from "@/utils/code";

const props = defineProps({
    title: {
        type: String,
    },
    filters: {
        type: Array,
    },
    statusChips: {
        type: Array,
    },
    buttons: {
        type: Array,
    },
    hideExcelButton: {
        type: Boolean,
        default: false,
    },
    hideFilterButton: {
        type: Boolean,
        default: false,
    },
    customSearchFunction: {
        type: Function,
    },
    customRefreshFunction: {
        type: Function,
    },
    tabs: {
        type: Array,
    },
    tabIndex: {
        type: Number,
        default: 0,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

// 전체적인 버튼 마진 값
const BUTTONS_MARGIN = "mb-2 ml-3";

// 필터 숨김
const visibleFilter = ref(true);
const toggleFilter = () => {
    visibleFilter.value = !visibleFilter.value;
};

// 현재 페이지
const { currentPage } = storeToRefs(useMenu());

// 공통코드
const pageCodes = usePageCodes();
const { codes, yn } = storeToRefs(pageCodes);

// 테이블 정보 스토어
const dataTableStore = useDataTable();
const { headers, items, selected } = storeToRefs(dataTableStore);
const { parseRaw } = dataTableStore;

const parseExcelRow = (data) =>
    data.map((item) => {
        const newCol = {};
        for (const key in item) {
            const value = item[key];
            if (value !== null && typeof value === "object") {
                if (value?.insp_result) {
                    // 일상 결과입력용
                    if (
                        [
                            "SKIP",
                            import.meta.env.VITE_STATE_OK,
                            import.meta.env.VITE_STATE_NG,
                        ].includes(value.insp_result)
                    ) {
                        newCol[key] = `${value.insp_result}`;
                    } else {
                        newCol[key] = `${value.insp_result} ${item.unit_nm}`;
                    }
                } else {
                    if (
                        value?.type === "select" ||
                        value?.type === "autocomplete" ||
                        value?.type === "relationSelect"
                    ) {
                        const list = value.selectList || codes.value[key];
                        const selectedValue = list?.find(
                            (code) =>
                                code?.com_cd === value.value ||
                                code?.value === value.value
                        );

                        newCol[key] =
                            selectedValue?.code_nm ||
                            selectedValue?.title ||
                            value.value;
                    } else {
                        newCol[key] =
                            value?.code_nm || value?.text || value?.value;
                    }
                }
            } else {
                newCol[key] = value;
            }
        }
        return newCol;
    });

// 엑셀 다운로드
const { newToast } = useToast();
const excelLoading = ref(false);
const excelHandler = async () => {
    try {
        excelLoading.value = true;

        let rows;

        // 체크 값 있는지에 따른 분기
        if (selected.value.length > 0) {
            // 체크된 값이 있을 시 체크된 값만 파싱
            rows = parseExcelRow(selected.value);
        } else {
            // 없을 시 전체 파싱
            rows = parseExcelRow(items.value);
        }

        await downloadExcel(
            headers.value,
            parseRaw(rows),
            currentPage.value.menu_nm
        );
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(error.msg, error.type);
    } finally {
        excelLoading.value = false;
    }
};

const emits = defineEmits(["update:filters", "update:tabIndex"]);

// 핸들러 처리
const { openFeedback } = useFeedback();

const buttonHandler = async (handler, method) => {
    try {
        if (method.includes(import.meta.env.VITE_BUTTON_TYPE_DELETE)) {
            const feedback = await openFeedback(
                "error",
                commonCode("RMS000020", "LB000075"), // 삭제
                commonCode("MESSAGE", "MSG000033"), // 삭제한 데이터는 되돌릴 수 없습니다. 삭제하시겠습니까?
                commonCode("RMS000020", "LB000120"), // 취소
                {
                    type: "error",
                    text: commonCode("RMS000020", "LB000075"), // 삭제
                }
            );

            if (!feedback) {
                newToast(commonCode("MESSAGE", "MSG000031")); // 삭제를 취소하였습니다
                return;
            }
        }

        const res = await handler();

        if (res?.msg && res?.type) {
            newToast(res.msg, res.type);
        }
    } catch (error) {
        if (error?.data?.returnCode === 5) {
            newToast(commonCode("MESSAGE", "MSG000032"), "error"); // 사용 중인 데이터는 삭제할 수 없습니다.
            return;
        }
        if (error?.msg && error?.type) {
            newToast(error.msg, error.type);
        }
    }
};

const currentTab = computed({
    get: () => props.tabIndex,
    set: (newValue) => {
        refresh();
        emits("update:tabIndex", newValue);
    },
});

const selectRelation = (filter) => {
    if (filter?.childs) {
        props.filters.forEach((item) => {
            const itemKey = item.key;
            if (filter.childs.includes(itemKey)) {
                item.value = null;

                const parentValues = {};

                props.filters.forEach((filterItem) => {
                    if (item?.parents.includes(filterItem.key)) {
                        if (filterItem.value) {
                            parentValues[filterItem.key] = filterItem.value;
                        }
                    }
                });

                const filterdList = item?.originList.filter((originItem) => {
                    let result = true;
                    for (const key in parentValues) {
                        if (originItem[key] !== parentValues[key]) {
                            result = false;
                        }
                    }

                    return result;
                });

                if (item?.title) {
                    item.selectList = parseSelectList(
                        filterdList,
                        item.title,
                        itemKey
                    );
                } else {
                    item.selectList = parseSelectList(
                        filterdList,
                        itemKey,
                        itemKey
                    );
                }
            }
        });
    }
};

// 셀렉트 리스트 관계 필터링 (멀티)
const selectRelationMulti = (filter) => {
    if (filter?.childs) {
        props.filters.forEach((item) => {
            const itemKey = item.key;
            if (filter.childs.includes(itemKey)) {
                item.value = [];

                const parentValues = {};

                props.filters.forEach((filterItem) => {
                    if (item?.parents.includes(filterItem.key)) {
                        if (filterItem.value.length > 0) {
                            parentValues[filterItem.key] = filterItem.value;
                        }
                    }
                });

                const filterdList = item?.originList.filter((originItem) => {
                    let result = true;
                    for (const key in parentValues) {
                        if (!parentValues[key].includes(originItem[key])) {
                            result = false;
                        }
                    }

                    return result;
                });

                if (item?.title) {
                    item.selectList = parseSelectList(
                        filterdList,
                        item.title,
                        itemKey
                    );
                } else {
                    item.selectList = parseSelectList(
                        filterdList,
                        itemKey,
                        itemKey
                    );
                }
            }
        });
    }
};

// 엑셀버튼 기능코드
const EXCEL_METHOD_CODE = [import.meta.env.VITE_BUTTON_TYPE_EXCEL];

const router = useRouter();
const moveNested = (target) => {
    router.push(target);
};
</script>
