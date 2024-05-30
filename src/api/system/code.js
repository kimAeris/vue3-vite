import { getStatus, isFailed } from "@/utils/common";
import { system } from "..";

////////////////////////// 공통코드목록조회 Y만 //////////////////////////
export const childCodeRetrive = async (user, param) => {
    try {
        const data = {
            ...user,
            com_cd_id: param,
            use_yn: "Y",
        };

        const res = await system.post("/childCodeRetrive", data);
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

////////////////////////// 공통코드목록조회 전체 //////////////////////////
export const allChildCodeRetrive = async (user, param) => {
    try {
        const data = {
            ...user,
            com_cd_id: param,
        };

        const res = await system.post("/childCodeRetrive", data);
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

////////////////////////// 공통코드관리 //////////////////////////
export const commCodeRetrive = async (user) => {
    try {
        const res = await system.post("/commCodeRetrive", user);
        if (isFailed(res)) throw res;

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const retriveSupiCodeGroup = async (user) => {
    try {
        const res = await system.post("/retriveSupiCodeGroup", user);
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const commCodeCreate = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/commCodeCreate", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const commCodeUpdate = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/commCodeUpdate", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const commCodeDelete = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/commCodeDelete", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

////////////////////////// 메시지관리 //////////////////////////
export const msgMgmtRetrive = async (
    language,
    messageTypeCode,
    messageCode,
    message
) => {
    try {
        const res = await system.get("/msgMgmtRetrive", {
            params: {
                lang_cd: language,
                msg_tcd: messageTypeCode,
                msg_cd: messageCode,
                msg: message,
            },
        });
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const msgMgmtCreate = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/msgMgmtCreate", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const msgMgmtUpdate = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/msgMgmtUpdate", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const msgMgmtDelete = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/msgMgmtDelete", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

////////////////////////// 요청이력 //////////////////////////
export const commCdReqRetrive = async (user) => {
    try {
        const res = await system.post("/commCdReqRetrive", user);
        if (isFailed(res)) throw res;

        return res.data.data[0].dataList.map((item) => ({
            ...item,
            prog_cd: {
                type: "indicator",
                ...getStatus(item.prog_cd),
            },
        }));
    } catch (error) {
        throw error;
    }
};

export const commCdReqCreate = async (dataList) => {
    try {
        // TODO: 필요여부 체크
        // const data = {
        //     ...user,
        //     dataList,
        // };
        // const res = await system.post("/commCdReqCreate", data);
        // if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const commCdReqUpdate = async (user, dataList) => {
    try {
        const data = {
            ...user,
            dataList,
        };
        const res = await system.post("/commCdReqUpdate", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};
