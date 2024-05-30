import "@mdi/font/css/materialdesignicons.css";
import "@/scss/main.scss";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import theme from "@/plugins/vuetify/config/theme";
import defaults from "@/plugins/vuetify/config/defaults";
import DayJsAdapter from "@date-io/dayjs";
import koKR from "dayjs/locale/ko";
import enUS from "dayjs/locale/en";
import { en, ko } from "vuetify/locale";
import { VFab } from "vuetify/labs/VFab";

// theme: 색상 테마
// defaults: 전역 기본설정
export default createVuetify({
    components: {
        VFab,
    },
    date: {
        adapter: DayJsAdapter,
        locale: {
            ko: koKR,
            en: enUS,
        },
    },
    locale: {
        locale: "ko",
        fallback: "en",
        messages: { ko, en },
    },
    blueprint: md3,
    theme,
    defaults,
});
