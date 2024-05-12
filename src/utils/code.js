import { bodyLastUpdate, getBdSysCode } from "@/api/bd/bdCommon";
import { getSysCode, getSysModify } from "@/api/common";
import { useToast } from "@/stores/toastStore";

const COMMON_CODES_KEY = "commonCodes";
const BODY_CODES_KEY = "bdCommonCodes";

const DEFAULT_NOT_FOUND_MESSAGE = "Code not found.";
const NO_CODE_PARAM = "No code entered.";

const popErrorMessage = () => {
    let message = commonCode("MESSAGE", "MSG000035");
    if (!message) message = DEFAULT_NOT_FOUND_MESSAGE;

    const { newToast } = useToast();
    newToast(message, "error");
};

// 코드 가져올지 판단
export const checkFetchNecessity = async (languageCode) => {
    try {
        // 제일 최근 업데이트 시간을 가져옴
        const lastDate = { last_update: "2024-05-10 09:36:46" }; //await getSysModify(languageCode);

        const savedCodeData = localStorage.getItem(COMMON_CODES_KEY);
        const parsedCodeData = JSON.parse(savedCodeData);

        return (
            !parsedCodeData ||
            parsedCodeData.languageCode !== languageCode ||
            lastDate.last_update !== parsedCodeData?.lastUpdate
        );
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        popErrorMessage();
    }
};

// 코드 가져옴
export const getCommonCodes = async (languageCode) => {
    try {
        // const codeData = await getSysCode(languageCode);
        // 공통코드 목록 가져옴
        const codeData = {
            returnCode: "Success",
            last_update: "2024-05-10 09:36:46",
            sysData: {
                RMS000000: {
                    RMS000001: "샵코드",
                    RMS000002: "라인코드",
                    RMS000003: "샵유형코드",
                    RMS000004: "공장코드",
                    RMS000005: "법인코드",
                    RMS000006: "지역코드",
                    RMS000007: "회사코드",
                    RMS000008: "국가코드",
                    RMS000009: "프로그램구분",
                    RMS000010: "공정",
                    RMS000011: "세부공정",
                    RMS000012: "점검항목",
                    RMS000013: "단위",
                    RMS000014: "DPU구분코드",
                    RMS000015: "DPU점검항목코드",
                    RMS000016: "점검유형",
                    RMS000017: "메시지코드",
                    RMS000018: "지역명코드",
                    RMS000019: "청소주기유형",
                    RMS000020: "라벨",
                    RMS000021: "환경설정",
                    RMS000022: "차체공통코드타입",
                    RMS000024: "차체업무구분",
                    RMS000025: "2교대",
                    RMS000026: "3교대이상",
                    RMS000027: "L/R구분",
                    RMS000028: "차체번호 표기",
                    RMS000029: "라운드표기",
                    RMS000030: "일지주기유형",
                    RMS000031: "권한상태확인",
                    RMS000032: "공지사항구분",
                    RMS000034: "차체점검결과구분",
                    RMS000035: "시스템공지사항구분",
                    RMS000036: "일반공지사항구분",
                },
                RMS000001: {
                    HV111BD: "울산 11 차체",
                    HV112BD: "울산 12 차체",
                    HV121BD: "울산 21 차체",
                    HV121PA: "울산 21 도장",
                    HV121TR: "울산 21 의장",
                    HV122BD: "울산 22 차체",
                    HV131BD: "울산 31 차체",
                    HV131PA: "울산 31 도장",
                    HV131PR: "울산 31 프레스",
                    HV132BD: "울산 32 차체",
                    HV141TR: "울산 41 의장",
                    HV142TR: "울산 42 의장",
                    HV151BD: "울산 51 차체",
                    HV151PA: "울산 51 도장",
                    HV151TR: "울산 51 의장",
                    KV111BD: "광명 1 차체",
                    KV111PA: "광명 1 도장",
                    KV111TR: "광명 1 의장",
                    KV121BD: "광명 2 차체",
                    KV121PA: "광명 2 도장",
                    KV121TR: "광명 2 의장",
                    KV211BD: "화성 1 차체",
                    KV211PA: "화성 1 도장",
                    KV211TR: "화성 1 의장",
                    KV221BD: "화성 2 차체",
                    KV221PA: "화성 2 도장",
                    KV221TR: "화성 2 의장",
                    KV231BD: "화성 3 차체",
                    KV231PA: "화성 3 도장",
                    KV231TR: "화성 3 의장",
                    KV311BD: "광주 1 차체",
                    KV311PA: "광주 1 도장",
                    KV311TR: "광주 1 의장",
                    KV321BD: "광주 2 차체",
                    KV321PA: "광주 2 도장",
                    KV321TR: "광주 2 의장",
                },
                RMS000002: {
                    HV111: "울산11",
                    HV112: "울산12",
                    HV120: "울산2",
                    HV121: "울산21",
                    HV122: "울산22",
                    HV131: "울산3",
                    HV132: "울산32",
                    HV141: "울산41",
                    HV142: "울산42",
                    HV151: "울산51",
                    HV152: "울산52",
                    HV211: "아산",
                    HVA11: "HMMA",
                    HVD11: "HMB",
                    HVF11: "HMI1",
                    HVF12: "HMI2",
                    HVG11: "BHMC1",
                    HVG12: "BHMC2",
                    HVG31: "BHCM3",
                    HVG41: "BHCM4",
                    HVN11: "HMMC",
                    HVP11: "HAOS",
                    HVQ11: "HMMR",
                    HVR11: "HMGMA",
                    KV111: "광명1",
                    KV121: "광명2",
                    KV211: "화성1",
                    KV221: "화성2",
                    KV231: "화성3",
                    KV311: "광주1",
                    KV321: "광주2",
                    KVA11: "KaGA",
                    KVD11: "KMX",
                    KVG11: "DYK1",
                    KVG21: "DYK2",
                    KVG31: "DYK3",
                    KVM11: "KaSK",
                },
                RMS000003: {
                    PR: "프레스",
                    BD: "차체",
                    PA: "도장",
                    TR: "의장",
                    EG: "엔진",
                    TM: "변속기",
                    MA: "소재",
                },
                RMS000004: {
                    HV11: "HMC 울산 완성차1공장",
                    HV12: "HMC 울산 완성차2공장",
                    HV13: "HMC 울산 완성차3공장",
                    HV14: "HMC 울산 완성차4공장",
                    HV15: "HMC 울산 완성차5공장",
                    HV21: "HMC 아산 완성차공장",
                    HV31: "HMC 전주 완성차공장",
                    HVA1: "HMMA 완성차공장",
                    HVD1: "HMB 완성차공장",
                    HVF1: "HMI 완성차1공장",
                    HVF2: "HMI 완성차2공장",
                    HVG1: "BHMC 완성차1공장",
                    HVG2: "BHMC 완성차2공장",
                    HVG3: "BHMC 완성차3공장",
                    HVG4: "BHMC 완성차4공장",
                    HVH1: "사천트럭공장",
                    HVJ1: "베트남",
                    HVN1: "HMMC 완성차공장",
                    HVP1: "HAOS 완성차공장",
                    HVP9: "카르산(터키) 공장",
                    HVQ1: "HMMR 완성차공장",
                    HVR1: "HMGMA 완성차공장",
                    KV11: "KMC 소하 완성차1공장",
                    KV12: "KMC 소하 완성차2공장",
                    KV21: "KMC 화성 완성차1공장",
                    KV22: "KMC 화성 완성차2공장",
                    KV23: "KMC 화성 완성차3공장",
                    KV31: "KMC 광주 완성차1공장",
                    KV32: "KMC 광주 완성차2공장",
                    KV33: "KMC 광주 완성차3공장",
                    KV34: "KMC 광주 버스공장",
                    KV35: "광주완성차5공장(군수)",
                    KV41: "KMC 서산 완성차공장",
                    KVA1: "KaGA 완성차공장",
                    KVD1: "KMX 완성차공장",
                    KVF1: "KIN 완성차 공장",
                    KVG1: "KMC 중국 동풍열달공장",
                    KVG2: "KMC 중국 동풍열달공장(2)",
                    KVG3: "KMC 중국 동풍열달공장(3)",
                    KVM1: "KaSK 완성차공장",
                },
                RMS000005: {
                    H101: "현대자동차",
                    H201: "알라바마",
                    H301: "브라질",
                    H601: "북경 현대",
                    H901: "인도",
                    HA01: "체코",
                    HA08: "러시아 ",
                    HA10: "터키 ",
                    K101: "기아자동차",
                    K201: "조지아 ",
                    K601: "동풍열달기아",
                    KA01: "슬로박 ",
                    K301: "멕시코",
                    HF: "현대",
                    KF: "기아",
                },
                RMS000006: {
                    HV11: "울산1",
                    HV12: "울산2",
                    HV13: "울산3",
                    HV14: "울산4",
                    HV15: "울산5",
                    HV21: "아산",
                    HV31: "전주",
                    HVA1: "HMMA",
                    HVD1: "HMB",
                    HVF1: "HMI1",
                    HVF2: "HMI2",
                    HVG1: "BHMC1",
                    HVG2: "BHMC2",
                    HVG3: "BHCM3",
                    HVG4: "BHCM4",
                    HVH1: "사천트럭공장",
                    HVJ1: "베트남",
                    HVN1: "HMMC",
                    HVP1: "HAOS",
                    HVP9: "카르산(터키) 공장",
                    HVQ1: "HMMR",
                    HVR1: "HMGMA",
                    KV11: "소하1",
                    KV12: "소하2",
                    KV21: "화성1",
                    KV22: "화성2",
                    KV23: "화성3",
                    KV31: "광주1",
                    KV32: "광주2",
                    KV33: "광주3",
                    KV34: "광주 버스",
                    KV35: "광주5(군수)",
                    KV41: "서산",
                    KVA1: "KaGA",
                    KVD1: "KMX",
                    KVF1: "KIN",
                    KVG1: "DYK1",
                    KVG2: "DYK2",
                    KVG3: "DYK3",
                    KVM1: "KaSK",
                },
                RMS000007: {
                    H: "현대",
                    K: "기아",
                    GLOBAL: "GLOBAL",
                },
                RMS000008: {
                    KO: "대한민국",
                    CN: "중국",
                    IN: "인도",
                    ID: "인도네시아",
                    BR: "브라질",
                    CA: "캐나다",
                    CZ: "체코",
                    RU: "러시아",
                    TR: "튀르키예",
                    USA: "미국",
                },
                RMS000009: {
                    MENU: "메뉴",
                    TAB: "탭",
                },
                MESSAGE: {
                    MSG000001: "입력 값 초기화",
                    MSG000002: "점검항목의 입력 값을 초기화 하시겠습니까?",
                    MSG000003: "점검 데이터 삭제",
                    MSG000004:
                        "근무일 유형을 수정하면  현재까지 점검 한 데이터가 모두 삭제됩니다. 수정하시겠습니까?",
                    MSG000005: "데이터가 없습니다",
                    MSG000006: "이전 날짜를 수정 할 수 없습니다",
                    MSG000007: "이후 날짜는 선택 할 수 없습니다",
                    MSG000008: "로그아웃 되었습니다",
                    MSG000009: "로그아웃에 실패했습니다",
                    MSG000010: "신청할 공장을 선택해주세요",
                    MSG000011: "공장 정보를 불러오지 못했습니다",
                    MSG000012: "신청 완료되었습니다.",
                    MSG000013: "신청에 실패했습니다",
                    MSG000014: "데이터를 불러오지 못했습니다",
                    MSG000015: "업로드 권한이 없습니다",
                    MSG000016: "이미지는 4장까지 입력 가능합니다",
                    MSG000017: "삭제되었습니다",
                    MSG000018: "삭제를 실패했습니다",
                    MSG000019: "이미지가 없습니다",
                    MSG000020: "저장되었습니다",
                    MSG000021: "저장을 실패했습니다",
                    MSG000022: "입력된 값이 없습니다",
                    MSG000023: "이미지를 불러오지 못했습니다",
                    MSG000024: "변경에 실패했습니다",
                    MSG000025: "입력을 실패했습니다",
                    MSG000026: "저장 중 오류가 발생했습니다",
                    MSG000027: "초기화되었습니다",
                    MSG000028: "초기화를 실패했습니다",
                    MSG000029: "항목을 스킵했습니다",
                    MSG000030: "샵 전환에 실패했습니다",
                    MSG000031: "삭제를 취소하였습니다.",
                    MSG000032: "사용 중인 데이터는 삭제할 수 없습니다.",
                    MSG000033:
                        "삭제한 데이터는 되돌릴 수 없습니다. 삭제하시겠습니까?",
                    MSG000034: "잘못된 주소입니다",
                    MSG000035: "코드 정보를 불러오지 못했습니다",
                    MSG000036: "변경 사항이 없습니다",
                    MSG000037: "선택 된 유저가 없습니다",
                    MSG000038: "수정 권한이 없습니다",
                    MSG000039: "수정되었습니다",
                    MSG000040: "수정에 실패했습니다",
                    MSG000041: "조회에 실패했습니다",
                    MSG000042: "일지가 생성되었습니다",
                    MSG000043: "일지 생성을 실패했습니다",
                    MSG000044: "30일 이전 데이터는 변경 할 수 없습니다",
                    MSG000047: "신청할 공장을 선택해주세요",
                    MSG000048: "공장 정보를 불러오지 못했습니다",
                    MSG000049: "신청에 실패했습니다",
                    MSG000050: "ID/PW가 틀렸습니다.",
                    MSG000051: "계정 잠김",
                    MSG000052: "계정이 잠금 처리 되었습니다.",
                    MSG000053: "아이디를 입력하세요.",
                    MSG000054: "비밀번호를 입력하세요.",
                    MSG000055: "유저 정보를 불러오지 못했습니다",
                    MSG000056: "언어 변경에 실패했습니다",
                    MSG000057: "테마 변경에 실패했습니다",
                    MSG000058: "로그인에 실패했습니다",
                    MSG000059: "로그인 만료",
                    MSG000060: "로그인이 만료되었습니다",
                    MSG000061: "중복 로그인",
                    MSG000062: "다른 곳에서 로그인 되었습니다",
                    MSG000063: "권한 없음",
                    MSG000064: "접근 권한이 없습니다",
                    MSG000065: "항목추가 취소",
                    MSG000066:
                        "추가 된 항목 선택취소 시 변경 사항은 삭제됩니다.",
                    MSG000067: "로그아웃",
                    MSG000068: "로그아웃 하시겠습니까?",
                    MSG000069: "비밀번호 변경 완료",
                    MSG000070:
                        "비밀번호가 변경되었습니다. 다시 로그인해주세요.",
                    MSG000071: "입력 값 삭제",
                    MSG000072:
                        "취소 시 입력 된 정보가 삭제됩니다. 닫으시겠습니까?",
                    MSG000073: "돌아가기",
                    MSG000074: "데이터 중복",
                    MSG000075: "중복 항목을 입력할 수 없습니다",
                    MSG000076: "이미 사용 중인 항목입니다",
                    MSG000077: "항목 미입력",
                    MSG000078: "모든 항목을 입력하세요",
                    MSG000079: "점검유형을 입력하세요",
                    MSG000080: "코드 변경",
                    MSG000081: "코드를 변경하시겠습니까?",
                    MSG000082: "입력값 오류",
                    MSG000083: "의 현재고가 마이너스입니다.",
                    MSG000084: "시스템 추가",
                    MSG000085: "새로운 시스템을 추가하시겠습니까?",
                    MSG000086:
                        "시스템 삭제 시 연관 데이터를 불러오지 못할 수 있습니다. 삭제하시겠습니까?",
                    MSG000087: "비밀번호 변경 필요",
                    MSG000088:
                        "비밀번호 변경 후 180일이 지났습니다. 비밀번호를 변경하시겠습니까?",
                    MSG000089: "계정 잠금",
                    MSG000090: "비밀번호를 10회 이상 틀렸습니다",
                    MSG000091: "해제 시간",
                    MSG000092: "분실 문의",
                    MSG000093: "권한 신청이 진행중입니다",
                    MSG000094:
                        "권한이 회수/반려 되었습니다. 다시 신청하시겠습니까?",
                    MSG000095: "값을 입력하세요",
                    MSG000096: "현재 비밀번호가 올바르지 않습니다",
                    MSG000097: "새 비밀번호를 입력하세요.",
                    MSG000098: "비밀번호를 확인하세요",
                    MSG000099: "변경되었습니다",
                    MSG000100: "조건에 맞지 않는 비밀번호입니다",
                    MSG000101: "권한을 신청하시겠습니까?",
                    MSG000102: "스킵 사유를 입력하세요",
                    MSG000103:
                        "영문, 숫자, 특수문자 중 3가지 조합 8자리 이상 또는 2가지 조합 10자리 이상",
                    MSG000104: "스킵을 실패했습니다",
                    MSG000105: "값을 선택해주세요",
                    MSG000106: "SYSTEM MANAGER는 권한을 부여할 수 없습니다",
                    MSG000107: "공장을 입력하세요",
                    MSG000108: "권한을 입력하세요",
                    MSG000109: "유저 정보를 검색하세요",
                    MSG000110: "유저 정보가 없습니다",
                    MSG000111:
                        "현재 상태에서는 $replace상태로 변경할 수 없습니다",
                    MSG000112: "$replace 되었습니다",
                    MSGI000113: "다음 문장을 적어 삭제합니다",
                    MSGI000114: "일상점검한 모든데이터를 삭제합니다",
                    MSGI000115: "휴일일지를 생성하시겠습니까?",
                    MSGI000116: "텍스트를 정확히 입력하세요 ",
                    MSGI000117: "선택한 항목을 모두 스킵 하시겠습니까?",
                    MSGI000118: "선택한 항목을 모두 초기화 하시겠습니까?",
                    MSGI000119:
                        "* 점검기준 '차종별상이' 항목은 일괄 스킵이 불가능합니다.",
                    MSGI000120:
                        "계획일을 변경하시겠습니까? 계획 변경 시 지정한 날짜로 청소 항목이 추가됩니다.",
                    MSGI000121: "미완료, 예정일 건수만 표기됩니다.",
                    MSGI000122:
                        "휴무일 지정 시 데이터가 삭제됩니다. 변경하시겠습니까?",
                    MSGI000123: "필수 값을 입력해주세요.",
                    MSGI000124: "휴무일을 근무일로 변경하시겠습니까?",
                    MSGI000125:
                        "언어변경 시 새로고침 됩니다. 새로고침 시 저장되지 않은 데이터가 사라집니다. 변경하시겠습니까? ",
                    MSGI000126:
                        "등록된 아이디, 이름, 이메일을 입력해주세요. \r\n해당 이메일로 초기 패스워드를 발송해드립니다.",
                    MSGI000127: "등록한 검사결과가 없습니다",
                    MSGI000128: "해당 일자의 일지가 없습니다",
                    MSGI000129: "프리뷰 화면입니다",
                    MSGI000130:
                        "회차당 여러 개의 점검 결과 입력 가능으로 설정.",
                    MSGI000131: "기본은 회차당 1회 점검 가능.",
                    MSGI000132: "* 콤마로 구분해서 작성해주세요",
                    MSGI000133:
                        "일지별 점검횟수 설정. 예) 4회차 점검, 4로 입력",
                    MSGI000134: "제목을 입력하세요",
                    MSGI000135: "값을 선택하세요",
                    MSGI000136: "구역을 선택하세요",
                    MSGI000137: "최대 점검회차를 입력하세요",
                    MSGI000138: "주기당 횟수를 입력하세여",
                    MSGI000139: "구역을 선택해주세요",
                    MSGI000140: "차종을 선택해주세요",
                    MSGI000141: "부위를 등록해주세요",
                    MSGI000142: "부위명을 입력하세요",
                    MSGI000143:
                        "입력한 데이터는 되돌릴수 없습니다. 취소하시겠습니까?",
                    MSGI000144: "취소하였습니다",
                    MSGI000145: "저장하시면 버전이 올라갑니다.",
                    MSGI000146: "현재 버전",
                    MSGI000147: "등록된 이미지가 없습니다",
                },
            },
        };

        return new Promise((resolve) => {
            const commonCodes = {
                lastUpdate: codeData.last_update,
                languageCode,
                codes: codeData.sysData,
            };

            localStorage.setItem(COMMON_CODES_KEY, JSON.stringify(commonCodes));
            resolve();
        });
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        popErrorMessage(languageCode);
    }
};

// 코드 가져올지 판단
export const checkBodyFetchNecessity = async (languageCode) => {
    try {
        const lastDate = await bodyLastUpdate();
        const savedCodeData = localStorage.getItem(BODY_CODES_KEY);
        const parsedCodeData = JSON.parse(savedCodeData);

        return (
            !parsedCodeData ||
            parsedCodeData.languageCode !== languageCode ||
            lastDate.lastUpdate !== parsedCodeData?.lastUpdate
        );
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        popErrorMessage();
    }
};

// 코드 가져옴
export const getBodyCommonCodes = async (languageCode) => {
    try {
        const codeData = await getBdSysCode();

        return new Promise((resolve) => {
            const commonCodes = {
                lastUpdate: codeData.lastUpdate,
                languageCode,
                codes: codeData.list,
            };

            localStorage.setItem(BODY_CODES_KEY, JSON.stringify(commonCodes));
            resolve();
        });
    } catch (error) {
        if (import.meta.env.DEV) console.error(error);
        popErrorMessage(languageCode);
    }
};

// 단일 코드 리턴
export const commonCode = (
    group,
    code,
    replaceWord,
    key = COMMON_CODES_KEY
) => {
    if (!group || !code) {
        if (import.meta.env.DEV)
            console.warn(`${NO_CODE_PARAM} (group: ${group} / code: ${code})`);
        return;
    }

    const savedCodeData = localStorage.getItem(key);
    const parsedCodeData = JSON.parse(savedCodeData);

    let codeName = parsedCodeData.codes[group][code];
    if (!codeName) {
        console.error(`${DEFAULT_NOT_FOUND_MESSAGE} (${group} / ${code})`);
        return codeName;
    }

    if (replaceWord) {
        codeName = codeName.replace("$replace", replaceWord);
    }

    return codeName;
};

export const bodyCommonCode = (group, code, replaceWord) =>
    commonCode(group, code, replaceWord, BODY_CODES_KEY)?.name;

// 코드 그룹 리턴
export const commonCodeGroup = (group, key = COMMON_CODES_KEY) => {
    if (!group) {
        if (import.meta.env.DEV) console.warn(`${NO_CODE_PARAM} (${group})`);
        return;
    }

    const savedCodeData = localStorage.getItem(key);
    const parsedCodeData = JSON.parse(savedCodeData);
    let codeGroup = parsedCodeData.codes[group];
    if (!codeGroup) {
        if (import.meta.env.DEV)
            console.error(`${DEFAULT_NOT_FOUND_MESSAGE} (${group})`);
        return [];
    }

    return codeGroup;
};

export const bodyCommonCodeGroup = (group) => {
    const bodyCodeGroup = commonCodeGroup(group, BODY_CODES_KEY);

    for (const key in bodyCodeGroup) {
        const value = bodyCodeGroup[key];
        if (value.useYn === "N") {
            delete bodyCodeGroup[key];
        } else {
            bodyCodeGroup[key] = value.name;
        }
    }

    return bodyCodeGroup;
};
