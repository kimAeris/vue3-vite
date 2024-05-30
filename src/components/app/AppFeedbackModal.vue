<template>
    <VDialog v-model="visible" persistent width="auto">
        <VCard min-width="320px" max-width="500px">
            <VCard
                :color="type"
                rounded="0"
                class="d-flex justify-center align-center"
                height="132px"
                flat
            >
                <VIcon size="x-large" :icon="icon" style="font-size: 112px" />
            </VCard>

            <VCardItem class="px-6">
                <VCardTitle>{{ title }}</VCardTitle>
            </VCardItem>

            <VCardText class="px-6">
                <div style="white-space: pre-wrap">
                    {{ content }}
                </div>

                <div class="mt-8" v-if="confirmText">
                    <p
                        class="font-weight-medium px-5 no-drag"
                        oncopy="return false"
                        oncut="return false"
                        onpaste="return false"
                    >
                        {{ confirmText }}
                    </p>
                    <VForm ref="form" validate-on="input" @submit.prevent>
                        <VTextField
                            :label="commonCode('RMS000020', 'LB000136')"
                            :placeholder="confirmText"
                            persistent-placeholder
                            :rules="[confirmEquals]"
                            class="mt-5"
                        />
                    </VForm>
                </div>
            </VCardText>

            <VCardActions class="justify-end px-6 pt-0">
                <VBtn v-if="cancelButtonText" @click="handleCancel">
                    {{ cancelButtonText }}
                </VBtn>
                <VBtn
                    v-if="confirmButton"
                    type="submit"
                    @click="handleConfirm"
                    :color="confirmButton.type"
                    class="ml-3"
                >
                    {{ confirmButton.text }}
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<script setup>
import { useFeedback } from "@/stores/feedbackStore.js";
import { commonCode } from "@/utils/code";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const feedback = useFeedback();
const {
    visible,
    type,
    title,
    content,
    icon,
    cancelButtonText,
    confirmButton,
    confirmText,
} = storeToRefs(feedback);

const form = ref(null);
const handleConfirm = async () => {
    if (confirmText.value) {
        const { valid } = await form.value.validate();
        if (!valid) return;
    }

    feedback.confirm();
};

const handleCancel = () => {
    feedback.cancel();
};

const confirmEquals = (value) =>
    value === confirmText.value ||
    commonCode("MESSAGE", "MSGI000116") ||
    "텍스트를 정확히 입력하세요";
</script>

<style scoped>
.no-drag {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
