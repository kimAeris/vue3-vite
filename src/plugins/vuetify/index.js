// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import theme from "@/plugins/vuetify/config/theme";

// theme: 색상 테마
export default createVuetify({
    theme,
});
