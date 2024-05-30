<template>
    <div>
        <VBtnToggle
            v-model="company"
            rounded="md"
            variant="outlined"
            class="w-100"
            style="height: 60px !important"
            mandatory
        >
            <VBtn min-width="192" width="33.3%" class="h-100" value="H">
                <VImg src="@/assets/hyundai-logo.webp" width="160" />
            </VBtn>
            <VDivider vertical />
            <VBtn min-width="192" width="33.3%" class="h-100" value="K">
                <VImg src="@/assets/kia-logo.webp" width="100" />
            </VBtn>
            <VDivider vertical />
            <VBtn min-width="192" width="33.3%" class="h-100" value="GLOBAL">
                <h5 class="font-weight-black text-primary">GLOBAL</h5>
            </VBtn>
        </VBtnToggle>

        <VWindow
            :model-value="level"
            @update:model-value="emits('update:level', level)"
            class="py-5"
        >
            <VWindowItem>
                <VRow>
                    <VCol
                        cols="6"
                        sm="4"
                        v-for="(shopTypeValue, shopTypeCode) in shopTypes"
                    >
                        <VBtn
                            class="shop-type-button"
                            @click="selectShopType(shopTypeCode)"
                        >
                            <span class="text-h5">{{ shopTypeValue }}</span>
                        </VBtn>
                    </VCol>
                </VRow>
            </VWindowItem>

            <VWindowItem>
                <VRow>
                    <VSkeletonLoader
                        v-if="loading"
                        type="heading, divider, text@2, heading, divider, text@5"
                        class="w-100"
                    />
                    <template v-else>
                        <VFadeTransition hide-on-leave>
                            <template v-if="shops?.[shopType]?.[company]">
                                <template
                                    v-for="(locations, locationName) in shops[
                                        shopType
                                    ][company]"
                                >
                                    <VCol cols="12" md="4">
                                        <ContentSubheader dividerClass="mb-0">
                                            {{ locationName }}
                                        </ContentSubheader>

                                        <VList>
                                            <VListItem
                                                v-for="shop in locations"
                                                :key="shop.shop_cd"
                                                :value="shop"
                                                :active="
                                                    userStore.shop?.shop_cd ===
                                                    shop.shop_cd
                                                "
                                                :append-icon="
                                                    checkCurrentShop(shop)
                                                        ? 'mdi-map-marker'
                                                        : null
                                                "
                                                :disabled="checkDisabled(shop)"
                                                color="primary"
                                                rounded="lg"
                                                @click="selectShop(shop)"
                                            >
                                                <template
                                                    v-if="multiple"
                                                    #prepend
                                                >
                                                    <VListItemAction start>
                                                        <VCheckboxBtn
                                                            :model-value="
                                                                selected
                                                            "
                                                            @update:model-value="
                                                                emits(
                                                                    'update:selected',
                                                                    $event
                                                                )
                                                            "
                                                            :id="`checkbox-${shop.shop_cd}`"
                                                            :value="shop"
                                                            @click.stop
                                                        />
                                                    </VListItemAction>
                                                </template>

                                                {{ shop.line_nm }}
                                            </VListItem>
                                        </VList>
                                    </VCol>
                                </template>
                            </template>

                            <template v-else>
                                <VCol cols="12">
                                    <div
                                        class="d-flex ga-2 justify-center align-center h-100 w-100 py-4"
                                    >
                                        <VIcon
                                            icon="mdi-car-off"
                                            size="large"
                                        />
                                        <h6>
                                            <!-- 활성화 된 공장이 없습니다 -->
                                            {{
                                                commonCode(
                                                    "MESSAGE",
                                                    "MSGI000160"
                                                )
                                            }}
                                        </h6>
                                    </div>
                                </VCol>
                            </template>
                        </VFadeTransition>
                    </template>
                </VRow>
            </VWindowItem>
        </VWindow>
    </div>
</template>

<script setup>
import { commonCode, commonCodeGroup } from "@/utils/code";
import ContentSubheader from "./ContentSubheader.vue";
import { shopHierarchyRetrive } from "@/api/common";
import { useUser } from "@/stores/userStore";
import { ref } from "vue";

const props = defineProps({
    shopType: {
        type: String,
        require: true,
        validator: (v) => !!commonCodeGroup("RMS000003")?.[v],
    },
    level: {
        type: Number,
        default: 0,
    },
    selected: {
        type: Array,
        default: [],
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    disabledShops: {
        type: Array,
        default: [],
    },
    activeShops: {
        type: Array,
        default: [],
    },
});

const emits = defineEmits([
    "update:shopType",
    "update:level",
    "update:selected",
    "selectShop",
]);

const shops = ref({});
const company = ref("H");
const loading = ref(false);

const userStore = useUser();

const selectShopType = async (shopTypeCode) => {
    try {
        loading.value = true;
        emits("update:shopType", shopTypeCode);
        moveLevel(1);

        if (!shops.value[shopTypeCode]) {
            shops.value[shopTypeCode] = await shopHierarchyRetrive(
                userStore.userSetInfo.user_id,
                shopTypeCode
            );
        }
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000048"), "error"); // 공장 정보를 불러오지 못했습니다
    } finally {
        loading.value = false;
    }
};

const moveLevel = (newLevel) => {
    emits("update:level", newLevel);
};

const shopTypes = commonCodeGroup("RMS000003");

const clickForwarding = (id) => {
    const checkbox = document.getElementById(`checkbox-${id}`);
    checkbox.click();
};

const selectShop = (shop) => {
    if (props.multiple) {
        clickForwarding(shop.shop_cd);
    } else {
        emits("update:selected", [shop]);
    }
    emits("selectShop", shop);
};

const checkDisabled = (shop) => {
    // disabled 우선
    if (
        props.disabledShops.length > 0 &&
        props.disabledShops.includes(shop.shop_cd)
    )
        return true;

    if (
        props.activeShops.length > 0 &&
        !props.activeShops.includes(shop.shop_cd)
    )
        return true;

    if (checkCurrentShop(shop)) return true;

    return false;
};

const checkCurrentShop = (shop) => userStore.shop?.shop_cd === shop.shop_cd;
</script>

<style scoped>
.shop-type-button {
    width: 100%;
    height: 140px;
}
</style>
