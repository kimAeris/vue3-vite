<template>
    <div class="overflow-auto">
        <div class="d-flex justify-space-between align-center px-2 pt-4">
            <div class="d-flex align-center">
                <VBtn
                    variant="text"
                    icon="mdi-menu-left"
                    class="text-h6"
                    @click="prevMonth"
                />
                <span class="mx-2" :class="generalSize[size].title">
                    {{ `${year}-${month.toString().padStart(2, "0")}` }}
                </span>
                <VBtn
                    variant="text"
                    icon="mdi-menu-right"
                    class="text-h6"
                    @click="nextMonth"
                />
            </div>

            <div class="d-flex justify-end align-end h-100">
                <VBtn
                    class="mb-1"
                    @click="getToday"
                    :disabled="
                        dayjs(`${year}-${month}`).isSame(
                            `${dayjs().get('year')}-${dayjs().get('month') + 1}`
                        )
                    "
                    :size="generalSize[size].element"
                >
                    {{ commonCode("RMS000020", "LB000246") }}
                </VBtn>
            </div>
        </div>

        <div class="d-flex flex-no-wrap">
            <div
                v-for="(day, index) in getWeekDays()"
                class="py-2 px-3 date-size bg-surface-variant"
            >
                <span
                    class="font-weight-medium"
                    :class="getWeekendColor(index)"
                >
                    {{ day }}
                </span>
            </div>
        </div>

        <div v-for="week in calendar">
            <div class="d-flex flex-no-wrap">
                <div
                    v-for="(date, day) in week"
                    class="py-2 px-3 date-size"
                    :class="getDateBgClass(date.isCurrentMonth, date.isMarked)"
                    @click="
                        date.isCurrentMonth
                            ? toggleSelect(date.value, date.isMarked, date.id)
                            : null
                    "
                >
                    <VChip
                        v-if="date.value === today"
                        :class="
                            getDateClass(
                                date.isCurrentMonth,
                                day,
                                date.value,
                                generalSize[size].font
                            )
                        "
                        :size="generalSize[size].element"
                    >
                        {{ date.date }}
                    </VChip>

                    <div
                        v-else
                        class="d-inline-block"
                        :class="
                            getDateClass(
                                date.isCurrentMonth,
                                day,
                                date.value,
                                generalSize[size].font
                            )
                        "
                    >
                        {{ date.date }}
                    </div>

                    <div :class="generalSize[size].slot">
                        <VChip
                            v-if="date.info"
                            class="text-caption mt-1 date-cursor-pointer"
                            :size="generalSize[size].element"
                        >
                            {{ date.info }}
                        </VChip>
                    </div>
                </div>
            </div>
            <VDivider />
        </div>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { computed } from "vue";
import { useToast } from "@/stores/toastStore";
import { commonCode } from "@/utils/code";

const props = defineProps({
    now: {
        default: dayjs(),
    },
    year: {
        default: dayjs().get("year"),
    },
    month: {
        default: dayjs().get("month") + 1,
    },
    selected: {
        type: Object,
    },
    markDays: {
        type: Array,
    },
    selectBeforeDays: {
        type: Boolean,
        default: false,
    },
    dateInfo: {
        type: Array,
    },
    size: {
        type: String,
        default: "default",
    },
});

const emits = defineEmits(["update:selected", "update:year", "update:month"]);

const generalSize = {
    default: {
        title: "text-h6",
        font: "text-body-1",
        element: "default",
        slot: "defalut-chip-slot",
    },
    small: {
        title: "text-body-2",
        font: "text-body-2",
        element: "small",
        slot: "small-chip-slot",
    },
};

const today = props.now.format("YYYY-MM-DD");

const prevMonth = () => {
    if (props.month === 1) {
        emits("update:month", 12);
        emits("update:year", props.year - 1);
    } else {
        emits("update:month", props.month - 1);
    }
};

const nextMonth = () => {
    if (props.month === 12) {
        emits("update:month", 1);
        emits("update:year", props.year + 1);
    } else {
        emits("update:month", props.month + 1);
    }
};

const getToday = () => {
    emits("update:year", props.now.get("year"));
    emits("update:month", props.now.get("month") + 1);
};

const getWeekDays = () => {
    const start = props.now.startOf("week");
    const end = props.now.endOf("week");
    const days = [];
    for (let day = start; day <= end; day = day.add(1, "day")) {
        days.push(day.format("ddd"));
    }
    return days;
};

const getMonthCalendar = (year, month, markDays, dateInfos) => {
    const firstDayOfMonth = dayjs(`${year}-${month}-01`);
    const firstDayOfCalendar = firstDayOfMonth.startOf("week");
    const lastDayOfMonth = firstDayOfMonth.endOf("month");
    const lastDayOfCalendar = lastDayOfMonth.endOf("week");

    const calendar = [];
    let date = firstDayOfCalendar;
    let week = [];

    while (date.isBefore(lastDayOfCalendar)) {
        const value = date.format("YYYY-MM-DD");
        const markDay = markDays?.find((item) => item.date === value);
        const dateInfo = dateInfos?.find((item) => item.date === value);

        week.push({
            date: date.format("DD"),
            value,
            isCurrentMonth: date.isSame(firstDayOfMonth, "month"),
            id: markDay?.id,
            isMarked: markDay ? markDay?.isMarked : "N",
            info: dateInfo ? dateInfo?.info : null,
        });
        if (date.day() === 6) {
            calendar.push(week);
            week = [];
        }
        date = date.add(1, "day");
    }

    return calendar;
};

const calendar = computed(() =>
    getMonthCalendar(props.year, props.month, props.markDays, props.dateInfo)
);

const getWeekendColor = (day) => {
    let color;
    if (day === 0) {
        color = "text-red-accent-1";
    } else if (day === 6) {
        color = "text-blue-accent-1";
    }
    return color;
};

const getDateClass = (isCurrentMonth, day, date, textSize) => {
    const classes = [textSize];
    if (!isCurrentMonth) {
        classes.push("not-current-month");
    }

    if (day === 0) {
        classes.push("text-red-darken-4");
    } else if (day === 6) {
        classes.push("text-blue-darken-4");
    }

    if (date === today) {
        classes.push("today");
    }

    return classes.join(" ");
};

const getDateBgClass = (isCurrentMonth, isMarked) => {
    const classes = [];
    if (isCurrentMonth) {
        classes.push("date-cursor-pointer");
    }

    if (isMarked === "Y") {
        classes.push("marked-date");
    }

    return classes.join(" ");
};

const { newToast } = useToast();

const toggleSelect = (date, isMarked, id) => {
    if (!props.selectBeforeDays) {
        if (dayjs(date).isBefore(props.now, "date")) {
            newToast(commonCode("MESSAGE", "MSG000006"), "warning"); // 이전 날짜를 수정 할 수 없습니다
            return;
        }
    }

    const value = {
        date,
        isMarked,
        id,
    };
    emits("update:selected", value);
};
</script>

<style lang="scss" scoped>
.defalut-chip-slot {
    min-height: 34px;
}

.small-chip-slot {
    min-height: 28px;
}

.date-cursor-pointer {
    cursor: pointer;
}

.not-current-month {
    opacity: 0.38;
}

.today {
    font-weight: bold;
    color: rgb(var(--v-theme-secondary)) !important;
}

.date-size {
    width: 100%;
    min-width: 100px;
}

.marked-date {
    background-color: rgba(
        var(--v-theme-secondary),
        calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier))
    ) !important;
}
</style>
