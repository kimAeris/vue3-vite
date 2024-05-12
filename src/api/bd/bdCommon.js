import { isFailed } from "@/utils/common";
import { bdBdm, bdCommon } from "../index";

export const getBdSysCode = async () => {
    try {
        const res = await bdBdm.get("/cc/status/0");
        if (isFailed(res)) throw res;

        return res.data.body;
    } catch (error) {
        throw error;
    }
};

export const bodyLastUpdate = async () => {
    try {
        const res = await bdBdm.get("/cc/lastUpdate");
        if (isFailed(res)) throw res;

        return res.data.body;
    } catch (error) {
        throw error;
    }
};

// '업무명' 필터
export const getWorkNameFilter = async () => {
    try {
        const res = await bdBdm.get("/fault/filter");
        if (isFailed(res)) throw res;

        return res.data.body.filterList;
    } catch (error) {
        throw error;
    }
};

export const bodyDownload = async (fileName) => {
    try {
        const res = await bdCommon.get("/file/download", {
            params: { fileName: fileName },
            responseType: "blob",
        });
        if (isFailed(res)) throw res;

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const bodyUpload = async (data) => {
    try {
        const res = await bdCommon.post("/file/upload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (isFailed(res)) throw res;

        return res.data.body.path;
    } catch (error) {
        throw error;
    }
};
