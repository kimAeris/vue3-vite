import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";

export function registerPlugins(app) {
    loadFonts();
    app.use(vuetify);
}
