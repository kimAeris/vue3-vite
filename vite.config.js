import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { fileURLToPath } from "node:url";
// import { fileURLToPath, URL } from "node:url";
// import mkcert from "vite-plugin-mkcert";
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        vuetify({ autoImport: true }),
        // VitePWA({
        //     useCredentials: true,
        //     manifest: {
        //         theme_color: "#002C5F",
        //         background_color: "#FBFCFF",
        //         display: "fullscreen",
        //         scope: "/",
        //         start_url: "/",
        //         name: "일상관리시스템",
        //         short_name: "일상관리",
        //         icons: [
        //             {
        //                 src: "/icon-192x192.png",
        //                 sizes: "192x192",
        //                 type: "image/png",
        //             },
        //             {
        //                 src: "/icon-256x256.png",
        //                 sizes: "256x256",
        //                 type: "image/png",
        //             },
        //             {
        //                 src: "/icon-512x512.png",
        //                 sizes: "512x512",
        //                 type: "image/png",
        //             },
        //         ],
        //     },
        //     registerType: "autoUpdate",
        //     workbox: {
        //         globPatterns: ["**/*.{css,js,png,svg,ico,woff2}"],
        //         navigateFallback: null,
        //     },
        // }),
        // mkcert(),
    ],
    // define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    // server: {
    //     port: 3000,
    //     https: true,
    // },
});
