<template>
    <VDialog
        :model-value="modelValue"
        @update:model-value="close"
        :class="fullHeight ? 'h-100' : null"
    >
        <VCard :style="fullHeight ? 'height: 100vh' : null">
            <VCardTitle class="pa-5">
                <slot name="header">
                    <div class="d-flex justify-space-between">
                        <div style="width: 40px" />
                        <div>{{ title }}</div>
                        <VBtn
                            variant="text"
                            icon="mdi-close"
                            size="small"
                            @click="close"
                        />
                    </div>
                </slot>
            </VCardTitle>

            <VDivider class="mx-5" />

            <VCardText v-if="$slots['prepend-content']" class="px-5 py-4">
                <slot name="prepend-content"></slot>
            </VCardText>

            <VCardText class="px-5 py-4 overflow-auto">
                <div class="px-5 h-100">
                    <slot></slot>
                </div>
            </VCardText>

            <VCardText v-if="$slots['append-content']" class="px-5 py-4">
                <slot name="append-content"></slot>
            </VCardText>

            <VDivider class="mx-5" />

            <VCardActions class="pa-5">
                <slot name="footer">
                    <div class="w-100 d-flex justify-end ga-2">
                        <VBtn
                            v-if="!hideDefaultCloseButton"
                            variant="outlined"
                            @click="close"
                        >
                            <template v-if="closeButtonText">
                                {{ closeButtonText }}
                            </template>
                            <template v-else>
                                {{ commonCode("RMS000020", "LB000122") }}
                            </template>
                        </VBtn>
                        <slot name="button"></slot>
                    </div>
                </slot>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<script setup>
import { commonCode } from "@/utils/code";

defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
    },
    closeButtonText: {
        type: String,
    },
    hideDefaultCloseButton: {
        type: Boolean,
        default: false,
    },
    fullHeight: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(["update:modelValue", "close"]);

const close = () => {
    emits("update:modelValue", false);
    emits("close");
};
</script>
