import { defineStore } from "pinia";
import { computed, ref } from "vue";

// 유저 설정 정보를 담은 스토어
export const useUser = defineStore(
    "user",
    () => {
        const accessToken = ref();
        const user = ref({});
        const shop = ref();

        const userSetInfo = computed(() => ({
            lang_cd: user.value?.lang_cd,
            shop_cd: shop.value?.shop_cd,
            user_id: user.value?.user_id,
        }));

        const shopShiftCodeGroup = computed(() =>
            shop.value.shift_cd === "2" ? "RMS000025" : "RMS000026"
        );

        return {
            accessToken,
            user,
            shop,
            shopShiftCodeGroup,
            userSetInfo,
        };
    },

    {
        persist: {
            paths: ["user", "shop"],
        },
        /****** WARNING : 로컬 환경에서 임시로 Token 저장중, 개발계 배포시 수정 필요
        persist: {
            paths: import.meta.env.DEV
                ? ["user", "shop", "accessToken"]
                : ["user", "shop"],
        },
        ******/
    }
);
