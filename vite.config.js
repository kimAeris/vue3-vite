import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import pwaConfig from "./pwa.config";

const envInfoPlugin = () => ({
    name: "env-info",
    configResolved: ({ mode, env }) => {
        console.info("\x1b[32m%s\x1b[0m", "\n  Running Env Status 🚀\n");
        console.info(
            "\x1b[34m%s\x1b[0m",
            "  ✅ Mode:   ",
            `${
                mode === "localdev"
                    ? "Local"
                    : mode.replace(/^\w/, (c) => c.toUpperCase())
            }`
        );
        console.info(
            "\x1b[35m%s\x1b[0m",
            "  🌐 Server: ",
            `${env.VITE_BASE_URL}\n`
        );
    },
});

export default defineConfig(({ mode }) => ({
    base: "/",
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        vuetify({
            autoImport: true,
        }),
        VitePWA(pwaConfig),
        mkcert(),
        envInfoPlugin(),
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".mjs", ".vue"],
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            "/api": {
                target: loadEnv(mode, process.cwd()).VITE_BASE_URL,
                changeOrigin: true,
                protocolRewrite: true,
                rewrite: (path) => {
                    if (mode === "localdev") return path.replace(/^\/api/, "");
                    return path;
                },
            },
        },
    },
}));
