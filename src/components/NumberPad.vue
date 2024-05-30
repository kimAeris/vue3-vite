<template>
    <VSheet class="pa-4">
        <VRow>
            <VCol cols="12" class="d-flex justify-center">
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('1')"
                    :disabled="disabled"
                >
                    <span class="text-h5">1</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    class="mx-2"
                    @mousedown.prevent
                    @click="inputValue('2')"
                    :disabled="disabled"
                >
                    <span class="text-h5">2</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('3')"
                    :disabled="disabled"
                >
                    <span class="text-h5">3</span>
                </VBtn>
            </VCol>
            <VCol cols="12" class="d-flex justify-center">
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('4')"
                    :disabled="disabled"
                >
                    <span class="text-h5">4</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    class="mx-2"
                    @mousedown.prevent
                    @click="inputValue('5')"
                    :disabled="disabled"
                >
                    <span class="text-h5">5</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('6')"
                    :disabled="disabled"
                >
                    <span class="text-h5">6</span>
                </VBtn>
            </VCol>
            <VCol cols="12" class="d-flex justify-center">
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('7')"
                    :disabled="disabled"
                >
                    <span class="text-h5">7</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    class="mx-2"
                    @mousedown.prevent
                    @click="inputValue('8')"
                    :disabled="disabled"
                >
                    <span class="text-h5">8</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('9')"
                    :disabled="disabled"
                >
                    <span class="text-h5">9</span>
                </VBtn>
            </VCol>
            <VCol cols="12" class="d-flex justify-center">
                <VBtn
                    color="secondary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('.')"
                    :disabled="disabled"
                >
                    <span class="text-h5">.</span>
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    size="x-large"
                    class="mx-2"
                    @mousedown.prevent
                    @click="inputValue('0')"
                    :disabled="disabled"
                >
                    <span class="text-h5">0</span>
                </VBtn>
                <VBtn
                    color="secondary"
                    variant="tonal"
                    size="x-large"
                    @mousedown.prevent
                    @click="inputValue('b')"
                    :disabled="disabled"
                >
                    <VIcon icon="mdi-backspace-outline" class="text-h5" />
                </VBtn>
            </VCol>
        </VRow>
    </VSheet>
</template>

<script setup>
const props = defineProps({
    value: {
        type: [String, Number, null],
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(["update:modelValue", "update:value"]);

// 버튼 기능구현
const inputValue = (char) => {
    let newValue;
    if (char === ".") {
        if (String(props.value).includes(".")) return;
    }

    if (!props.value) {
        if (char === "b") return;

        newValue = char;
    } else {
        if (char === "b") {
            newValue = String(props.value).slice(0, -1);
        } else {
            newValue = props.value + char;
        }
    }
    emits("update:value", newValue);
};
</script>
