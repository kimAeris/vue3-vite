<template>
    <DataTablePagination
        :title="title"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :length="pageLength"
        :loading="loading"
    />
    <VDataTable
        v-model="selected"
        @change="updateChecker($event)"
        :headers="headers"
        :items="items"
        :loading="loading"
        :page="page"
        :items-per-page="itemsPerPage"
        :show-select="showSelect"
        return-object
        :no-data-text="commonCode('MESSAGE', 'MSG000005')"
    >
        <template #item="{ item, internalItem: { columns } }">
            <tr>
                <!-- 체크박스 -->
                <td v-if="showSelect" class="px-2">
                    <VCheckbox
                        v-if="!item?.disabled"
                        v-model="selected"
                        :value="item"
                        density="comfortable"
                        class="d-flex justify-center"
                        hide-details
                    />
                </td>

                <!-- 데이터 -->
                <template v-for="(v, k) in item">
                    <template v-if="isVisibleColumns(k, columns)">
                        <td :class="v?.class">
                            <template v-if="v || v === 0">
                                <template v-if="!v.type">
                                    <!-- 일반텍스트 -->
                                    {{ v }}
                                </template>

                                <template v-else-if="v.type === 'key'">
                                    <!-- 키 -->
                                    {{ v.text }}
                                </template>

                                <template v-else-if="v.type === 'class'">
                                    <!-- 클래스적용 단순텍스트 -->
                                    {{ v.value }}
                                </template>

                                <template v-else-if="v.type === 'code'">
                                    <!-- 코드 -->
                                    <template
                                        v-if="
                                            codes[k]?.find(
                                                (item) =>
                                                    item.com_cd === v.value
                                            )?.code_nm
                                        "
                                    >
                                        {{
                                            codes[k]?.find(
                                                (item) =>
                                                    item.com_cd === v.value
                                            )?.code_nm
                                        }}
                                    </template>
                                    <template v-else>
                                        {{ v.value }}
                                    </template>
                                </template>

                                <template v-else-if="v.type === 'suffix'">
                                    <!-- suffix -->
                                    {{ `${v.value} ${v.suffix}` }}
                                </template>

                                <template v-else-if="v.type === 'hide'">
                                    <!-- 값숨김 -->
                                    {{ v.text }}
                                </template>

                                <a
                                    v-else-if="v.type === 'link'"
                                    class="text-link"
                                    @click="setLink(item, v, k)"
                                >
                                    <!-- 링크 -->
                                    {{ v.value }}
                                </a>

                                <template v-else-if="v.type === 'tooltip'">
                                    <VTooltip
                                        :text="v.tooltip"
                                        location="bottom"
                                    >
                                        <template #activator="{ props }">
                                            <span v-bind="props">
                                                {{ v.text }}
                                            </span>
                                        </template>
                                    </VTooltip>
                                </template>

                                <template v-else-if="v.type === 'iconButton'">
                                    <!-- 아이콘버튼 -->
                                    <VBtn
                                        variant="text"
                                        :icon="v.icon"
                                        @click="v.handler(v.value)"
                                    />
                                </template>

                                <template
                                    v-else-if="v.type === 'triggerButton'"
                                >
                                    <!-- 버튼 -->
                                    <!-- 트리거는 switch나 체크박스여야 함 -->
                                    <VBtn
                                        variant="tonal"
                                        :color="
                                            v.value === 'Y' ? 'success' : null
                                        "
                                        @click="
                                            v.handler(
                                                item[keyColumn].value
                                                    ? item[keyColumn].value
                                                    : item[keyColumn]
                                            )
                                        "
                                        :disabled="
                                            !isSelected(item[keyColumn]) ||
                                            item[v.trigger].value !== 'Y'
                                        "
                                    >
                                        {{
                                            v.value === "Y" ? v.yText : v.nText
                                        }}
                                    </VBtn>
                                </template>

                                <StatusIndicator
                                    v-else-if="v.type === 'indicator'"
                                    :status="v.status"
                                >
                                    <!-- 상태표시 -->
                                    {{ v.text }}
                                </StatusIndicator>

                                <VSwitch
                                    v-else-if="v.type === 'switch'"
                                    :disabled="!isSelected(item[keyColumn])"
                                    v-model="v.value"
                                    true-value="Y"
                                    false-value="N"
                                >
                                    <!-- 스위치 -->
                                </VSwitch>

                                <VSwitch
                                    v-else-if="v.type === 'switchGroup'"
                                    :disabled="
                                        !isSelected(item[keyColumn]) || v.isFull
                                    "
                                    v-model="v.value"
                                    @change="
                                        maxSelect(
                                            item,
                                            v.groupKey,
                                            v.maxCount,
                                            v.type
                                        )
                                    "
                                    true-value="Y"
                                    false-value="N"
                                    :false-icon="
                                        v.isFull ? 'mdi-close-circle' : null
                                    "
                                >
                                    <!-- 스위치 -->
                                </VSwitch>

                                <!-- select 선택시 handler (불량내용관리) -->
                                <template
                                    v-else-if="v.type === 'relationSelect'"
                                >
                                    <template
                                        v-if="
                                            isSelected(item[keyColumn]) &&
                                            !disabledInput.includes(k)
                                        "
                                    >
                                        <VAutocomplete
                                            v-model="v.value"
                                            @update:model-value="
                                                handleModelUpdate(item, k)
                                            "
                                            :items="
                                                v.selectList
                                                    ? v.selectList
                                                    : codes[k]
                                            "
                                            item-title="code_nm"
                                            item-value="com_cd"
                                            density="compact"
                                            class="input-size"
                                            :no-data-text="'NO DATA'"
                                            hide-details
                                        />
                                    </template>
                                    <template v-else>
                                        {{
                                            codes[k].find(
                                                (item) =>
                                                    item.com_cd === v.value
                                            )?.code_nm
                                                ? codes[k].find(
                                                      (item) =>
                                                          item.com_cd ===
                                                          v.value
                                                  )?.code_nm
                                                : v.value
                                        }}
                                    </template>
                                </template>

                                <template v-else>
                                    <!-- 인풋 text, select-->
                                    <DataTableTdInput
                                        :active="
                                            isSelected(item[keyColumn]) &&
                                            !disabledInput.includes(k)
                                        "
                                        :type="v.type"
                                        v-model:value="v.value"
                                        :suffix="v?.suffix"
                                        :select-list="
                                            v.selectList
                                                ? v.selectList
                                                : codes[k]
                                        "
                                        :no-data-text="v?.noDataText"
                                    />
                                </template>
                            </template>
                        </td>
                    </template>
                </template>
            </tr>
        </template>

        <template #loading>
            <VSkeletonLoader
                type="heading, divider, table-tbody"
                class="rounded-0"
            />
        </template>

        <!-- 기본 페이지네이션 제거를 위한 공백 슬롯 -->
        <template #bottom />
    </VDataTable>
</template>

<script setup>
import StatusIndicator from "./StatusIndicator.vue";
import DataTableTdInput from "./DataTableTdInput.vue";
import DataTablePagination from "./DataTablePagination.vue";
import { difference } from "@/utils/common";
import { useFeedback } from "@/stores/feedbackStore";
import { useDataTable } from "@/stores/dataTableStore";
import { storeToRefs } from "pinia";
import { usePageCodes } from "@/stores/pageCodesStore";
import { commonCode } from "@/utils/code";

const props = defineProps({
    title: {
        type: String,
    },
    showSelect: {
        type: Boolean,
        default: true,
    },
    // input 비활성화 시킬 컬럼 명(ex: 생산차종관리페이지)
    disabledInput: {
        type: Array,
        default: [],
    },
    languagePairing: {
        type: Boolean,
        default: false,
    },
    // 단일 선택 값의 변경을 감지하여 상위 컴포넌트에서 update 이벤트를 발생시키기 위해 props로 분리
    link: {
        type: Object,
    },
});

const emits = defineEmits(["update:link"]);

const handleModelUpdate = (row, key) => {
    row[key].handler(row, key);
};

// 테이블 정보 스토어
const dataTableStore = useDataTable();
const {
    headers,
    items,
    loading,
    selected,
    addedItems,
    page,
    itemsPerPage,
    pageLength,
    keyColumn,
    pairingColumns,
} = storeToRefs(dataTableStore);

// 피드백 팝업
const feedback = useFeedback();

const updateChecker = async (event) => {
    // 아이템 선택 해제 시
    if (!event.target.checked) {
        const unCheckedAddedItems = addedItems.value.filter(
            (item) =>
                item[keyColumn.value].value ===
                event.target._value[keyColumn.value]?.value
        );

        // 선택 해제한 아이템이 추가 후 저장되기 전 아이템일 시
        if (unCheckedAddedItems?.length > 0) {
            const confirm = await feedback.openFeedback(
                "warning",
                commonCode("MESSAGE", "MSG000065"), // 항목추가 취소
                commonCode("MESSAGE", "MSG000066"), // 추가 된 항목 선택취소 시 변경 사항은 삭제됩니다.
                commonCode("RMS000020", "LB000120"), // 취소
                {
                    text: commonCode("RMS000020", "LB000137"), // 확인
                    type: "warning",
                }
            );

            if (confirm) {
                items.value = difference(
                    items.value,
                    unCheckedAddedItems,
                    keyColumn.value
                );

                addedItems.value = difference(
                    addedItems.value,
                    unCheckedAddedItems,
                    keyColumn.value
                );

                selected.value = difference(
                    selected.value,
                    unCheckedAddedItems,
                    keyColumn.value
                );
            } else {
                unCheckedAddedItems.forEach((item) => {
                    selected.value.push(item);
                });
            }
        }

        if (props.languagePairing) {
            const pairItems = items.value.filter(
                (item) =>
                    item[keyColumn.value].value ===
                        event.target._value[keyColumn.value]?.value &&
                    item.lang_cd !== event.target._value.lang_cd
            );

            selected.value = difference(
                selected.value,
                pairItems,
                keyColumn.value
            );
        }
    } else {
        // 아이템 선택 시
        if (props.languagePairing) {
            let pairItems = items.value.filter(
                (item) =>
                    item[keyColumn.value].value ===
                        event.target._value[keyColumn.value]?.value &&
                    item.lang_cd !== event.target._value.lang_cd
            );

            // Object 얕은 복사 이용하여 값 같이 수정되도록
            pairingColumns.value.forEach((col) => {
                pairItems.forEach((item) => {
                    item[col] = event.target._value[col];
                });
            });

            pairItems.forEach((item) => {
                selected.value.push(item);
            });
        }
    }
};

const isVisibleColumns = (colKey, columns) =>
    !!Object.keys(columns).find((col) => col === colKey);

// 선택여부 확인
const isSelected = (key) =>
    selected.value.some((item) => item[keyColumn.value] === key);

// 링크 클릭 시 값 세팅
let activeLink;

const setLink = (newValue, valueObject, key) => {
    // selectActive가 true면 선택 시 스타일 적용
    if (valueObject?.selectActive) {
        if (activeLink) {
            const actived = items.value.find((item) => item[key]?.class);

            if (actived) {
                delete actived[key].class;
            }
        }

        valueObject.class = "success";
        activeLink = valueObject;
    }
    emits("update:link", dataTableStore.parseRaw([newValue])[0]);
};

// 공통코드
const pageCodes = usePageCodes();
const { codes } = storeToRefs(pageCodes);

// 스위치그룹 최대선택값 관리
const maxSelect = (columns, groupKey, maxCount, type) => {
    let counter = 0;

    for (const key in columns) {
        if (
            columns[key]?.type === type &&
            columns[key]?.groupKey === groupKey
        ) {
            if (columns[key].value === "Y") {
                counter++;
            }
        }
    }

    if (counter >= maxCount) {
        selected.value.forEach((item) => {
            if (item[keyColumn.value] === columns[keyColumn.value]) {
                for (const key in item) {
                    if (
                        item[key]?.type === type &&
                        item[key]?.groupKey === groupKey
                    ) {
                        if (columns[key].value !== "Y") {
                            columns[key].isFull = true;
                        }
                    }
                }
            }
        });
    } else if (maxCount - counter === 1) {
        selected.value.forEach((item) => {
            if (item[keyColumn.value] === columns[keyColumn.value]) {
                for (const key in item) {
                    if (
                        item[key]?.type === type &&
                        item[key]?.groupKey === groupKey
                    ) {
                        columns[key].isFull = false;
                    }
                }
            }
        });
    }
};
</script>

<style scoped>
.success {
    background: rgba(
        var(--v-theme-secondary),
        var(--v-activated-opacity)
    ) !important;
    color: rgb(var(--v-theme-secondary)) !important;
}

.warning {
    background: rgba(
        var(--v-theme-warning),
        var(--v-activated-opacity)
    ) !important;
    color: rgb(var(--v-theme-warning)) !important;
}

.error {
    background: rgba(
        var(--v-theme-error),
        var(--v-activated-opacity)
    ) !important;
    color: rgb(var(--v-theme-error)) !important;
}
</style>
