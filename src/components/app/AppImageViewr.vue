<template>
    <ModalContainer
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
    >
        <template #header>
            <div class="d-flex">
                <slot name="title">
                    <h6>
                        <!-- 이미지 뷰어 -->
                        {{ commonCode("RMS000020", "LB000409") }}
                    </h6>
                </slot>

                <div class="d-flex ga-3 ml-auto">
                    <VBtn
                        variant="outlined"
                        color="primary"
                        @click="zoomIn"
                        :disabled="canZoomIn"
                    >
                        <template #prepend>
                            <VIcon
                                icon="mdi-plus"
                                class="text-medium-emphasis"
                            />
                        </template>
                        <!-- 확대 -->
                        {{ commonCode("RMS000020", "LB000410") }}
                    </VBtn>

                    <VBtn
                        variant="outlined"
                        color="primary"
                        @click="zoomOut"
                        :disabled="canZoomOut"
                    >
                        <template #prepend>
                            <VIcon
                                icon="mdi-minus"
                                class="text-medium-emphasis"
                            />
                        </template>
                        <!-- 축소 -->
                        {{ commonCode("RMS000020", "LB000411") }}
                    </VBtn>

                    <VBtn variant="outlined" color="primary" @click="reset">
                        <template #prepend>
                            <VIcon
                                icon="mdi-refresh"
                                class="text-medium-emphasis"
                            />
                        </template>
                        {{ commonCode("RMS000020", "LB000033") }}
                    </VBtn>

                    <VBtn
                        variant="text"
                        icon="mdi-close"
                        size="small"
                        @click="$emit('update:modelValue', false)"
                    />
                </div>
            </div>
        </template>

        <div class="h-100">
            <VCarousel v-model="page" hide-delimiters class="h-100">
                <template #prev>
                    <VBtn
                        variant="text"
                        icon="mdi-chevron-left"
                        @click="movePage(-1)"
                    />
                </template>

                <template #next>
                    <VBtn
                        variant="text"
                        icon="mdi-chevron-right"
                        @click="movePage(1)"
                    />
                </template>

                <VSkeletonLoader
                    :loading="images[page - 1].loading"
                    class="w-100 h-100 rounded-lg"
                >
                    <div
                        id="currentImage"
                        class="f-panzoom bg-surface w-100 h-100"
                    >
                        <img
                            class="f-panzoom__content"
                            :src="images[page - 1].src"
                        />
                    </div>
                </VSkeletonLoader>
            </VCarousel>
        </div>

        <template #footer>
            <div class="d-flex align-center w-100">
                <VSlideGroup center-active>
                    <VSlideGroupItem
                        v-for="(img, index) in images"
                        :key="img.src"
                        #default="{ toggle }"
                    >
                        <VSkeletonLoader
                            :loading="img.loading"
                            width="80"
                            height="60"
                            class="rounded-lg"
                            :class="index + 1 !== images.length && 'mr-4'"
                        >
                            <VImg
                                :src="img.src"
                                :lazy-src="img.src"
                                :width="80"
                                :aspect-ratio="4 / 3"
                                cover
                                class="cursor-pointer rounded-lg"
                                :class="
                                    page === index + 1 &&
                                    'border-lg border-selected'
                                "
                                @click="
                                    () => {
                                        page = index + 1;
                                        toggle();
                                    }
                                "
                            />
                        </VSkeletonLoader>
                    </VSlideGroupItem>
                </VSlideGroup>

                <div class="d-flex align-center ml-auto">
                    <div class="d-flex ga-2 mr-6">
                        <span class="font-weight-medium">
                            {{ page }}
                        </span>
                        <span class="text-medium-emphasis">/</span>
                        <span class="text-medium-emphasis">
                            {{ images.length }}
                        </span>
                    </div>

                    <VBtn
                        v-if="showRemove && buttonValidate(DELETE_METHOD_CODE)"
                        variant="outlined"
                        color="error"
                        @click="$emit('remove', images[page - 1])"
                    >
                        <!-- 삭제 -->
                        {{ commonCode("RMS000020", "LB000075") }}
                    </VBtn>
                    <VBtn
                        variant="outlined"
                        @click="movePage(-1)"
                        :disabled="page <= 1"
                    >
                        <!-- 이전 -->
                        {{ commonCode("RMS000020", "LB000134") }}
                    </VBtn>
                    <VBtn
                        variant="outlined"
                        @click="movePage(1)"
                        :disabled="page >= images.length"
                    >
                        <!-- 다음 -->
                        {{ commonCode("RMS000020", "LB000135") }}
                    </VBtn>
                </div>
            </div>
        </template>
    </ModalContainer>
</template>

<script setup>
import ModalContainer from "@/components/ModalContainer.vue";
import { commonCode } from "@/utils/code";
import { Panzoom } from "@fancyapps/ui/dist/panzoom/panzoom.esm.js";
import "@fancyapps/ui/dist/panzoom/panzoom.css";
import { ref, onMounted } from "vue";
import { buttonValidate } from "@/utils/common";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    imagePage: {
        type: Number,
        required: true,
        default: 0,
    },
    images: {
        type: Array,
        required: true,
        default: [],
    },
    showRemove: {
        type: Boolean,
        default: false,
    },
});

defineEmits(["update:modelValue", "remove"]);

const DELETE_METHOD_CODE = [import.meta.env.VITE_BUTTON_TYPE_DELETE];

const page = ref(props.imagePage);

let pz;

const canZoomIn = ref(false);
const canZoomOut = ref(true);

const setCanZoom = () => {
    canZoomIn.value = !pz?.canZoomIn();
    canZoomOut.value = !pz?.canZoomOut();
};
const zoomIn = () => {
    pz?.zoomIn(1.2);
    setCanZoom();
};
const zoomOut = () => {
    pz?.zoomOut(0.8);
    setCanZoom();
};
const reset = () => {
    pz?.reset();
    setCanZoom();
};

const movePage = (value) => {
    const newPage = page.value + value;
    if (newPage > props.images.length) {
        page.value = 1;
    } else if (newPage < 1) {
        page.value = props.images.length;
    } else {
        page.value = newPage;
    }
};

onMounted(() => {
    const container = document.getElementById("currentImage");
    const options = {
        click: "toggleCover",
        on: {
            wheel: () => {
                setCanZoom();
            },
            refresh: () => {
                reset();
            },
        },
        maxScale: 4,
    };

    pz = new Panzoom(container, options);
});
</script>

<style scoped>
.border-selected {
    border-color: rgba(var(--v-theme-primary), 1) !important;
}
</style>
