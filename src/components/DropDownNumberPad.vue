<template>
    <VMenu
        v-model="isOpen"
        @update:model-value="openMenuHandler"
        :close-on-content-click="false"
        :disabled="disabled"
        class="drop-dwon-number-pad"
    >
        <template v-slot:activator="{ props }">
            <VTextField
                v-bind="props"
                :model-value="modelTextValue"
                :label="label"
                class="input-size"
                :variant="variant"
                :density="density"
                :disabled="disabled"
                :placeholder="placeholder"
                :persistent-placeholder="!!placeholder"
                readonly
                hide-details
                :color="color"
                :suffix="suffix"
                flat
            />
        </template>

        <VSheet
            class="d-flex justify-center align-center flex-column"
            max-width="340"
        >
            <div class="d-flex justify-center align-center px-7 py-5 w-100">
                <VTextField
                    v-model="inputValue"
                    variant="filled"
                    class="w-100"
                    :disabled="disabled"
                    :suffix="suffix"
                    :placeholder="placeholder"
                    :persistent-placeholder="!!placeholder"
                    hide-details
                    clearable
                    persistent-clear
                    @keyup.enter="closeInputPad"
                />
                <VBtn
                    variant="elevated"
                    color="primary"
                    class="ml-3"
                    :disabled="disabled"
                    @click="closeInputPad"
                >
                    <!-- 입력 -->
                    {{ commonCode("RMS000020", "LB000136") }}
                </VBtn>
            </div>

            <NumberPad v-model:value="inputValue" />
        </VSheet>
    </VMenu>
</template>

<script setup>
import { ref, computed } from "vue";
import NumberPad from "@/components/NumberPad.vue";
import { commonCode } from "@/utils/code";

const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        required: true,
        default: null,
    },
    label: {
        type: String,
    },
    variant: {
        type: String,
        default: "solo-filled",
    },
    density: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
    },
    suffix: {
        type: String,
    },
    placeholder: {
        type: String,
    },
});
const emits = defineEmits(["update:modelValue"]);

const modelTextValue = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        emits("update:modelValue", newValue);
    },
});

const isOpen = ref(false);

const inputValue = ref(null);

const closeInputPad = () => {
    modelTextValue.value = inputValue.value;
    isOpen.value = false;
};

const openMenuHandler = () => {
    inputValue.value = modelTextValue.value;
};
</script>

<style scoped>
.input-size {
    min-width: 120px;
}
</style>
