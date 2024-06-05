```jsx
<template>
    <VSheet class="pa-4 elevation-1">
        <div class="d-flex ga-8 align-center flex-wrap">
            <h5 class="text-primary">{{ menuStore.currentPage.menu_nm }}</h5>

            <VSelect
                :model-value="selectedJournal"
                @update:model-value="updateJournal($event)"
                :items="journals"
                style="min-width: 200px; max-width: 600px"
                hide-details
            />

            <div v-if="!!selectedJournal" class="d-flex ga-8 align-center">
                <UpperLabelText
                    :label="commonCode('RMS000020', 'LB000020')"
                    :text="
                        process
                            ? bodyCommonCode('PROCESS', process)
                            : commonCode('RMS000020', 'LB000350')
                    "
                />

                <VDivider vertical class="my-3" />

                <UpperLabelText
                    :label="commonCode('RMS000020', 'LB000051')"
                    :text="
                        type
                            ? commonCode('RMS000027', type)
                            : commonCode('RMS000020', 'LB000350')
                    "
                />
            </div>
        </div>

        <VDivider class="my-6" />

        <div class="d-flex justify-space-between align-center flex-wrap">
            <div class="d-flex ga-6 w-50">
                <AppDatePicker
                    :model-value="date"
                    @update:model-value="updateDate($event)"
                    :label="commonCode('RMS000020', 'LB000019')"
                    class="w-100"
                    max-width="200px"
                />

                <VSelect
                    v-if="useShift && !!selectedJournal"
                    :model-value="shift"
                    @update:model-value="updateShift($event)"
                    :label="commonCode('RMS000020', 'LB000334')"
                    :items="shiftList"
                    class="w-100"
                    style="min-width: 200px; max-width: 200px"
                />
            </div>

            <div v-if="!!selectedJournal" class="d-flex ga-4">
                <VBtn color="primary" @click="openAdditionalInfoModal">
                    <template #prepend>
                        <VIcon
                            icon="mdi-information"
                            class="text-medium-emphasis"
                        />
                    </template>
                    <!-- 부가정보 -->
                    {{ commonCode("RMS000020", "LB000045") }}
                </VBtn>

                <VBtn color="primary" @click="openDefectModal">
                    {{ commonCode("RMS000020", "LB000336") }}
                </VBtn>
            </div>
        </div>

        <ModalContainer
            v-model="additionalInfoModal"
            :title="commonCode('RMS000020', 'LB000045')"
            max-width="1000"
        >
            <VTable class="h-100" fixed-header>
                <thead>
                    <tr>
                        <th>{{ commonCode("RMS000020", "LB000245") }}</th>
                        <th>{{ commonCode("RMS000020", "LB000026") }}</th>
                    </tr>
                </thead>

                <tbody>
                    <template v-if="additionalInfos.length > 0">
                        <tr v-for="{ title, content } in additionalInfos">
                            <td>{{ title }}</td>
                            <td>{{ content }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="2" class="pa-8 text-center">
                                <!-- 등록된 부가정보가 없습니다 -->
                                {{ commonCode("MESSAGE", "MSGI000150") }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </VTable>
        </ModalContainer>

        <ModalContainer
            v-model="defectModal"
            :title="commonCode('RMS000020', 'LB000336')"
            full-height
        >
            <VTable class="h-100" fixed-header>
                <thead>
                    <tr>
                        <th>{{ commonCode("RMS000029", "ROUND") }}</th>
                        <th>{{ commonCode("RMS000020", "LB000041") }}</th>
                        <th>{{ commonCode("RMS000020", "LB000339") }}</th>
                        <th v-if="useZone">
                            {{ commonCode("RMS000022", "ZONE") }}
                        </th>
                        <th>{{ commonCode("RMS000020", "LB000042") }}</th>
                        <th>{{ commonCode("RMS000020", "LB000405") }}</th>
                        <th>{{ commonCode("RMS000022", "FAULT") }}</th>
                        <th>{{ commonCode("RMS000022", "ACTION") }}</th>
                        <th>{{ commonCode("RMS000020", "LB000058") }}</th>
                        <th>{{ commonCode("RMS000020", "LB000059") }}</th>
                        <th v-if="buttonValidate(DELETE_METHOD_CODE)">
                            {{ commonCode("RMS000020", "LB000075") }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <template v-if="defects.length > 0">
                        <tr v-for="defect in defects" :key="defect.id">
                            <td>{{ defect.round }}</td>
                            <td>{{ defect.vehicle }}</td>
                            <td>{{ defect.bodyNumber }}</td>
                            <td v-if="useZone">{{ defect.zone }}</td>
                            <td>{{ defect.equip }}</td>
                            <td>{{ defect.point }}</td>
                            <td>{{ defect.defect }}</td>
                            <td>{{ defect.comment }}</td>
                            <td>{{ defect.register }}</td>
                            <td>{{ defect.date }}</td>
                            <td v-if="buttonValidate(DELETE_METHOD_CODE)">
                                <VBtn
                                    icon="mdi-close"
                                    variant="text"
                                    color="error"
                                    @click="emits('removeDefect', defect.id)"
                                />
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="9" class="pa-8 text-center">
                                <!-- 등록된 불량내용이 없습니다. -->
                                {{ commonCode("MESSAGE", "MSGI000151") }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </VTable>
        </ModalContainer>
    </VSheet>
</template>

<script setup>
import UpperLabelText from "@/components/UpperLabelText.vue";
import AppDatePicker from "@/components/app/AppDatePicker.vue";
import { useMenu } from "@/stores/menuStore";
import { useUser } from "@/stores/userStore";
import { bodyCommonCode, commonCode, commonCodeGroup } from "@/utils/code";
import { ref } from "vue";
import ModalContainer from "./ModalContainer.vue";
import isISO8601 from "validator/es/lib/isISO8601";
import { useToast } from "@/stores/toastStore";
import { buttonValidate } from "@/utils/common";

const props = defineProps({
    selectedJournal: {
        type: [String, null],
        required: true,
    },
    journals: {
        type: Array,
        required: true,
    },
    process: {
        type: String,
    },
    type: {
        type: String,
    },
    date: {
        type: String,
        required: true,
        validator: (v) => isISO8601(v, { strict: true }),
    },
    shift: {
        type: String,
        required: true,
    },
    additionalInfos: {
        type: Array,
        default: [],
    },
    defects: {
        type: Array,
        default: [],
    },
    useShift: {
        type: Boolean,
        required: true,
        default: true,
    },
    useZone: {
        type: Boolean,
        default: false,
    },
    preview: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const emits = defineEmits([
    "update:selectedJournal",
    "update:date",
    "update:shift",
    "removeDefect",
]);

const DELETE_METHOD_CODE = [import.meta.env.VITE_BUTTON_TYPE_DELETE];

// 현재 페이지
const menuStore = useMenu();

const userStore = useUser();
const shiftCodes = commonCodeGroup(userStore.shopShiftCodeGroup);
const shiftList = Object.keys(shiftCodes).map((key) => ({
    title: shiftCodes[key],
    value: key,
}));

const { newToast } = useToast();

const updateJournal = (newJournal) => {
    if (props.preview) {
        newToast(commonCode("MESSAGE", "MSGI000129"), "info");
        return;
    }
    emits("update:selectedJournal", newJournal);
};

const updateDate = (newDate) => {
    if (props.preview) {
        newToast(commonCode("MESSAGE", "MSGI000129"), "info");
        return;
    }
    emits("update:date", newDate);
};

const updateShift = (newShift) => {
    if (props.preview) {
        newToast(commonCode("MESSAGE", "MSGI000129"), "info");
        return;
    }
    emits("update:shift", newShift);
};

// 부가정보 모달
const additionalInfoModal = ref(false);
const openAdditionalInfoModal = () => {
    additionalInfoModal.value = true;
};

// 불량내용조회 모달
const defectModal = ref(false);
const openDefectModal = () => {
    if (props.preview) {
        newToast(commonCode("MESSAGE", "MSGI000129"), "info");
        return;
    }
    defectModal.value = true;
};
</script>

```
