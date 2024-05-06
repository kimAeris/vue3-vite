import { defineStore } from "pinia";
import { ref } from "vue";

// UI 표시여부를 결정하는 스토어
export const useUi = defineStore("sider", () => {
    const header = ref(false);
    const sider = ref(false);

    const toggleSider = () => {
        sider.value = !sider.value;
    };

    return {
        header,
        sider,
        toggleSider,
    };
});
