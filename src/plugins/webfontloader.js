export async function loadFonts() {
    const webFontLoader = await import("webfontloader");

    // 웹 폰트 관리
    webFontLoader.load({
        google: {
            families: ["Noto Sans KR"],
        },
        custom: {
            families: ["Spoqa Han Sans Neo"],
            urls: ["//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"],
        },
    });
}
