import { isFailed } from "@/utils/common";
import { common } from ".";

export const login = async (user_id, pwd_enc) => {
    try {
        const res = await common.post("/login", { user_id, pwd_enc });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getRefreshToken = async (user_id, pwd_enc) => {
    try {
        // const res = await common.post("/login/success", { user_id, pwd_enc });
        const res = {
            returnCode: 0,
            datetime: "2024/05/12일 20:06:12",
            returnMessage: "Success",
            grantType: "Bearer",
        };
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const logout = async (user_id) => {
    try {
        const res = await common.post("/logout", { user_id });
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const res = await common.post("/refreshToken");

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const changePwd = async (
    userId,
    password,
    newPassword,
    newPasswordConfirm
) => {
    try {
        const res = await common.post("/user/changePwd", {
            user_id: userId,
            pwd_enc: password,
            chg_pwd: newPassword,
            chg_pwd_confirm: newPasswordConfirm,
        });

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const changePwdNext = async (userId) => {
    try {
        const res = await common.post("/user/changePwd/next", {
            user_id: userId,
        });

        return res.data;
    } catch (error) {
        throw error;
    }
};

// 유저정보
export const getUserInfo = async () => {
    try {
        // 백엔드 문제로 빈 페이로드 {} 넘겨줘야함
        //const res = //await common.post("/getUserInfo", {});
        //if (isFailed(res)) throw res;

        // return res.data.data;

        return {
            user_id: "dev5",
            pwd_enc: null,
            company_cd: null,
            company_nm: null,
            dept_cd: "admin",
            dept_nm: null,
            dept_eng_nm: null,
            pos_cd: "#1",
            pos_nm: "관리자",
            fact_cd: null,
            emp_no: "dev5",
            name: "관리자",
            name_en: null,
            retire_yn: "N",
            theme: "light",
            lang_cd: "KO",
            shop_cd: null,
            init_yn: null,
            expire_dt: null,
            expire_day: null,
            last_login_dt: null,
            last_pwd_chg_dt: null,
            lock_yn: null,
            chg_pwd: null,
            chg_pwd_confirm: null,
            login_yn: null,
            pwd_lock_dt: null,
            auto_chg_yn: null,
            role: [
                {
                    role_id: "ROL000000",
                    role_nm: "SYSTEM MANAGER",
                    shop_cd: null,
                    lang_cd: null,
                    bdmMenuList: null,
                },
            ],
        };
    } catch (error) {
        throw error;
    }
};

export const updateUserInfo = async (data) => {
    try {
        const res = await common.post("/updateUserInfo", data);
        if (isFailed(res)) throw res;
    } catch (error) {
        throw error;
    }
};

export const getNotRole = async (user) => {
    try {
        const res = await common.post("/getNotRole", user);
        if (isFailed(res)) throw res;

        return res.data.role;
    } catch (error) {
        throw error;
    }
};

export const getUserInfoByNo = async (user_id) => {
    try {
        const user = await common.post("/getUserInfoByNo", { user_id });
        if (isFailed(user)) throw user;

        return user.data.data[0];
    } catch (error) {
        throw error;
    }
};

export const upload = async (data) => {
    try {
        const res = await common.post("/system/S3/upload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (isFailed(res)) throw res;

        return res.data.path;
    } catch (error) {
        throw error;
    }
};

export const download = async (fileName) => {
    try {
        const res = await common.get("/system/S3/download", {
            params: { fileName: fileName },
            responseType: "blob",
        });
        if (isFailed(res)) throw res;

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const procFilterRetrive = async (
    shopCode,
    language,
    processCode,
    workType,
    isUse = "Y",
    userId
) => {
    try {
        const res = await common.get("/procFilterRetrive", {
            params: {
                shop_cd: shopCode,
                lang_cd: language,
                proc_cd: processCode,
                work_title: workType,
                use_yn: isUse,
                user_id: userId,
            },
        });
        if (isFailed(res)) throw res;

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getUserMenu = async (shop, role, language) => {
    try {
        const res = await common.get("/getUserMenu", {
            params: {
                shop_cd: shop,
                role_id: role,
                lang_cd: language,
            },
        });
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const shopHierarchyRetrive = async (language) => {
    try {
        const res = await common.post("/shopHierarchyRetrive", {
            lang_cd: language,
        });
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

////////////////////////// 메일발송이력 //////////////////////////
export const mailLogRetrive = async (
    from,
    to,
    isSend,
    type,
    name,
    title,
    shopCode,
    language
) => {
    try {
        const res = await common.get("/smtp/log/retrive", {
            params: {
                from,
                to,
                send_yn: isSend,
                mail_type: type,
                name,
                title,
                shop_cd: shopCode,
                lang_cd: language,
            },
        });
        if (isFailed(res)) throw res;

        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const getSysCode = async (language) => {
    try {
        const res = await common.get("/getSysCode", {
            params: { lang_cd: language },
        });
        if (isFailed(res)) throw res;

        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getSysModify = async (language) => {
    try {
        const res = await common.get("/getSysModify", {
            params: { lang_cd: language },
        });
        if (isFailed(res)) throw res;

        return res.data;
    } catch (error) {
        throw error;
    }
};
