<template>
    <div class="d-flex align-center px-2 flex-wrap overflow-x-auto">
        <VSkeletonLoader :loading="loading" type="heading" width="100px">
            <h6 :class="titleColor" class="text-no-wrap mr-2">
                <template v-if="hideTitle"> </template>
                <template v-else-if="title">
                    {{ title }}
                </template>
                <template v-else>
                    {{ commonCode("RMS000020", "LB000032") }}
                </template>
            </h6>
        </VSkeletonLoader>

        <slot name="appendTitle"></slot>

        <div class="d-flex ml-auto ga-2 justify-end flex-wrap">
            <VSkeletonLoader :loading="loading" type="text" width="150px">
                <VSelect
                    :model-value="itemsPerPage"
                    @update:model-value="$emit('update:itemsPerPage', $event)"
                    :items="selectablePages"
                    variant="solo"
                    style="min-width: 140px"
                    density="compact"
                    flat
                    hide-details
                />

                <VPagination
                    :model-value="page"
                    @update:model-value="$emit('update:page', $event)"
                    :length="length"
                    :total-visible="smAndDown ? 3 : 6"
                    rounded="lg"
                    size="small"
                    active-color="secondary"
                />
            </VSkeletonLoader>
        </div>
    </div>

    <VDivider v-if="!hideDivider" class="mb-4" />
</template>

<script setup>
import { commonCode } from "@/utils/code";
import { useDisplay } from "vuetify/lib/framework.mjs";

const { smAndDown } = useDisplay();

const props = defineProps({
    hideTitle: {
        type: Boolean,
    },
    title: {
        type: String,
    },
    titleColor: {
        type: String,
        default: "text-primary",
    },
    hideDivider: {
        type: Boolean,
        default: false,
    },
    itemsPerPage: {
        type: Number,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});

defineEmits(["update:itemsPerPage", "update:page"]);

const selectablePages = [
    {
        title: `10 ${commonCode("RMS000020", "LB000114")}`,
        value: 10,
    },
    {
        title: `20 ${commonCode("RMS000020", "LB000114")}`,
        value: 20,
    },
    {
        title: `30 ${commonCode("RMS000020", "LB000114")}`,
        value: 30,
    },
    {
        title: `40 ${commonCode("RMS000020", "LB000114")}`,
        value: 40,
    },
    {
        title: `50 ${commonCode("RMS000020", "LB000114")}`,
        value: 50,
    },
    {
        title: commonCode("RMS000020", "LB000027"),
        value: Number.MAX_SAFE_INTEGER,
    },
];
</script>
