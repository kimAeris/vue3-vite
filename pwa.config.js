export default {
    useCredentials: true,
    manifest: {
        theme_color: "#002C5F",
        background_color: "#FBFCFF",
        display: "fullscreen",
        scope: "/",
        start_url: "/",
        name: "일상관리시스템",
        short_name: "일상관리",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-256x256.png",
                sizes: "256x256",
                type: "image/png",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    },
    registerType: "autoUpdate",
    workbox: {
        globPatterns: ["**/*.{css,js,png,svg,ico,woff2}"],
        navigateFallback: null,
    },
};
