import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/routes";
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import "./style.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

registerPlugins(app);

app.use(pinia);
app.use(router);
app.mount("#app");
