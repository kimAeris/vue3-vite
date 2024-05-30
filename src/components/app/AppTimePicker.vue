<template>
    <VMenu
        :close-on-content-click="pickerType === 'hh'"
        class="app-time-picker"
    >
        <template #activator="{ props }">
            <VTextField
                v-bind="props"
                :model-value="displayTime"
                :variant="variant"
                prepend-inner-icon="mdi-clock-outline"
                :density="density"
                readonly
                hide-details
            />
        </template>

        <VSheet
            width="max-content"
            max-height="300"
            class="d-flex py-2 px-2 ga-1"
        >
            <VList class="no-scroll pa-0" color="primary">
                <template v-for="(_, hh) in maxHours">
                    <VListItem
                        v-if="hh % hhStep === 0"
                        :active="hh === hour"
                        :value="hh"
                        @click="hour = hh"
                        class="rounded-lg"
                    >
                        {{ String(hh).padStart(2, "0") }}
                        <template #append v-if="pickerType === 'hh'">
                            <span class="ml-1">
                                {{ commonCode("RMS000020", "LB000324") }}</span
                            >
                        </template>
                    </VListItem>
                </template>
            </VList>

            <VList
                v-if="pickerType !== 'hh'"
                class="no-scroll pa-0"
                color="primary"
            >
                <template v-for="(_, mm) in maxMinutes">
                    <VListItem
                        v-if="mm % mmStep === 0"
                        :active="mm === minute"
                        :value="mm"
                        @click="minute = mm"
                        class="rounded-lg"
                    >
                        {{ String(mm).padStart(2, "0") }}
                    </VListItem>
                </template>
            </VList>
        </VSheet>
    </VMenu>
</template>

<script setup>
import { ref, computed } from "vue";
import { commonCode } from "@/utils/code";

const props = defineProps({
    modelValue: {
        type: String,
        default: "00:00",
        required: true,
        validator: (v) => /^(?:[0-3]?\d|4[0-7]):[0-5]\d$/.test(v),
    },
    variant: {
        type: String,
        default: "outlined",
    },
    density: {
        type: String,
        default: "default",
    },
    pickerType: {
        type: String,
        default: "hhmm",
        validator: (v) => ["hhmm", "hh"].includes(v),
    },
    hhStep: {
        type: Number,
        default: 1,
    },
    mmStep: {
        type: Number,
        default: 1,
    },
    maxHours: {
        type: Number,
        default: 24,
        validator: (v) => v <= 100,
    },
    maxMinutes: {
        type: Number,
        default: 60,
        validator: (v) => v <= 60,
    },
});

const emits = defineEmits(["update:modelValue"]);

const timeSplit = props.modelValue?.split(":") || "00:00";

const hour = ref(Number(timeSplit[0]));
const minute = ref(Number(timeSplit[1]));

const displayTime = computed(() => {
    const newTime = `${String(hour.value).padStart(2, "0")}:${String(
        minute.value
    ).padStart(2, "0")}`;

    emits("update:modelValue", newTime);

    return newTime;
});
</script>

<style scoped>
.no-scroll {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
}

.no-scroll::-webkit-scrollbar {
    display: none !important;
}
</style>
