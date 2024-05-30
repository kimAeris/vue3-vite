<template>
    <VRow>
        <VCol v-for="item in items">
            <VCard class="px-2" :height="`${HEIGHT}px`" variant="outlined">
                <div class="d-flex justify-space-between align-end">
                    <VCardTitle
                        class="text-subtitle-1 text-primary pb-1 font-weight-medium"
                    >
                        {{ item.title }}
                    </VCardTitle>
                    <template
                        v-if="item.useColumn === 'line_no' && !decidedLine"
                    >
                        <div class="pb-1">
                            <VBtn
                                icon="mdi-plus"
                                variant="text"
                                size="x-small"
                                @click="setLine(line + 1)"
                            />
                            <VBtn
                                icon="mdi-minus"
                                variant="text"
                                size="x-small"
                                class="ml-1"
                                :disabled="originLine >= line"
                                @click="setLine(line - 1)"
                            />
                        </div>
                    </template>
                </div>
                <VDivider />

                <VList
                    color="secondary"
                    density="compact"
                    class="overflow-auto"
                    :height="`${HEIGHT - 48}px`"
                >
                    <template
                        v-if="item.useColumn === 'line_no' && !decidedLine"
                    >
                        <VListItem
                            v-for="(_, i) in [...Array(line)]"
                            @click="
                                item?.last
                                    ? setSelectedLastLine(
                                          item.useColumn,
                                          i + 1,
                                          item.parentColumn
                                      )
                                    : setSelected(item.useColumn, i + 1)
                            "
                            :value="i + 1"
                            :title="i + 1"
                            rounded="lg"
                        />
                    </template>
                    <template v-else>
                        <template v-if="item?.data">
                            <VListItem
                                v-for="data in item.data"
                                @click="setSelected(item.useColumn, data)"
                                :value="data"
                                :title="data[item.useColumn]"
                                rounded="lg"
                            />
                        </template>
                        <template v-else>
                            <template
                                v-if="
                                    !item?.beforeLine ||
                                    (!!selected?.line_no && !decidedLine)
                                "
                            >
                                <VListItem
                                    v-for="child in selected[item.parentColumn]
                                        ?.childList"
                                    @click="
                                        setSelected(
                                            item.useColumn,
                                            child,
                                            item?.last
                                        )
                                    "
                                    :value="child"
                                    :title="child[item.useColumn]"
                                    rounded="lg"
                                />
                            </template>
                        </template>
                    </template>
                </VList>
            </VCard>
        </VCol>
    </VRow>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    createHandler: {
        type: Function,
        required: true,
    },
    decidedLine: {
        type: Boolean,
        default: false,
    },
});

const HEIGHT = 220;

const selected = ref([]);

const setSelected = (key, value, isLast) => {
    const newValue = {
        ...selected.value,
        [key]: value,
    };

    selected.value = newValue;

    if (isLast) props.createHandler(value, selected.value.line_no);
};

const setSelectedLastLine = (key, value, parent) => {
    const newValue = {
        ...selected.value,
        [key]: value,
    };

    selected.value = newValue;

    props.createHandler(selected.value[parent].childList[0], value);
};

const line = ref(1);
const originLine = computed(() => {
    const parentColumn = props.items.find(
        (item) => item.useColumn === "line_no"
    )?.parentColumn;

    let value = selected.value[parentColumn]?.maxLine;

    if (!value) {
        value = 1;
    }

    if (value > line.value) {
        line.value = value;
    }
    return value;
});
const setLine = (newLine) => {
    line.value = newLine;
};
</script>
