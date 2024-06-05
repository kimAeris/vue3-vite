<template>
    <VRow>
        <VCol cols="12">
            <BodyEnterHeader
                :selectedJournal="selectedJournal"
                @update:selectedJournal="changeCurrentJournal($event)"
                :journals="journals"
                :process="standard?.processId"
                :type="standard?.lrCd"
                v-model:date="date"
                @update:date="setJournals()"
                v-model:shift="currentShift"
                @update:shift="setCurrentJournal($event)"
                :additional-infos="additionalInfos"
                :use-shift="standard.shiftYn === 'Y'"
                :use-zone="standard.zoneYn === 'Y'"
                :defects="defects"
                @remove-defect="handleRemoveDefect"
                :preview="isPreview"
            />
        </VCol>

        <template v-if="!!selectedJournal">
            <VCol cols="12" sm="6">
                <TitledCarousel
                    :title="getTitle(vehicles, enterRound.vehicle)"
                    v-model:page="imagePage"
                    :images="vehicleImages"
                    class="h-100"
                />
            </VCol>

            <VCol cols="12" sm="6">
                <BodyEnterBox
                    :entered="entered"
                    v-model:current-round="enterRound"
                    @update:current-round="changeViewRound"
                    :date="date"
                    :rounds="rounds"
                    :vehicles="vehicles"
                    :zones="zones"
                    :timeset-code="standard.timeTypeCd"
                    :body-number-code="standard.bodyNoTypeCd"
                    :use-part="standard.partYn === 'Y'"
                    :use-zone="standard.zoneYn === 'Y'"
                    :use-body-number="standard.bodyNoYn === 'Y'"
                    :use-shift="standard.shiftYn === 'Y'"
                    :use-round="standard.roundYn === 'Y'"
                    :multi-result="standard.multiResultYn === 'Y'"
                    :defect-images="vehicleImages"
                    @enter="handleEnter"
                    @skip="handleSkip"
                    @success="handleSuccess"
                    @done="handleDone"
                    @change-vehicle="setVehicleImages"
                    @submit-defect="handleDefect"
                    :preview="isPreview"
                    class="h-100"
                />
            </VCol>

            <VCol cols="12">
                <VSheet class="py-4 px-6" elevation="1">
                    <ContentSubheader>
                        <div class="d-flex align-center flex-wrap ga-2">
                            <h6>
                                {{ menuStore.currentPage.menu_nm }}
                                {{ commonCode("RMS000020", "LB000047") }}
                            </h6>

                            <div class="d-flex align-center ga-2">
                                <CommentDropBox
                                    :comments="comments"
                                    :is-reg="isCommentReg"
                                    @save-comment="handleComment"
                                />
                                <VChip
                                    v-if="
                                        stateCount.unchecked ||
                                        stateCount.unchecked === 0
                                    "
                                    color="warning"
                                >
                                    {{
                                        `${commonCode(
                                            "RMS000020",
                                            "LB000341"
                                        )}: ${stateCount.unchecked}`
                                    }}
                                </VChip>
                                <VChip
                                    v-if="stateCount.ng || stateCount.ng === 0"
                                    color="error"
                                >
                                    {{
                                        `${commonCode("RMS000034", "1")}: ${
                                            stateCount.ng
                                        }`
                                    }}
                                </VChip>
                            </div>
                        </div>
                    </ContentSubheader>

                    <VExpandTransition>
                        <VTabs
                            v-if="
                                standard.shiftYn === 'Y' &&
                                standard.roundYn === 'Y'
                            "
                            v-model="viewRound"
                        >
                            <VTab v-for="{ round } in rounds" :value="round">
                                {{
                                    `${round}${commonCode(
                                        "RMS000020",
                                        "LB000337"
                                    )}`
                                }}
                            </VTab>
                        </VTabs>
                    </VExpandTransition>

                    <VWindow :model-value="viewRound">
                        <VWindowItem v-for="{ round } in rounds" :value="round">
                            <template v-if="standard.partYn === 'Y'">
                                <VFadeTransition>
                                    <BodyEnterMultiPartsItem
                                        v-if="
                                            !entered.find(
                                                (item) => item.round === round
                                            )
                                        "
                                        id="$SKELETON"
                                        :parts="
                                            skeletonParts?.[round]?.[
                                                getTitle(
                                                    vehicles,
                                                    enterRound.vehicle
                                                )
                                            ]
                                        "
                                        :part-labels="[
                                            standard.lv1Nm,
                                            standard.lv2Nm,
                                            standard.lv3Nm,
                                        ]"
                                        :part-level="standard.maxPartLevel"
                                        :result="null"
                                        :vehicle="
                                            getTitle(
                                                vehicles,
                                                enterRound.vehicle
                                            )
                                        "
                                        body-number=""
                                        class="mt-2 bg-surface-variant"
                                    />
                                </VFadeTransition>
                            </template>

                            <template
                                v-if="
                                    entered.find((item) => item.round === round)
                                "
                            >
                                <VExpandTransition
                                    v-for="item in entered"
                                    :key="item.id"
                                    appear
                                >
                                    <template v-if="item.round === round">
                                        <!-- 스킵 -->
                                        <template
                                            v-if="item.state === STATE_SKIP"
                                        >
                                            <BodyEnterSkipResultItem
                                                :id="item.id"
                                                :date="date"
                                                :reason="item.skipReason"
                                                @remove="
                                                    handleRemove(
                                                        $event,
                                                        round,
                                                        item.state
                                                    )
                                                "
                                            />
                                        </template>

                                        <template v-else>
                                            <!-- 멀티 -->
                                            <template
                                                v-if="standard.partYn === 'Y'"
                                            >
                                                <BodyEnterMultiPartsItem
                                                    :id="item.id"
                                                    :parts="item.parts"
                                                    :part-labels="[
                                                        standard.lv1Nm,
                                                        standard.lv2Nm,
                                                        standard.lv3Nm,
                                                    ]"
                                                    :part-level="
                                                        standard.maxPartLevel
                                                    "
                                                    :result="item.result"
                                                    :judgment="item.judgment"
                                                    :vehicle="
                                                        getTitle(
                                                            vehicles,
                                                            item.vehicle
                                                        )
                                                    "
                                                    :body-number="
                                                        item.bodyNumber
                                                    "
                                                    :body-number-code="
                                                        standard.bodyNoTypeCd
                                                    "
                                                    :skipped-parts="
                                                        item.skippedParts
                                                    "
                                                    @remove="
                                                        handleRemove(
                                                            $event,
                                                            round,
                                                            item.state,
                                                            item.sequence,
                                                            item.timeset
                                                        )
                                                    "
                                                    @edit="
                                                        openEditModal(
                                                            round,
                                                            item.id,
                                                            item.sequence,
                                                            $event
                                                        )
                                                    "
                                                />
                                            </template>

                                            <!-- 싱글 -->
                                            <template v-else>
                                                <BodyEntetSingleResultItem
                                                    :id="item.id"
                                                    :vehicle="
                                                        getTitle(
                                                            vehicles,
                                                            item.vehicle
                                                        )
                                                    "
                                                    :body-number="
                                                        item.bodyNumber
                                                    "
                                                    :body-number-code="
                                                        standard.bodyNoTypeCd
                                                    "
                                                    :zone="
                                                        getTitle(
                                                            zones,
                                                            item.zone
                                                        )
                                                    "
                                                    :result="item.result"
                                                    @remove="
                                                        handleRemove(
                                                            $event,
                                                            round,
                                                            item.state,
                                                            item.sequence,
                                                            item.timeset
                                                        )
                                                    "
                                                    @edit="
                                                        openEditModal(
                                                            round,
                                                            item.id,
                                                            item.sequence
                                                        )
                                                    "
                                                />
                                            </template>
                                        </template>
                                    </template>
                                </VExpandTransition>
                            </template>

                            <template v-else>
                                <div class="pa-8 text-center">
                                    {{ commonCode("MESSAGE", "MSGI000127") }}
                                </div>
                            </template>
                        </VWindowItem>
                    </VWindow>
                </VSheet>
            </VCol>
        </template>

        <VFab
            v-scroll="onScroll"
            icon="mdi-chevron-up"
            location="bottom end"
            class="text-primary"
            app
            transition="slide-y-reverse-transition"
            @click="scrollToTop"
            :active="offsetTop > 0"
        />
    </VRow>

    <ModalContainer
        v-if="editModal"
        v-model="editModal"
        max-width="900"
        :persistent="editModalLoading"
    >
        <template #header>
            <div class="d-flex justify-space-between align-center">
                <div class="w-100" />

                <div class="w-100 text-center">
                    <h5 v-if="editModalItems[editModalCurrentIndex]?.partName">
                        {{ editModalItems[editModalCurrentIndex].partName }}
                    </h5>
                </div>

                <div class="w-100 d-flex ga-2 justify-end">
                    <VBtn
                        variant="text"
                        icon="mdi-close"
                        size="small"
                        :loading="editModalLoading"
                        @click="closeEditModal"
                    />
                </div>
            </div>
        </template>
        ```jsx

        <VRow>
            <VCol cols="6">
                <div class="d-flex flex-column pa-6 ga-8 w-100 h-100">
                    <div class="d-flex ga-4">
                        <UpperLabelText
                            :label="commonCode('RMS000020', 'LB000041')"
                            :text="
                                valueOrNone(
                                    getTitle(
                                        vehicles,
                                        editModalItems[editModalCurrentIndex]
                                            .vehicle
                                    )
                                )
                            "
                        />

                        <VDivider vertical class="my-3" />

                        <UpperLabelText
                            :label="
                                commonCode('RMS000028', standard.bodyNoTypeCd)
                            "
                            :text="
                                valueOrNone(
                                    editModalItems[editModalCurrentIndex]
                                        ?.bodyNumber
                                )
                            "
                        />

                        <VDivider
                            v-if="standard.zoneYn === 'Y'"
                            vertical
                            class="my-3"
                        />

                        <UpperLabelText
                            v-if="standard.zoneYn === 'Y'"
                            :label="commonCode('RMS000022', 'ZONE')"
                            :text="
                                valueOrNone(
                                    getTitle(
                                        zones,
                                        editModalItems[editModalCurrentIndex]
                                            ?.zone
                                    )
                                )
                            "
                        />
                    </div>

                    <p v-if="editModalItems[editModalCurrentIndex]?.standard">
                        {{
                            `${commonCode("RMS000020", "LB000170")}: ${
                                editModalItems[editModalCurrentIndex].standard
                            }`
                        }}
                    </p>

                    <div class="d-flex flex-column ga-5">
                        <div class="d-flex ga-3 align-center">
                            <VSlideXTransition hide-on-leave>
                                <VIcon
                                    v-if="
                                        isValidStandard(
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].result,
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].min,
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].max
                                        ) === null
                                    "
                                    icon="mdi-minus-circle"
                                    class="text-medium-emphasis"
                                />
                                <VIcon
                                    v-else-if="
                                        isValidStandard(
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].result,
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].min,
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].max
                                        )
                                    "
                                    icon="mdi-check-circle"
                                    color="primary"
                                />
                                <VIcon
                                    v-else
                                    icon="mdi-alert-circle"
                                    color="error"
                                />
                            </VSlideXTransition>

                            <VTextField
                                v-model="
                                    editModalItems[editModalCurrentIndex].result
                                "
                                :label="commonCode('RMS000020', 'LB000278')"
                                variant="filled"
                                density="default"
                                :readonly="
                                    editModalItems[editModalCurrentIndex]
                                        .valueType === 'J'
                                "
                                :clearable="
                                    editModalItems[editModalCurrentIndex]
                                        .valueType === 'M'
                                "
                                :placeholder="
                                    editModalItems[editModalCurrentIndex]
                                        .standard
                                "
                                persistent-placeholder
                                :disabled="
                                    editModalLoading ||
                                    editModalItems[editModalCurrentIndex].skip
                                "
                                :color="
                                    editModalFieldColor(
                                        isValidStandard(
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].result,
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].min,
                                            editModalItems[
                                                editModalCurrentIndex
                                            ].max
                                        )
                                    )
                                "
                                :suffix="
                                    editModalItems[editModalCurrentIndex]
                                        .valueType === 'M'
                                        ? editModalItems[editModalCurrentIndex]
                                              .unit
                                        : null
                                "
                                hide-details
                            />
                        </div>

                        <div
                            class="d-flex flex-wrap ga-2"
                            style="min-height: 32px"
                        >
                            <template v-for="topValue in editModalTopValues">
                                <VChip
                                    v-if="topValue"
                                    @click="setTopValue(topValue)"
                                    :disabled="
                                        editModalLoading ||
                                        editModalItems[editModalCurrentIndex]
                                            .skip
                                    "
                                >
                                    {{ topValue }}
                                </VChip>
                            </template>
                        </div>
                    </div>

                    <div class="d-flex align-end h-100">
                        <VTextField
                            v-model="
                                editModalItems[editModalCurrentIndex].remark
                            "
                            :label="commonCode('RMS000020', 'LB000129')"
                            variant="filled"
                            density="default"
                            :disabled="
                                editModalLoading ||
                                editModalItems[editModalCurrentIndex].skip
                            "
                        />
                    </div>
                </div>
            </VCol>

            <VDivider vertical class="my-6" />

            <VCol cols="6">
                <div
                    class="d-flex justify-center align-center pa-6 w-100 h-100"
                >
                    <ModalOkNgButton
                        v-if="
                            editModalItems[editModalCurrentIndex].valueType ===
                            'J'
                        "
                        v-model="editModalItems[editModalCurrentIndex].result"
                        :disabled="
                            editModalLoading ||
                            editModalItems[editModalCurrentIndex].skip
                        "
                    />

                    <NumberPad
                        v-else
                        v-model:value="
                            editModalItems[editModalCurrentIndex].result
                        "
                        :disabled="
                            editModalLoading ||
                            editModalItems[editModalCurrentIndex].skip
                        "
                    />
                </div>
            </VCol>
        </VRow>

        <template #footer>
            <div class="w-100 d-flex justify-space-between align-center">
                <div class="d-flex ga-4 align-center">
                    <VBtn
                        v-if="buttonValidate(UPLOAD_METHOD_CODE)"
                        variant="tonal"
                        prepend-icon="mdi-image-plus-outline"
                        :loading="editModalLoading"
                        @click="setImage"
                    >
                        <!-- 사진첨부 -->
                        {{ commonCode("RMS000020", "LB000078") }}

                        <input
                            type="file"
                            accept="image;capture=camera, .jpg, .jpeg, .png, .webp"
                            id="img"
                            class="d-none"
                            @change="setFiles"
                            multiple="4"
                        />
                    </VBtn>

                    <VSlideGroup center-active>
                        <VSlideGroupItem
                            v-for="(img, index) in currentInspectImages"
                            :key="img.id"
                        >
                            <VSkeletonLoader
                                :loading="img.loading"
                                width="80"
                                height="60"
                                class="rounded-lg"
                                :class="
                                    index + 1 !== currentInspectImages.length &&
                                    'mr-4'
                                "
                            >
                                <VImg
                                    :src="img.src"
                                    :lazy-src="img.src"
                                    :width="80"
                                    :aspect-ratio="4 / 3"
                                    cover
                                    class="cursor-pointer rounded-lg"
                                    @click="openImageViewr(index + 1)"
                                />
                            </VSkeletonLoader>
                        </VSlideGroupItem>
                    </VSlideGroup>
                </div>

                <div class="d-flex">
                    <VBtn
                        variant="outlined"
                        :loading="editModalLoading"
                        @click="closeEditModal"
                    >
                        <!-- 취소 -->
                        {{ commonCode("RMS000020", "LB000120") }}
                    </VBtn>

                    <VExpandXTransition>
                        <VBtn
                            v-if="buttonValidate(DELETE_METHOD_CODE)"
                            v-show="editModalItems[editModalCurrentIndex].skip"
                            variant="outlined"
                            color="error"
                            :loading="editModalLoading"
                            @click="
                                resetPartSkip(
                                    editModalItems[editModalCurrentIndex]
                                )
                            "
                        >
                            <!-- 초기화 -->
                            {{ commonCode("RMS000020", "LB000033") }}
                        </VBtn>
                    </VExpandXTransition>

                    <template v-if="editModalItems.length > 1">
                        <VBtn
                            variant="outlined"
                            :disabled="editModalCurrentIndex < 1"
                            :loading="editModalLoading"
                            @click="
                                moveEditModal(
                                    -1,
                                    editModalItems[editModalCurrentIndex]
                                )
                            "
                        >
                            <!-- 이전 -->
                            {{ commonCode("RMS000020", "LB000134") }}
                        </VBtn>

                        <VBtn
                            variant="outlined"
                            :disabled="
                                editModalCurrentIndex + 1 >=
                                editModalItems.length
                            "
                            :loading="editModalLoading"
                            @click="
                                moveEditModal(
                                    1,
                                    editModalItems[editModalCurrentIndex]
                                )
                            "
                        >
                            <!-- 다음 -->
                            {{ commonCode("RMS000020", "LB000135") }}
                        </VBtn>
                    </template>

                    <VBtn
                        v-if="buttonValidate(UPDATE_METHOD_CODES)"
                        variant="elevated"
                        color="primary"
                        :loading="editModalLoading"
                        @click="
                            editAndClose(editModalItems[editModalCurrentIndex])
                        "
                    >
                        <!-- 입력 -->
                        {{ commonCode("RMS000020", "LB000136") }}
                    </VBtn>
                </div>
            </div>
        </template>

        <AppImageViewr
            v-if="imageViewr"
            v-model="imageViewr"
            :image-page="imageViewrPage"
            :images="currentInspectImages"
            full-height
            show-remove
            @remove="handleRemoveInspectImage"
        />
    </ModalContainer>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import BodyEnterHeader from "@/components/BodyEnterHeader.vue";
import BodyEnterBox from "@/components/BodyEnterBox.vue";
import BodyEnterMultiPartsItem from "@/components/BodyEnterMultiPartsItem.vue";
import BodyEnterSkipResultItem from "@/components/BodyEnterSkipResultItem.vue";
import BodyEntetSingleResultItem from "@/components/BodyEntetSingleResultItem.vue";
import TitledCarousel from "@/components/TitledCarousel.vue";
import ContentSubheader from "@/components/ContentSubheader.vue";
import { useUser } from "@/stores/userStore";
import {
    getInspectItems,
    getJournalList,
    skipJournal,
    cancelSkipJournal,
    submitDefect,
    submitComment,
    removeJournal,
    removeDefect,
    getJournalImages,
    removeJournalImages,
    getTopValues,
    setStateSuccess,
    skipParts,
} from "@/api/bd/journal/res";
import { useToast } from "@/stores/toastStore";
import { bodyCommonCode, commonCode, commonCodeGroup } from "@/utils/code";
import { today } from "@/utils/days";
import CommentDropBox from "@/components/CommentDropBox.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import UpperLabelText from "@/components/UpperLabelText.vue";
import NumberPad from "@/components/NumberPad.vue";
import { submitJournals } from "@/api/bd/journal/res";
import { v4 } from "uuid";
import { bodyDownload, bodyUpload } from "@/api/bd/bdCommon";
import noImage from "@/assets/no-image.svg";
import ModalOkNgButton from "@/components/ModalOkNgButton.vue";
import dayjs from "dayjs";
import isISO8601 from "validator/es/lib/isISO8601";
import isNumeric from "validator/es/lib/isNumeric";
import { useFavorite } from "@/stores/favoriteStore";
import emitter from "@/utils/emitter";
import { useMenu } from "@/stores/menuStore";
import { useFeedback } from "@/stores/feedbackStore";
import { buttonValidate } from "@/utils/common";
import AppImageViewr from "@/components/app/AppImageViewr.vue";

const props = defineProps({
    pathName: {
        type: String,
        required: true,
    },
    previewParams: {
        type: Object,
        validator: (v) => {
            let isValid = true;

            const requiredProperties = [
                "currentRound",
                "infoList",
                "roundList",
                "std",
                "timesetList",
                "specList",
                "vehlList",
                "zoneList",
                "journal",
            ];

            const invalid = [];
            for (const property of requiredProperties) {
                if (!v.hasOwnProperty(property)) {
                    invalid.push(property);
                    isValid = false;
                }
            }

            if (invalid.length > 0 && import.meta.env.DEV) {
                console.error(
                    `Props 'PreviewParams' does not have properties ${invalid.join(
                        ", "
                    )}`
                );
            }

            return isValid;
        },
    },
    favoriteId: {
        type: Number,
    },
    inquiryJournal: {
        type: String,
    },
    inquiryDate: {
        type: String,
        validator: (v) => isISO8601(v, { strict: true }),
        default: () => today(),
    },
    inquiryShift: {
        type: String,
        validator: (v) => v === "" || isNumeric(v),
        default: "",
    },
    inquiryRound: {
        type: String,
        validator: (v) => v === "" || isNumeric(v),
        default: "",
    },
});

const isPreview = !!props.previewParams;

const STATE_PENDING = import.meta.env.VITE_BODY_STATE_PENDING;
const STATE_UNDERWAY = import.meta.env.VITE_BODY_STATE_UNDERWAY;
const STATE_SUCCESS = import.meta.env.VITE_BODY_STATE_SUCCESS;
const STATE_SKIP = import.meta.env.VITE_BODY_STATE_SKIP;

const STATE_OK = import.meta.env.VITE_STATE_OK;
const STATE_NG = import.meta.env.VITE_STATE_NG;

const UPDATE_METHOD_CODES = [import.meta.env.VITE_BUTTON_TYPE_UPDATE];
const UPLOAD_METHOD_CODE = [import.meta.env.VITE_BUTTON_TYPE_UPLOAD];
const DELETE_METHOD_CODE = [import.meta.env.VITE_BUTTON_TYPE_DELETE];

const enterRound = ref({});
const viewRound = ref(1);

const userStore = useUser();
const menuStore = useMenu();
const { newToast } = useToast();
const { openFeedback } = useFeedback();

const date = ref(props.inquiryDate);
const currentShift = ref(props.inquiryShift);

// title / value 배열에서 value로 title 추출
const getTitle = (items, value) =>
    items.find((item) => item.value === value)?.title;

const valueOrNone = (value) =>
    value ? value : commonCode("RMS000020", "LB000350");

const getPartName = (part1, part2, part3) => {
    const name = [];
    if (part1) name.push(part1);
    if (part2) name.push(part2);
    if (part3) name.push(part3);
    return name.join("-");
};

// 일지정보
const fetchJournals = async () => {
    try {
        const { journalList } = await getJournalList(date.value);
        return journalList;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    }
};

const currentJournal = ref({});
const selectedJournal = ref(null);
const journals = ref([]);

const setJournals = async (inquiryJournalId, inquiryShiftCode) => {
    let journalData;

    if (isPreview) {
        journalData = [props.previewParams.journal];
    } else {
        journalData = await fetchJournals();
    }

    if (journalData.length > 0) {
        journals.value = journalData.map((item) => ({
            title: item.title,
            value: item.jnlId,
            version: item.version,
            currentShift: item.currentShiftCd,
        }));

        // 새로 불러온 리스트에 동일한 일지가 있는지
        const sameCurrentJournal = !!journals.value.find(
            (item) => item.value === selectedJournal.value
        );

        // 없으면 초기화
        if (!sameCurrentJournal)
            selectedJournal.value = inquiryJournalId || journals.value[0].value;

        setCurrentJournal(inquiryShiftCode);
    } else {
        currentJournal.value = {};
        selectedJournal.value = null;
        journals.value = [
            {
                title: commonCode("MESSAGE", "MSGI000128"),
                value: null,
            },
        ];
    }
};

const changeCurrentJournal = async (newJornal) => {
    const confirm = await openFeedback(
        "warning",
        commonCode("RMS000020", "LB000414"), //일지 변경,
        commonCode("MESSAGE", "MSGI000157"), //일지를 변경할 경우 저장되지 않은 정보는 손실됩니다. 변경하시겠습니까?
        commonCode("RMS000020", "LB000120"), // 취소
        {
            type: "warning",
            text: commonCode("RMS000020", "LB000137"), // 확인
        }
    );

    if (!confirm) return;

    selectedJournal.value = newJornal;
    setCurrentJournal();
};

const setCurrentJournal = async (shift) => {
    currentJournal.value = journals.value.find(
        (item) => selectedJournal.value === item.value
    );
    currentShift.value = shift || currentJournal.value?.currentShift;
    entered.value = [];

    await setInspectItems(
        selectedJournal.value,
        date.value,
        currentShift.value
    );
};
// 일지 기준정보
const fetchInspectItems = async (journalId, journalDate, shift) => {
    try {
        const version = journals.value.find(
            (item) => item.value === journalId
        ).version;

        const data = await getInspectItems(
            journalId,
            journalDate,
            version,
            userStore.shopShiftCodeGroup,
            shift
        );
        return data;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    }
};

const rounds = ref([]);
const entered = ref([]);

const additionalInfos = ref([]);
const standard = ref({});
const vehicles = ref([]);
const zones = ref([]);
const comments = ref([]);
const isCommentReg = ref(false);
const defects = ref([]);

const stateCount = computed(() => {
    const round = viewRound.value;

    let ng = 0;
    let unchecked = 0;

    const enteredValue = entered.value.find(
        (item) =>
            item.round === round &&
            (item.sequence === 1 || item.state === STATE_SKIP)
    );

    const targetRound = rounds.value.find((item) => item.round === round);

    const now = dayjs();
    let timeset = now.add(1, "day").startOf("day");

    if (targetRound?.timeset) {
        let endDate = date.value;
        let endTime = targetRound.timeset.split("~")[1];

        const endHour = endTime.split(":")[0];
        const endMinute = endTime.split(":")[1];
        if (endHour > 23) {
            endDate = dayjs(endDate).add(1, "day").format("YYYY-MM-DD");
            endTime = `${endHour - 24}:${endMinute}`;
        }

        timeset = dayjs(`${endDate} ${endTime}`);
    }

    if (enteredValue) {
        if (standard.value.partYn === "Y") {
            for (const key in enteredValue.result) {
                if (enteredValue.judgment?.[key] === STATE_NG) ng += 1;
                if (!enteredValue.result[key]) unchecked += 1;
            }

            if (targetRound.skippedParts) {
                unchecked -= targetRound.skippedParts.length;
            }
        } else {
            ng = enteredValue.judgment === STATE_NG ? 1 : 0;
        }
    } else {
        if (standard.value.partYn === "Y") {
            unchecked = dayjs(timeset).isBefore(now)
                ? Object.keys(targetRound.result).length
                : 0;
        } else {
            unchecked = dayjs(timeset).isBefore(now) ? 1 : 0;
        }
    }

    return { ng, unchecked };
});

// 부위있을때 예시 블럭
let skeletonParts = {};

const setInspectItems = async (journalId, journalDate, shift) => {
    skeletonParts = {};

    let currentRound;
    let infoList;
    let remarkList;
    let faultList;
    let roundList;
    let std;
    let timesetList;
    let specList;
    let vehlList;
    let zoneList;

    if (isPreview) {
        currentRound = props.previewParams.currentRound;
        infoList = props.previewParams.infoList;
        roundList = props.previewParams.roundList;
        std = props.previewParams.std;
        timesetList = props.previewParams.timesetList;
        specList = props.previewParams.specList;
        vehlList = props.previewParams.vehlList;
        zoneList = props.previewParams.zoneList;
    } else {
        const data = await fetchInspectItems(journalId, journalDate, shift);

        currentRound = data.currentRound;
        infoList = data.infoList;
        remarkList = data.remarkList;
        faultList = data.faultList;
        roundList = data.roundList;
        std = data.std;
        timesetList = data.timesetList;
        specList = data.specList;
        vehlList = data.vehlList;
        zoneList = data.zoneList;
    }

    if (props.inquiryRound) {
        currentRound = Number(props.inquiryRound);
    }

    // 기준정보
    standard.value = std;

    // 차종
    vehicles.value = vehlList?.map((item) => ({
        title: item.vehlCd,
        value: item.vehlId,
        roundData: item.roundList,
        points: item.pointNm,
        images: item.imageList?.map((image) => ({
            id: image.imgId,
            path: image.path,
        })),
    }));

    // 구역
    if (std.zoneYn === "Y") {
        zones.value = zoneList?.map((item) => ({
            title: item.zoneNm,
            value: item.zoneCd,
        }));
    }

    // 라운드
    rounds.value = [];
    roundList?.forEach((item) => {
        let state = STATE_PENDING;

        if (item.status === "Y") {
            state = STATE_SUCCESS;
        } else if (item.status === "S") {
            state = STATE_SKIP;
        } else {
            if (item.inspectList) {
                state = STATE_UNDERWAY;
            }
        }

        const timeset = timesetList?.find(
            (ts) => ts.round === item.round
        )?.timesetNm;
        const valueType = std.resultTypeCd;

        const round = {
            round: item.round,
            timeset,
            state,
            valueType,
            vehicle: vehicles.value[0].value,
            bodyNumber: null,
            zone: null,
            remark: std.partYn === "Y" ? {} : null,
            result: std.partYn === "Y" ? {} : null,
            skippedParts: [],
        };

        if (state === STATE_SUCCESS || state === STATE_UNDERWAY) {
            item.inspectList.forEach((inspectItems, index) => {
                let result = inspectItems[0].inspectVal;
                let remark = inspectItems[0].remark;
                let judgment = inspectItems[0].result;
                let parts;
                const skippedParts = [];

                if (std.partYn === "Y") {
                    result = {};
                    remark = {};
                    judgment = {};
                    parts = {};

                    inspectItems.forEach((partItem) => {
                        result[partItem.partId] = partItem.inspectVal;
                        remark[partItem.partId] = partItem.remark;
                        judgment[partItem.partId] = partItem.result;
                        parts[partItem.partId] = partItem;

                        if (partItem.skipYn === "Y")
                            skippedParts.push(partItem.partId);
                    });
                }

                const vehicle = inspectItems[0].vehlId;
                const bodyNumber = inspectItems[0].bodyNo;
                const zone = inspectItems[0].zoneCd;

                entered.value.push({
                    id: v4(),
                    sequence: inspectItems[0].resSeq,
                    round: item.round,
                    timeset,
                    state,
                    valueType,
                    vehicle,
                    bodyNumber,
                    zone,
                    result,
                    judgment,
                    parts,
                    remark,
                    skippedParts,
                });

                // enter box에 0번 인덱스(추가점검이 아닌 인덱스)만 등록
                if (index === 0) {
                    round.vehicle = vehicle;
                    round.bodyNumber = bodyNumber;
                    round.zone = zone;
                    round.result = result;
                    round.skippedParts = skippedParts;
                }
            });
        }

        rounds.value.push(round);

        if (state === STATE_SKIP) {
            entered.value.push({
                id: v4(),
                round: item.round,
                timeset,
                state: STATE_SKIP,
                valueType,
                vehicle: null,
                bodyNumber: null,
                zone: null,
                result: std.partYn === "Y" ? {} : null,
                skipReason: item.skipDesc,
            });
        }
    });

    enterRound.value = rounds.value?.find(
        (item) => item.round === currentRound
    );
    viewRound.value = currentRound;

    specList?.forEach((item) => {
        if (!skeletonParts[item.round]) skeletonParts[item.round] = {};
        if (!skeletonParts[item.round][item.vehlCd])
            skeletonParts[item.round][item.vehlCd] = {};

        skeletonParts[item.round][item.vehlCd][item.partId] = item;
    });

    // 부가정보
    additionalInfos.value = infoList?.map((item) => ({
        title: item.title,
        content: item.contents,
    }));

    // 특이사항
    let isSomeComment = false;
    comments.value = [];

    for (let i = 1; i <= userStore.shop.shift_cd; i++) {
        const comment = remarkList?.find((item) => item.shiftCd == i);
        if (comment?.remark) isSomeComment = true;

        comments.value.push({
            id: comment?.remarkResId,
            shift: i,
            comment: comment?.remark,
            disabled: i != shift,
            resId: standard.value.resId,
        });
    }
    isCommentReg.value = isSomeComment;

    // 불량내용조회
    defects.value = [];
    if (faultList) {
        defects.value = faultList?.map((item) => {
            const { equip, point } = JSON.parse(item.pointNm);

            return {
                id: item.faultResId,
                round: item.round,
                vehicle: getTitle(vehicles.value, item.vehlId),
                bodyNumber: item.bodyNo,
                zone: item.zoneNm,
                equip,
                point,
                defect: item.fault,
                comment: item.action,
                register: item.regNm,
                date: item.regDt,
            };
        });
    }

    // 차종 이미지 기본 설정
    setVehicleImages(vehicles.value?.[0].value);
};

const imagePage = ref(1);

const images = ref([
    {
        id: "$NO_IMAGE",
        src: noImage,
        loading: false,
    },
]);

const setVehicleImages = async (vehicle) => {
    imagePage.value = 1;

    const currentVehicle = vehicles.value.find(
        (item) => item.value === vehicle
    );

    const newImages = [];

    currentVehicle.images?.forEach(({ id, path }) => {
        const isDownloaded = !!images.value.find((item) => item.id === id);

        if (!isDownloaded) {
            newImages.push({
                id,
                path,
                src: null,
                loading: true,
            });
        }
    });

    if (newImages.length < 1) return;

    images.value.push(...newImages);

    newImages.forEach(async (item) => {
        try {
            const file = await bodyDownload(item.path);

            const image = images.value.find((img) => img.id === item.id);

            image.src = URL.createObjectURL(file);
            image.loading = false;
        } catch (error) {
            // 실패 시 이미지 대체
            const image = images.value.find((img) => img.id === item.id);
            image.src = noImage;
            image.loading = false;

            if (import.meta.env.DEV) console.error(error);
            newToast(commonCode("MESSAGE", "MSG000023"), "error"); // 이미지를 불러오지 못했습니다
        }
    });
};

const vehicleImages = computed(() => {
    const currentVehicle = vehicles.value.find(
        (item) => item.value === enterRound.value.vehicle
    );

    const imageIds = [];

    currentVehicle?.images?.forEach((item) => {
        imageIds.push(item.id);
    });

    if (imageIds.length < 1) {
        imageIds.push("$NO_IMAGE");
    }

    return images.value.filter((item) => imageIds?.includes(item.id));
});

const changeViewRound = () => {
    viewRound.value = enterRound.value.round;
};

const handleDone = async (item) => {
    if (isPreview) {
        newToast(commonCode("MESSAGE", "MSGI000129"), "info");
        return;
    }

    await handleEnter(item);
    await handleSuccess(item);
};

const handleEnter = async (addItem) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        const params = [];
        const param = {
            round: addItem.round,
            vehlId: addItem.vehicle,
            bodyNo: addItem.bodyNumber,
            zoneCd: addItem.zone,
            zoneNm: getTitle(zones.value, addItem.zone),
        };

        if (standard.value.partYn === "Y") {
            // 멀티파트
            addItem.judgment = {};

            for (const key in addItem.result) {
                const resultValue = addItem.result[key];

                const partParam = {
                    ...param,
                    partId: key,
                    inspectVal: resultValue,
                };

                if (addItem.parts[key].resultTypeCd === "J") {
                    // 판정
                    addItem.judgment[key] = partParam.result = resultValue;
                } else {
                    if (resultValue) {
                        // 측정
                        if (
                            isValidStandard(
                                resultValue,
                                addItem.parts[key].minVal,
                                addItem.parts[key].maxVal
                            )
                        ) {
                            addItem.judgment[key] = partParam.result = STATE_OK;
                        } else {
                            addItem.judgment[key] = partParam.result = STATE_NG;
                        }
                    } else {
                        addItem.judgment[key] = partParam.result = null;
                    }
                }

                if (resultValue && addItem.skippedParts.includes(Number(key))) {
                    addItem.skippedParts = addItem.skippedParts.filter(
                        (item) => item != key
                    );
                }

                partParam.skipYn = addItem.skippedParts?.includes(Number(key))
                    ? "Y"
                    : "N";

                params.push(partParam);
            }
        } else {
            // 단일 (OK/NG)
            // param.lr =
            addItem.judgment = param.result = param.inspectVal = addItem.result;

            params.push(param);
        }

        // 추가점검으로 점검한 데이터만 Y (현재라운드에서 2번째 이후 데이터)
        const additionalYn = entered.value.find(
            (item) =>
                item.round === addItem.round && item.state === STATE_SUCCESS
        )
            ? "Y"
            : "N";

        const res = await submitJournals(
            {
                resYmd: date.value,
                shiftId: userStore.shopShiftCodeGroup,
                shiftCd: currentShift.value,
                jnlId: standard.value.jnlId,
                version: standard.value.version,
                resId: standard.value.resId,
                maxRound: standard.value.maxRound,
                partYn: standard.value.partYn,
                bodyNoYn: standard.value.bodyNoYn,
            },
            params,
            additionalYn
        );

        if (res.header.code === 42) {
            newToast(commonCode("MESSAGE", "MSGI000168"), "error"); // 차대 번호는 최대 10자리까지 입력 할 수 있습니다.
            return;
        }

        if (standard.value.resId === 0) {
            standard.value.resId = res.body.resId;
            comments.value = comments.value.map((item) => ({
                ...item,
                resId: res.body.resId,
            }));
        }
        addItem.state = STATE_UNDERWAY;
        addItem.sequence = res.body.inspectRes[0].resSeq;

        editOrEnterItem(addItem);

        viewRound.value = addItem.round;
        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    }
};

const editOrEnterItem = (newItem) => {
    const targetItemIndex = entered.value.findIndex(
        (item) =>
            item.round === newItem.round && item.sequence === newItem.sequence
    );

    if (targetItemIndex > -1) {
        entered.value[targetItemIndex] = {
            ...entered.value[targetItemIndex],
            ...newItem,
        };
    } else {
        const newEnteredItem = {
            ...newItem,
            id: v4(),
        };

        entered.value.push(newEnteredItem);
    }
};

const getStandardText = (part) => {
    if (part.resultTypeCd === "J") return `${STATE_OK}/${STATE_NG}`;
    if (!part.specVal) return `${part.minVal}~${part.maxVal} ${part.unitCd}`;
    return `${part.specVal} ${commonCode("RMS000013", part.unitCd)}`;
};

const handleSuccess = async (roundItem) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        await setStateSuccess(standard.value.resId, roundItem.round);
        const enteredItem = entered.value.find(
            (item) =>
                item.round === roundItem.round &&
                item.sequence === roundItem.sequence
        );
        if (enteredItem) enteredItem.state = STATE_SUCCESS;
        roundItem.state = STATE_SUCCESS;

        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    }
};

const handleEdit = async (editItem) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        editModalLoading.value = true;

        const param = {
            round: editItem.round,
            vehlId: editItem.vehicle,
            bodyNo: editItem.bodyNumber,
            zoneCd: editItem.zone,
            zoneNm: getTitle(zones.value, editItem.zone),
            resSeq: editItem.sequence,
            remark: editItem.remark,
            partId: editItem.partId,
            inspectVal: editItem.result,
            skipYn: editItem.skip ? "Y" : "N",
        };

        if (standard.value.partYn === "Y") {
            if (editItem.parts[editItem.partId].resultTypeCd === "J") {
                // 판정
                param.result = editItem.result;
            } else {
                // 측정
                if (editItem.result) {
                    if (
                        isValidStandard(
                            editItem.result,
                            editItem.parts[editItem.partId].minVal,
                            editItem.parts[editItem.partId].maxVal
                        )
                    ) {
                        param.result = STATE_OK;
                    } else {
                        param.result = STATE_NG;
                    }
                } else {
                    param.result = null;
                }
            }
        } else {
            // 단일 (OK/NG)
            param.result = editItem.result;
        }

        const uploadImages = inspectImages.value.filter((item) => !!item.file);
        if (uploadImages.length > 0) {
            const formData = new FormData();

            for (const image of uploadImages) {
                formData.delete("file");
                formData.append("file", image.file);

                const fileName = await bodyUpload(formData);

                image.path = fileName;
                delete image.file;
            }
        }

        await submitJournals(
            {
                resYmd: date.value,
                shiftId: userStore.shopShiftCodeGroup,
                shiftCd: currentShift.value,
                jnlId: standard.value.jnlId,
                version: standard.value.version,
                resId: standard.value.resId,
                maxRound: standard.value.maxRound,
                partYn: standard.value.partYn,
                bodyNoYn: standard.value.bodyNoYn,
            },
            [param],
            "N",
            uploadImages.map((item) => item.path)
        );

        const targetItem = entered.value.find(
            (item) => item.id === editItem.id
        );

        if (standard.value.partYn === "Y") {
            targetItem.result[editItem.partId] = editItem.result;
            targetItem.remark[editItem.partId] = editItem.remark;
            targetItem.judgment[editItem.partId] = param.result;

            if (!editItem.skip) {
                targetItem.skippedParts = targetItem.skippedParts.filter(
                    (partId) => partId !== Number(editItem.partId)
                );

                const targetRound = rounds.value.find(
                    (item) => item.round === editItem.round
                );

                targetRound.skippedParts = targetItem.skippedParts;
            }
        } else {
            targetItem.result = editItem.result;
            targetItem.remark = editItem.remark;
            targetItem.judgment = param.result;
        }

        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    } finally {
        editModalLoading.value = false;
    }
};

const handleSkip = async (round, reason, parts) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        if (!parts) {
            // 현재 입력된 점검 전체 비움
            entered.value = entered.value.filter(
                (item) => round !== 0 && item.round !== round
            );

            if (round === 0) {
                rounds.value.forEach((item) => {
                    item.state = STATE_SKIP;
                    item.vehicle = vehicles.value[0].value;
                    item.bodyNumber = null;
                    item.zone = null;
                    // item.part = null;
                    item.result = standard.value.partYn === "Y" ? {} : null;
                    item.skipReason = reason;

                    entered.value.push({
                        ...item,
                        id: v4(),
                    });
                });
            } else {
                const targetRound = rounds.value.find(
                    (item) => item.round === round
                );

                targetRound.state = STATE_SKIP;
                targetRound.vehicle = vehicles.value[0].value;
                targetRound.bodyNumber = null;
                targetRound.zone = null;
                // targetRound.part = null;
                targetRound.result = standard.value.partYn === "Y" ? {} : null;
                targetRound.skipReason = reason;

                entered.value.push({
                    ...targetRound,
                    id: v4(),
                });
            }

            await skipJournal(standard.value, round, reason);

            // 선택 라운드 스킵된 라운드로 변경 (전체스킵은 1라운드)
            enterRound.value = rounds.value.find(
                (item) => round === 0 || item.round === round
            );
            viewRound.value = round === 0 ? 0 : round;
        } else {
            // 부위 있을 때 개별스킵
            const res = await skipParts(
                {
                    resYmd: date.value,
                    shiftId: userStore.shopShiftCodeGroup,
                    shiftCd: currentShift.value,
                    jnlId: standard.value.jnlId,
                    version: standard.value.version,
                    resId: standard.value.resId,
                    maxRound: standard.value.maxRound,
                    partYn: standard.value.partYn,
                    bodyNoYn: standard.value.bodyNoYn,
                },
                parts.map((partId) => ({
                    round,
                    partId,
                    skipDesc: reason,
                    vehlId: enterRound.value.vehicle,
                    bodyNo: enterRound.value.bodyNumber,
                    zoneCd: enterRound.value.zone,
                    zoneNm: getTitle(zones.value, enterRound.value.zone),
                    remark: enterRound.value.remark?.[partId],
                }))
            );

            enterRound.value.skippedParts.push(...parts);
            enterRound.value.sequence = res.inspectRes[0].resSeq;

            editOrEnterItem({
                ...enterRound.value,
                round,
            });

            const enteredItem = entered.value.find(
                (item) =>
                    item.round === enterRound.value.round &&
                    item.sequence === enterRound.value.sequence
            );

            parts.forEach((partId) => {
                enterRound.value.result[partId] = null;
                if (!enteredItem.judgment) enteredItem.judgment = {};

                enteredItem.judgment[partId] = null;
            });
        }

        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    }
};

const handleRemove = async (id, round, state, sequence, timeset) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        const confirmTitle =
            state === STATE_SKIP
                ? commonCode("RMS000020", "LB000272") // 점검 초기화
                : commonCode("MESSAGE", "MSG000003"); // 점검 데이터 삭제
        const confirmContent =
            state === STATE_SKIP
                ? commonCode("MESSAGE", "MSGI000164") // 점검예외를 초기화 하시겠습니까?
                : commonCode("MESSAGE", "MSG000033"); // 삭제한 데이터는 되돌릴 수 없습니다. 삭제하시겠습니까?
        const confirmButton =
            state === STATE_SKIP
                ? commonCode("RMS000020", "LB000033") // 초기화
                : commonCode("RMS000020", "LB000075"); // 삭제

        const confirm = await openFeedback(
            "error",
            confirmTitle,
            confirmContent,
            commonCode("RMS000020", "LB000120"), // 취소
            {
                type: "error",
                text: confirmButton,
            }
        );

        if (!confirm) return;

        if (state === STATE_SKIP) {
            await cancelSkipJournal(standard.value, round);
        } else {
            const imageList = await getJournalImages(
                standard.value.resId,
                round,
                sequence
            );
            if (imageList?.length > 0) {
                await removeJournalImages(imageList.map((item) => item.imgId));
            }

            await removeJournal(
                standard.value.resId,
                round,
                sequence,
                date.value,
                timeset
            );
        }

        entered.value = entered.value.filter((item) => item.id !== id);

        entered.value.forEach((item) => {
            if (item.round === round && item.sequence > sequence) {
                item.sequence -= 1;
            }
        });

        enterRound.value = rounds.value.find((item) => item.round === round);

        if (!entered.value.find((item) => item.round === round)) {
            enterRound.value.state = STATE_PENDING;
            enterRound.value.bodyNumber = null;
            enterRound.value.zone = null;

            if (standard.value.partYn === "Y") {
                enterRound.value.result = {};
                enterRound.value.skippedParts = [];
            } else {
                enterRound.value.result = null;
            }
        }

        if (state === STATE_SKIP) {
            newToast(commonCode("MESSAGE", "MSG000027"), "primary"); // 초기화되었습니다
        } else {
            newToast(commonCode("MESSAGE", "MSG000017"), "primary"); // 삭제되었습니다
        }
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);

        if (state === STATE_SKIP) {
            newToast(commonCode("MESSAGE", "MSG000028"), "error"); // 초기화를 실패했습니다
        } else {
            newToast(commonCode("MESSAGE", "MSG000018"), "error"); // 삭제를 실패했습니다
        }
    }
};

const handleDefect = async (defect, comment, equip, point) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        const { round, vehicle, bodyNumber, zone } = enterRound.value;

        const pointParam = JSON.stringify({
            equip,
            point,
        });

        const res = await submitDefect(
            {
                ...standard.value,
                resYmd: date.value,
            },
            round,
            vehicle,
            bodyNumber,
            zone ? bodyCommonCode("ZONE", zone) : null,
            pointParam,
            defect,
            comment
        );

        defects.value.push({
            id: res.faultResId,
            round: res.round,
            vehicle: getTitle(vehicles.value, res.vehlId),
            bodyNumber: res.bodyNo,
            zone: res.zoneNm,
            equip,
            point,
            defect: res.fault,
            comment: res.action,
            register: res.regNm,
            date: res.regDt,
        });

        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    }
};

const handleRemoveDefect = async (id) => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        const confirm = await openFeedback(
            "error",
            commonCode("RMS000020", "LB000075"), // 삭제
            commonCode("MESSAGE", "MSG000033"), // 삭제한 데이터는 되돌릴 수 없습니다. 삭제하시겠습니까?
            commonCode("RMS000020", "LB000120"), // 취소
            {
                type: "error",
                text: commonCode("RMS000020", "LB000075"), // 삭제
            }
        );

        if (!confirm) return;

        await removeDefect(id);

        defects.value = defects.value.filter((item) => item.id !== id);

        newToast(commonCode("MESSAGE", "MSG000017"), "primary"); // 삭제되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000018"), "error"); // 삭제를 실패했습니다
    }
};

const handleComment = async () => {
    try {
        if (isPreview) {
            newToast(commonCode("MESSAGE", "MSGI000129"), "info");
            return;
        }

        const params = [];
        comments.value.forEach(({ id, comment, resId }) => {
            if (comment) {
                params.push({
                    resId,
                    remarkResId: id,
                    remark: comment,
                });
            }
        });

        await submitComment(params);

        isCommentReg.value = true;

        newToast(commonCode("MESSAGE", "MSG000020"), "primary"); // 저장되었습니다
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000021"), "error"); // 저장을 실패했습니다
    }
};

const editModal = ref(false);
const editModalCurrentIndex = ref(0);
const editModalItems = ref([]);
const editModalLoading = ref(false);
const editModalTopValues = ref([]);

const editModalFieldColor = (value) => {
    if (value === null) return null;
    if (value) return "primary";
    return "error";
};

const resetPartSkip = async (item) => {
    item.skip = false;
    await handleEdit(item);
};

const editAndClose = async (item) => {
    await handleEdit(item);
    closeEditModal();
};

const moveEditModal = async (value, item) => {
    if (buttonValidate(UPDATE_METHOD_CODES) && !item.skip)
        await handleEdit(item);

    editModalCurrentIndex.value += value;

    const { round, sequence, valueType, partId } =
        editModalItems.value[editModalCurrentIndex.value];

    await setInspectImages(standard.value.resId, round, sequence);

    editModalTopValues.value = [];
    if (valueType === "M") {
        editModalTopValues.value = await getTopValues(partId);
    }
};

const openEditModal = async (round, id, sequence, part) => {
    editModalLoading.value = true;

    editModalItems.value = [];

    const currentRoundItems = entered.value.filter(
        (item) => item.round === round
    );

    currentRoundItems.forEach((item) => {
        if (item?.parts) {
            for (const key in item.result) {
                editModalItems.value.push({
                    ...item,
                    result: item.result[key],
                    standard: getStandardText(item.parts[key]),
                    unit:
                        item.parts[key].unitCd &&
                        commonCode("RMS000013", item.parts[key].unitCd),
                    min: item.parts[key].minVal,
                    max: item.parts[key].maxVal,
                    valueType: item.parts[key].resultTypeCd,
                    remark: item.remark[key],
                    partName: getPartName(
                        item.parts[key].lv1PartNm,
                        item.parts[key].lv2PartNm,
                        item.parts[key].lv3PartNm
                    ),
                    partId: key,
                    skip: item.skippedParts.includes(Number(key)),
                });
            }
        } else {
            editModalItems.value.push({ ...item });
        }
    });

    editModalCurrentIndex.value = editModalItems.value.findIndex((item) => {
        if (part) {
            return item.id === id && item.partId === part;
        } else {
            return item.id === id;
        }
    });

    editModalTopValues.value = [];
    if (part) {
        if (
            editModalItems.value[editModalCurrentIndex.value].valueType === "M"
        ) {
            editModalTopValues.value = await getTopValues(part);
        }
    }

    inspectImages.value = inspectImages.value.filter((item) => !!item.path);

    await setInspectImages(standard.value.resId, round, sequence);

    editModal.value = true;
    editModalLoading.value = false;
};

const setTopValue = (topValue) => {
    editModalItems.value[editModalCurrentIndex.value].result = topValue;
};

const inspectImages = ref([]);
const currentInspectImages = ref([]);

const setInspectImages = async (id, round, sequence) => {
    const imageList = await getJournalImages(id, round, sequence);

    const newImages = [];

    imageList.forEach(({ imgId, path }) => {
        const isDownloaded = !!inspectImages.value.find(
            (item) => item.path === path
        );

        if (!isDownloaded) {
            newImages.push({
                id: imgId,
                path,
                src: null,
                loading: true,
            });
        }
    });

    if (newImages.length > 1) {
        inspectImages.value.push(...newImages);
    }

    currentInspectImages.value = inspectImages.value.filter((item) =>
        imageList.find((img) => img.path === item.path)
    );

    if (newImages.length > 1) {
        newImages.forEach(async (item) => {
            try {
                const file = await bodyDownload(item.path);

                const image = inspectImages.value.find(
                    (img) => img.path === item.path
                );

                image.src = URL.createObjectURL(file);
                image.loading = false;
            } catch (error) {
                // 실패 시 이미지 대체
                const image = inspectImages.value.find(
                    (img) => img.path === item.path
                );
                image.src = noImage;
                image.loading = false;

                if (import.meta.env.DEV) console.error(error);
                newToast(commonCode("MESSAGE", "MSG000023"), "error"); // 이미지를 불러오지 못했습니다
            }
        });
    }
};

const setImage = () => {
    document.getElementById("img").click();
};

const setFiles = () => {
    try {
        const MAX_LENGTH = 4 - currentInspectImages.value.length;
        const img = document.getElementById("img");
        let files = Array.from(img.files);

        if (files.length > MAX_LENGTH) {
            const transfer = new DataTransfer();
            files = files.slice(0, MAX_LENGTH);

            files.forEach((file) => {
                transfer.items.add(file);
            });
            img.files = transfer.files;

            newToast(commonCode("MESSAGE", "MSG000016"), "warning"); // 이미지는 4장까지 입력 가능합니다
        }

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                const imageObj = new Image();
                imageObj.onload = () => {
                    let resizedFile;

                    const canvas = document.createElement("canvas");
                    const maxSize = 1024000; //1MB
                    const compSize = 512000; //500KB
                    let width = imageObj.width;
                    let height = imageObj.height;
                    const size = file.size;

                    if (size <= maxSize) {
                        resizedFile = file;
                    } else {
                        const ratio = Math.ceil(Math.sqrt(size / compSize, 2));
                        width = imageObj.width / ratio;
                        height = imageObj.height / ratio;
                        canvas.width = width;
                        canvas.height = height;
                        canvas
                            .getContext("2d")
                            .drawImage(imageObj, 0, 0, width, height);

                        const dataURL = canvas.toDataURL(file.type);
                        const byteString = atob(dataURL.split(",")[1]);
                        const mimeString = dataURL
                            .split(",")[0]
                            .split(":")[1]
                            .split(";")[0];
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }

                        //리사이징된 file 객체
                        resizedFile = new Blob([ab], { type: mimeString });
                    }

                    const src = URL.createObjectURL(resizedFile);
                    const newImage = {
                        src,
                        loading: false,
                        file: resizedFile,
                    };
                    inspectImages.value.push(newImage);
                    currentInspectImages.value.push(newImage);
                };

                imageObj.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
    }
};

const closeEditModal = () => {
    editModal.value = false;
};

// 수정 팝업 이미지 뷰어
const imageViewr = ref(false);
const imageViewrPage = ref(1);
const openImageViewr = (page) => {
    imageViewrPage.value = page;
    imageViewr.value = true;
};

const handleRemoveInspectImage = async (targetImage) => {
    try {
        if (!targetImage) return;

        const confirm = await openFeedback(
            "error",
            commonCode("RMS000020", "LB000075"), // 삭제
            commonCode("MESSAGE", "MSG000033"), // 삭제한 데이터는 되돌릴 수 없습니다. 삭제하시겠습니까?
            commonCode("RMS000020", "LB000120"), // 취소
            {
                type: "error",
                text: commonCode("RMS000020", "LB000075"), // 삭제
            }
        );

        if (!confirm) return;

        if (targetImage.id) await removeJournalImages([targetImage.id]);

        imageViewr.value = false;

        inspectImages.value = inspectImages.value.filter(
            (item) => item.src !== targetImage.src
        );
        currentInspectImages.value = currentInspectImages.value.filter(
            (item) => item.src !== targetImage.src
        );
        URL.revokeObjectURL(targetImage.src);
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000018"), "error"); // 삭제를 실패했습니다
    }
};

// FAB 스크롤
const offsetTop = ref(0);

const onScroll = () => {
    offsetTop.value = window.scrollY;
};

const scrollToTop = () => {
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
};

// 기준치 상하한 유효여부
const isValidStandard = (result, min, max) => {
    if (!result) return null;

    if (result === STATE_OK) return true;
    if (result === STATE_NG) return false;

    if (max >= result && min <= result) return true;
    return false;
};

const favoriteStore = useFavorite();

const init = async () => {
    if (props.favoriteId) {
        const favoriteParams = favoriteStore.getFavoriteParams(
            props.favoriteId
        );
        await setJournals(
            favoriteParams.inquiryJournal.value,
            favoriteParams.inquiryShift.value
        );
    } else {
        await setJournals(props.inquiryJournal, props.inquiryShift);
    }

    emitter.on("addFavorite", async () => {
        if (date.value !== today()) {
            return newToast(
                commonCode("MESSAGE", "MSG000020"), // 과거날짜는 즐겨찾기에 등록할 수 없습니다.
                "error"
            );
        }

        const params = {
            inquiryJournal: {
                name: commonCode("RMS000020", "LB000335"),
                value: selectedJournal.value,
                valueNm: journals.value.find(
                    (item) => item.value === selectedJournal.value
                )?.title,
            },
            inquiryShift: {
                name: commonCode("RMS000020", "LB000334"),
                value: currentShift.value,
                valueNm: commonCodeGroup(userStore.shopShiftCodeGroup)[
                    currentShift.value
                ],
            },
        };

        await favoriteStore.addFavorite({
            menuCd: menuStore.currentPage.menu_cd,
            userId: userStore.user.user_id,
            shopCd: userStore.shop.shop_cd,
            parameter: JSON.stringify(params),
        });

        favoriteStore.getFavorite();
    });
};

onMounted(() => {
    init();
});

onUnmounted(() => {
    emitter.off("addFavorite");

    images.value.forEach((image) => {
        URL.revokeObjectURL(image.src);
    });
    inspectImages.value.forEach((image) => {
        URL.revokeObjectURL(image.src);
    });
});

watch(
    () => props.pathName,
    () => {
        init();
    }
);
</script>
