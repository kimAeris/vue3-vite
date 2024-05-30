<template>
    <VResponsive class="overflow-visible">
        <VMenu
            v-model="visible"
            :disabled="disabled"
            :close-on-content-click="false"
        >
            <template #activator="{ props }">
                <VBtn
                    v-if="variant === 'icon'"
                    v-bind="props"
                    variant="text"
                    icon="mdi-calendar-blank"
                    :color="color"
                    :size="size"
                    :disabled="disabled"
                    :loading="loading"
                    flat
                >
                    <VIcon icon="mdi-calendar-blank" :size="size" />
                </VBtn>

                <VBtn
                    v-else-if="variant === 'button'"
                    v-bind="props"
                    append-icon="mdi-calendar-blank"
                    :color="color"
                    :size="size"
                    :disabled="disabled"
                    :loading="loading"
                    flat
                >
                    {{ datePicker }}
                </VBtn>

                <div v-else v-bind="props">
                    <VTextField
                        v-model="datePicker"
                        :variant="variant"
                        :label="label"
                        :disabled="disabled"
                        :color="color"
                        prepend-inner-icon="mdi-calendar-blank"
                        :density="density"
                        readonly
                        hide-details
                    />
                </div>
            </template>

            <VDatePicker
                v-model="datePicker"
                @update:model-value="closeDatePicker"
                color="primary"
                class="pb-4"
                :min="min"
                :max="max"
                show-adjacent-months
                hide-actions
            >
                <template #title />
                <template #header />
            </VDatePicker>
        </VMenu>
    </VResponsive>
</template>

<script setup>
import { ref, computed } from "vue";
import { dateFormatting } from "@/utils/days";
import { validDate } from "@/utils/regex";
import isISO8601 from "validator/es/lib/isISO8601";

const props = defineProps({
    modelValue: {
        type: [String, null],
        required: true,
        validator: (v) => v === null || isISO8601(v, { strict: true }),
    },
    label: {
        type: String,
    },
    variant: {
        type: String,
        default: "outlined",
    },
    loading: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: "on-surface",
    },
    min: {
        type: String,
        validator: (value) => validDate(value),
    },
    max: {
        type: String,
        validator: (value) => validDate(value),
    },
    density: {
        type: String,
        default: "comfortable",
    },
    size: {
        type: String,
    },
});

const emits = defineEmits(["update:modelValue"]);

const visible = ref(false);

const datePicker = computed({
    get: () => dateFormatting(props.modelValue),
    set: (value) => {
        const newDate = dateFormatting(value);
        if (newDate !== props.modelValue) {
            emits("update:modelValue", newDate);
        }
    },
});

const closeDatePicker = () => {
    visible.value = false;
};
</script>
