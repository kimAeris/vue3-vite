import { useUser } from "@/stores/userStore";
import { commonCode } from "./code";
import { useMenu } from "@/stores/menuStore";

// 스토어 정보 파괴 (로그아웃 등)
export const resetUserAndMenuStores = () => {
    const userStore = useUser();
    const menuStore = useMenu();

    userStore.accessToken = null;
    userStore.user = {};
    userStore.shop = {};
    menuStore.menus = [];
    menuStore.mainMenu = {};
    menuStore.currentPage = {};

    localStorage.removeItem("lastAction");
};

export const getLocaleCode = () => {
    // 1순위 스토어
    const userStore = useUser();
    if (userStore.user.lang_cd) return userStore.user.lang_cd.toLowerCase();

    // 2순위 저장 된 스토어
    const savedLocale = JSON.parse(localStorage.getItem("user"))?.user?.lang_cd;
    if (savedLocale) return savedLocale.toLowerCase();

    // 3순위 브라우저 언어
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (!(browserLanguage === "ko" || browserLanguage === "ko-KR")) {
        return "en";
    } else {
        // 한국어를 기본으로 두기 위함
        return "ko";
    }
};

// 기능 코드에 따른 권한 제어
export const buttonValidate = (buttonMethods, auth) => {
    let validate = true;

    if (!Array.isArray(buttonMethods)) {
        return false;
    }

    const {
        sav_auth_yn,
        del_auth_yn,
        mdfy_auth_yn,
        dnl_auth_yn,
        upld_auth_yn,
        excl_auth_yn,
        iq_auth_yn,
        oput_auth_yn,
    } = auth;

    buttonMethods.forEach((method) => {
        switch (method) {
            case import.meta.env.VITE_BUTTON_TYPE_CREATE:
                if (sav_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_DELETE:
                if (del_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_UPDATE:
                if (mdfy_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_DOWNLOAD:
                if (dnl_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_UPLOAD:
                if (upld_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_EXCEL:
                if (excl_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_VIEW:
                if (iq_auth_yn !== "Y") {
                    validate = false;
                }
                break;
            case import.meta.env.VITE_BUTTON_TYPE_OUTPUT:
                if (oput_auth_yn !== "Y") {
                    validate = false;
                }
                break;
        }
    });
    return validate;
};

// 타입을 받아 아이콘 이름으로 변환시켜주는 함수
export const getFeedbackIcon = (type) => {
    let icon;
    switch (type) {
        case "primary":
        case "success":
            icon = "mdi-check-circle";
            break;
        case "warning":
            icon = "mdi-alert";
            break;
        case "error":
            icon = "mdi-close-circle";
            break;
        default:
            icon = "mdi-information-outline";
            break;
    }
    return icon;
};

export const getStatusColor = (status) => {
    let color;
    switch (status) {
        case import.meta.env.VITE_STATUS_SUCCESS:
            color = "success";
            break;
        case import.meta.env.VITE_STATUS_WARNING:
            color = "warning";
            break;
        case import.meta.env.VITE_STATUS_ERROR:
            color = "error";
            break;
        case import.meta.env.VITE_STATUS_SECONDARY:
            color = "secondary";
            break;
        default:
            color = "onSurfaceVariant";
            break;
    }
    return color;
};

// A와 B 차집합
export const difference = (arrA, arrB, arrAId, arrBId) =>
    arrA.filter(
        (a) =>
            !arrB.find((b) => {
                let valueA;
                let valueB;

                if (arrAId) {
                    if (typeof a[arrAId] === "object") {
                        valueA = a[arrAId].value;
                    } else {
                        valueA = a[arrAId];
                    }
                } else {
                    valueA = a;
                }

                if (arrBId) {
                    if (typeof b[arrBId] === "object") {
                        valueB = b[arrBId].value;
                    } else {
                        valueB = b[arrBId];
                    }
                } else if (arrAId) {
                    if (typeof b[arrAId] === "object") {
                        valueB = b[arrAId].value;
                    } else {
                        valueB = b[arrAId];
                    }
                } else {
                    valueB = b;
                }

                return valueA === valueB;
            })
    );

// A와 B의 교집합
export const intersection = (arrA, arrB, arrAId, arrBId) =>
    arrA.filter((a) =>
        arrB.find((b) => {
            let valueA;
            let valueB;

            if (arrAId) {
                if (typeof a[arrAId] === "object") {
                    valueA = a[arrAId].value;
                } else {
                    valueA = a[arrAId];
                }
            } else {
                valueA = a;
            }

            if (arrBId) {
                if (typeof b[arrBId] === "object") {
                    valueB = b[arrBId].value;
                } else {
                    valueB = b[arrBId];
                }
            } else if (arrAId) {
                if (typeof b[arrAId] === "object") {
                    valueB = b[arrAId].value;
                } else {
                    valueB = b[arrAId];
                }
            } else {
                valueB = b;
            }

            return valueA === valueB;
        })
    );

// JWT 파싱
export const parseJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
};

// 에러여부 체크
export const isFailed = (res) => {
    let result = false;
    if (res.status < 200 && res.status > 299) result = true;
    if (res.data?.returnCode > 0) result = true;
    return result;
};

// 인디게이터 출력용 상태값 데이터
export const getStatus = (value) => {
    let result;

    switch (value?.toUpperCase()) {
        case "R":
            result = {
                status: import.meta.env.VITE_STATUS_WARNING,
                text: commonCode("RMS000031", "R"), //"요청"
                value,
            };
            break;
        case "D":
            result = {
                status: import.meta.env.VITE_STATUS_ERROR,
                text: commonCode("RMS000031", "D"), // 반려
                value,
            };
            break;
        case "A":
            result = {
                status: import.meta.env.VITE_STATUS_SUCCESS,
                text: commonCode("RMS000031", "A"), // 승인
                value,
            };
            break;
        case "C":
            result = {
                status: import.meta.env.VITE_STATUS_NONE,
                text: commonCode("RMS000031", "C"), // 회수
                value,
            };
            break;
        case "G":
            result = {
                status: import.meta.env.VITE_STATUS_SUCCESS,
                text: commonCode("RMS000031", "G"), // 부여
                value,
            };
            break;
        default:
            result = {
                status: import.meta.env.VITE_STATUS_NONE,
                text: commonCode("RMS000020", "LB000229"), // "확인
                value,
            };
            break;
    }
    return result;
};

export const ynStatus = (value, yText, nText) => {
    let result;

    switch (value?.toUpperCase()) {
        case "Y":
            result = {
                status: import.meta.env.VITE_STATUS_SUCCESS,
                text: yText,
                value,
            };
            break;
        case "N":
            result = {
                status: import.meta.env.VITE_STATUS_ERROR,
                text: nText,
                value,
            };
            break;
    }
    return result;
};

export const parseSelectList = (
    data,
    title,
    value,
    titleKey = "title",
    valueKey = "value"
) => {
    const resultList = data.filter(
        (obj, index, self) =>
            index === self.findIndex((item) => item[value] === obj[value])
    );

    return [
        {
            [titleKey]: commonCode("RMS000020", "LB000006"),
            [valueKey]: null,
        },
        ...resultList.map((item) => ({
            [titleKey]: item[title],
            [valueKey]: item[value],
        })),
    ];
};

export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

export const formatNumber = (number) => {
    const parseNumber = Number(number);
    if (Number.isNaN(parseNumber)) return number;

    return parseNumber.toLocaleString();
};
