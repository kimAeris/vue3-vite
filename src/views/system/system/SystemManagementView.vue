<template>
    <TheContentHeader
        v-model:filters="filters"
        :buttons="contentHeaderButtons"
        :custom-search-function="setData"
        :custom-refresh-function="refresh"
    />
    <ContainerSheet>
        <DataTable />
    </ContainerSheet>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DataTable from "@/components/DataTable.vue";
import { useToast } from "@/stores/toastStore";
import { useDataTable } from "@/stores/dataTableStore";
import { usePageCodes } from "@/stores/pageCodesStore";
import { storeToRefs } from "pinia";
import { useFeedback } from "@/stores/feedbackStore";
import {
    sysMgmtRetrive,
    sysMgmtCreate,
    sysMgmtUpdate,
    sysMgmtDelete,
    systemManagerRetrive,
    hierarchyGroupRetrive,
    getTimeZoneList,
} from "@/api/system/system";
import { dateFormatting } from "@/utils/days";
import { useUser } from "@/stores/userStore";
import { commonCode, commonCodeGroup } from "@/utils/code";

///////////////////////// 페이지 공통 /////////////////////////
const userStore = useUser();
const { userSetInfo } = storeToRefs(userStore);

// 공통코드 스토어
const pageCodesStore = usePageCodes();
const { codes } = storeToRefs(pageCodesStore);

const com_cd_id = {
    line_cd: "RMS000002",
    shop_tcd: "RMS000003",
    country_cd: "RMS000008",
    sub_loc_cd: "RMS000006",
    loc_cd: "RMS000018",
    company_cd: "RMS000007",
};

const setCodes = async () => {
    let newCodes = {};
    for (const col in com_cd_id) {
        const codeGroup = commonCodeGroup(com_cd_id[col]);

        newCodes[col] = Object.keys(codeGroup).map((item) => ({
            com_cd: item,
            code_nm: codeGroup[item],
        }));
    }

    const systemManagers = await systemManagerRetrive(
        userSetInfo.value.lang_cd
    );

    newCodes.sys_admin_id = systemManagers.map((user) => ({
        com_cd: user.emp_no,
        code_nm: `${user.name} (${user.emp_no})`,
    }));

    const timezone = await getTimeZoneList();
    newCodes.time_zone = timezone.map((item) => ({
        countryCd: item.countryCd,
        com_cd: item.name,
        code_nm: item.name,
    }));

    codes.value = newCodes;
};

let hierarchyGroupCodes = null;

const setHierarchyGroup = async () => {
    const hierarchyGroups = await hierarchyGroupRetrive(
        userSetInfo.value.lang_cd
    );

    hierarchyGroupCodes = hierarchyGroups.map((hg) => hierarchyGroupMap(hg));
};

const hierarchyGroupMap = (hierarchyGroup) => {
    const item = {
        com_cd: hierarchyGroup.comCd,
        code_nm: hierarchyGroup.codeNm,
    };

    if (hierarchyGroup.children) {
        item.children = hierarchyGroup.children.map((hg) =>
            hierarchyGroupMap(hg)
        );
    }

    return item;
};

///////////////////////// 테이블 /////////////////////////
const dataTableStore = useDataTable();

// 테이블 필요 스테이트
const {
    items,
    headers,
    loading,
    keyColumn,
    addedItems,
    selected,
    fetchApi,
    updateApi,
    createApi,
    deleteApi,
    userParams,
} = storeToRefs(dataTableStore);

// 파라미터에 필요한 유저 정보
userParams.value = userSetInfo.value;

// 메시지 출력 용 토스트
const { newToast } = useToast();

// 스토어 리셋
dataTableStore.resetDataTableStores();

const timeZoneList = ref(null);

// 행
const columns = {
    // 표시 컬럼
    shop_cd: {
        type: "key",
        text: null,
        value: null,
    },
    shop_tcd: {
        type: "autocomplete",
        value: null,
    },
    company_cd: {
        type: "relationSelect",
        value: null,
    },
    country_cd: {
        type: "relationSelect",
        value: null,
    },
    loc_cd: {
        type: "relationSelect",
        value: null,
    },
    line_cd: {
        type: "relationSelect",
        value: null,
    },
    time_zone: {
        type: "select",
        value: null,
    },
    start_dt: {
        type: "date",
        value: null,
    },
    batch_hour: {
        type: "time",
        value: null,
    },
    sys_nm: null,
    use_yn: {
        type: "switch",
        value: "N",
    },
    sys_admin_id: {
        type: "autocomplete",
        value: null,
    },
    shift_cd: {
        type: "number",
        value: null,
    },
    dept_nm: null,
    reg_dt: null,
    reg_user_nm: null,
    modi_dt: null,
    modi_user_nm: null,

    // 미표시 컬럼
    reg_user_id: null,
    modi_user_id: null,
    vehl_dsp_cd: null,
    sys_admin_nm: null,
    dept_eng_nm: null,
    org_cd: null,

    // 공통코드 그룹
    line_cd_id: com_cd_id.line_cd,
    shop_tcd_id: com_cd_id.shop_tcd,
    country_cd_id: com_cd_id.country_cd,
    sub_loc_cd_id: com_cd_id.sub_loc_cd,
    loc_cd_id: com_cd_id.loc_cd,
};

// 헤더 명칭
const headerTitles = [
    commonCode("RMSG000001", "RMS000001"), // 샵코드
    commonCode("RMSG000001", "RMS000003"), // 샵유형코드
    commonCode("RMSG000001", "RMS000007"), // 회사코드
    commonCode("RMSG000001", "RMS000008"), // 국가코드
    commonCode("RMSG000001", "RMS000006"), // 지역코드
    commonCode("RMSG000001", "RMS000002"), // 라인코드
    commonCode("RMS000020", "LB000439"), // 타임존
    commonCode("RMS000020", "LB000039"), // 시작일자
    commonCode("RMS000020", "LB000440"), // 일지 생성 시간
    commonCode("RMS000020", "LB000185"), // 시스템명
    commonCode("RMS000020", "LB000085"), // 사용여부
    commonCode("RMS000020", "LB000186"), // 시스템담당
    commonCode("RMS000020", "LB000017"), // 교대
    commonCode("RMS000020", "LB000187"), // 등록부서
    commonCode("RMS000020", "LB000059"), // 등록일시
    commonCode("RMS000020", "LB000058"), // 등록자
    commonCode("RMS000020", "LB000061"), // 수정일시
    commonCode("RMS000020", "LB000060"), // 수정자
];

// 헤더
headers.value = dataTableStore.parseColumnHeaders(headerTitles, columns);

///////////////////////// 컨텐츠헤더 정의 /////////////////////////
// 컨텐트헤더 하단 검색필터
let filters = ref([
    {
        key: "shop_cd",
        type: "text",
        name: commonCode("RMSG000001", "RMS000001"), // 샵코드
        value: null,
    },
    {
        key: "shop_tcd",
        type: "autocomplete",
        name: commonCode("RMSG000001", "RMS000003"), // 샵유형코드
        value: null,
    },
    {
        key: "line_cd",
        type: "autocomplete",
        name: commonCode("RMS000020", "LB000029"), // 라인
        value: null,
    },
    {
        key: "sys_nm",
        type: "text",
        name: commonCode("RMS000020", "LB000185"), // 시스템명
        value: null,
    },
    {
        key: "use_yn",
        type: "select",
        name: commonCode("RMS000020", "LB000085"), // 사용여부
        value: null,
        selectList: [
            {
                code_nm: commonCode("RMS000020", "LB000090"), // 사용
                com_cd: "Y",
            },
            {
                code_nm: commonCode("RMS000020", "LB000091"), // 미사용
                com_cd: "N",
            },
        ],
    },
    {
        key: "sys_admin_id",
        type: "text",
        name: commonCode("RMS000020", "LB000186"), // 시스템담당
        value: null,
    },
    {
        key: "org_cd",
        type: "text",
        name: commonCode("RMS000020", "LB000187"), // 등록부서
        value: null,
    },
    {
        key: "reg_user_nm",
        type: "text",
        name: commonCode("RMS000020", "LB000058"), // 등록자
        value: null,
    },
    {
        key: "reg_dt",
        type: "date",
        name: commonCode("RMS000020", "LB000059"), // 등록일시
        value: null,
    },
]);

const searchParams = computed(() => {
    const params = {};
    filters.value.forEach((filter) => {
        if (filter?.value) {
            params[filter.key] = filter.value;
        }
    });
    return params;
});

// 서버사이드 처리를 위한 필터 초기화 시 리페칭
let originFilters = JSON.parse(JSON.stringify(filters.value));

const refresh = () => {
    filters.value = JSON.parse(JSON.stringify(originFilters));
    setData();
};

///////////////////////// 페칭 /////////////////////////
// 데이터
const fetchData = async () => {
    try {
        loading.value = true;

        items.value = [];

        // 테이블
        const data = await sysMgmtRetrive({
            lang_cd: userSetInfo.value.lang_cd,
            shop_cd: searchParams.value.shop_cd,
            shop_tcd: searchParams.value.shop_tcd,
            line_cd: searchParams.value.line_cd,
            sys_nm: searchParams.value.sys_nm,
            use_yn: searchParams.value.use_yn,
            sys_admin_id: searchParams.value.sys_admin_id,
            dept_nm: searchParams.value.org_cd,
            reg_user_nm: searchParams.value.reg_user_nm,
            reg_dt: searchParams.value.reg_dt,
        });

        const parsedData = data.map((item) => ({
            ...columns,
            ...item,

            sort_no: {
                type: "number",
                value: item.sort_no,
            },
            shop_cd: {
                type: "key",
                text: item.shop_cd,
                value: item.shop_cd,
            },
            shop_tcd: {
                type: "code",
                value: item.shop_tcd,
            },
            line_cd: {
                type: "code",
                value: item.line_cd,
            },
            time_zone: {
                type: "select",
                value: item.time_zone,
                selectList: codes.value.time_zone.filter(
                    (code) => code.com_cd === item.time_zone
                ),
            },
            start_dt: {
                type: "date",
                value: dateFormatting(item.start_dt),
            },
            batch_hour: {
                type: "time",
                value: item.batch_hour ? `${item.batch_hour}:00` : null,
            },
            sub_loc_cd: {
                type: "code",
                value: item.sub_loc_cd,
            },
            loc_cd: {
                type: "code",
                value: item.loc_cd,
            },
            use_yn: {
                type: "switch",
                value: item.use_yn?.toUpperCase() || "N",
            },
            sys_admin_id: {
                type: "autocomplete",
                value: item.sys_admin_id,
            },
            country_cd: {
                type: "code",
                value: item.country_cd,
            },
            company_cd: {
                type: "code",
                value: item.company_cd,
            },
            reg_dt: dateFormatting(item.reg_dt),
            modi_dt: dateFormatting(item.modi_dt),
        }));

        return parsedData;
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        newToast(commonCode("MESSAGE", "MSG000014"), "error"); // 데이터를 불러오지 못했습니다
    } finally {
        loading.value = false;
    }
};

const setData = async () => {
    items.value = await fetchData();
};

onMounted(async () => {
    await setCodes();
    await setData();
    await setHierarchyGroup();
});

// 키, API
keyColumn.value = "shop_cd";
fetchApi.value = setData;
createApi.value = sysMgmtCreate;
updateApi.value = sysMgmtUpdate;
deleteApi.value = sysMgmtDelete;

// 버튼별 핸들러
const { addHandler, saveHandler, deleteHandler } = dataTableStore;

const addCustomHandler = () => {
    addHandler(columns);
    items.value[items.value.length - 1].company_cd.handler =
        relationSelectHandler;
    items.value[items.value.length - 1].country_cd.handler =
        relationSelectHandler;
    items.value[items.value.length - 1].loc_cd.handler = relationSelectHandler;
    items.value[items.value.length - 1].line_cd.handler = relationSelectHandler;
};

const relationSelectHandler = (rowItem, key) => {
    const keys = Object.keys(rowItem);
    const index = keys.indexOf(key);
    const target = keys.find(
        (v, i) => rowItem[v]?.type === "relationSelect" && i > index
    );

    if (target == null) {
        return;
    }

    const targetItem = rowItem[target];

    if (key === "company_cd") {
        targetItem.selectList = hierarchyGroupCodes.find(
            (hg) => hg.com_cd === rowItem[key].value
        ).children;
    } else {
        targetItem.selectList = rowItem[key].selectList.find(
            (s) => s.com_cd === rowItem[key].value
        ).children;
    }

    // 타임존
    if (key === "country_cd") {
        rowItem.time_zone.selectList = codes.value.time_zone.filter(
            (item) => item.countryCd === rowItem.country_cd.value
        );
        rowItem.time_zone.value = null;
    }

    targetItem.value = null;
};

// 피드백 팝업
const feedback = useFeedback();

const systemSaveHandler = async () => {
    if (addedItems.value.length === 0 && selected.value.length === 0) {
        return {
            msg: commonCode("MESSG000036"), // 변경 사항이 없습니다
            type: "warning",
        };
    }

    let saveConfirm = true;

    if (addedItems.value.length > 0) {
        addedItems.value.forEach((item) => {
            item.batch_hour.value = item.batch_hour.value
                .match(/\d+/g)[0]
                .replace(/^0+/, "");
        });

        saveConfirm = await feedback.openFeedback(
            "success",
            commonCode("MESSAGE", "MSG000084"), // 시스템 추가
            commonCode("MESSAGE", "MSG000085"), // 새로운 시스템을 추가하시겠습니까?
            commonCode("RMS000020", "LB000120"), // 취소
            {
                text: commonCode("RMS000020", "LB000137"), // 확인
                type: "success",
            }
        );
    }

    selected.value.forEach((item) => {
        item.batch_hour.value = item.batch_hour?.value
            .match(/\d+/g)[0]
            .replace(/^0+/, "");
    });

    if (saveConfirm) return saveHandler();
};

const systemDeleteHandler = async () => {
    if (selected.value.length === 0) {
        return {
            msg: commonCode("MESSAGE", "MSG000105"), // 값을 선택해주세요
            type: "warning",
        };
    }

    const deleteConfirm = await feedback.openFeedback(
        "error",
        commonCode("RMS000020", "LB000261"), //시스템 삭제
        commonCode("MESSAGE", "MSG000086"), // 시스템 삭제 시 연관 데이터를 불러오지 못할 수 있습니다. 삭제하시겠습니까?
        commonCode("RMS000020", "LB000120"), // 취소
        {
            text: commonCode("RMS000020", "LB000075"), // 삭제
            type: "error",
        }
    );

    if (deleteConfirm) return deleteHandler();
};

// 컨텐트헤더 우상단 버튼
const contentHeaderButtons = [
    {
        text: commonCode("RMS000020", "LB000074"), // 추가,
        handler: addCustomHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_CREATE],
    },
    {
        text: commonCode("RMS000020", "LB000075"), // 삭제
        type: "error",
        handler: systemDeleteHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_DELETE],
    },
    {
        text: commonCode("RMS000020", "LB000076"), // 저장
        type: "primary",
        handler: systemSaveHandler,
        method: [import.meta.env.VITE_BUTTON_TYPE_UPDATE],
    },
];
</script>
