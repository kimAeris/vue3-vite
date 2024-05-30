<template>
    <template v-if="active">
        <VTextField
            v-if="type === 'text'"
            :model-value="value"
            @update:model-value="$emit('update:value', $event)"
            variant="outlined"
            density="compact"
            :suffix="suffix"
            class="input-size"
            hide-details
        />
        <!-- :suffix="suffix" -->
        <VTextField
            v-else-if="type === 'number'"
            :model-value="value"
            @update:model-value="$emit('update:value', Number($event))"
            type="number"
            variant="outlined"
            density="compact"
            class="input-size"
            hide-details
        />

        <VSelect
            v-else-if="type === 'select'"
            :model-value="value"
            @update:model-value="$emit('update:value', $event)"
            :items="selectList"
            item-title="code_nm"
            item-value="com_cd"
            density="compact"
            class="input-size"
            :no-data-text="noDataText"
            hide-details
        />
        <VAutocomplete
            v-else-if="type === 'autocomplete'"
            :model-value="value"
            @update:model-value="$emit('update:value', $event)"
            :items="selectList"
            item-title="code_nm"
            item-value="com_cd"
            density="compact"
            class="input-size"
            :no-data-text="noDataText"
            hide-details
        />
        <AppDatePicker
            v-else-if="type === 'date'"
            :model-value="value"
            @update:model-value="$emit('update:value', $event)"
            variant="outlined"
            class="date-picker-size"
        />
    </template>
    <template v-else>
        <template v-if="selectList">
            {{
                selectList.find((item) => item.com_cd === value)?.code_nm
                    ? selectList.find((item) => item.com_cd === value)?.code_nm
                    : value
            }}
        </template>
        <template v-else>
            {{
                suffix && (value || value === 0) ? `${value} ${suffix}` : value
            }}
        </template>
    </template>
</template>

<script setup>
import AppDatePicker from "./app/AppDatePicker.vue";

const props = defineProps({
    active: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        required: true,
    },
    selectList: {
        type: Array,
    },
    suffix: {
        type: String,
    },
    noDataText: {
        type: String,
        default: "NO DATA",
    },
});

defineEmits(["update:value"]);
</script>

<style scoped>
.input-size {
    min-width: 120px;
}

.date-picker-size {
    min-width: 160px;
}

.date-time-picker-size {
    min-width: 340px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}
</style>
