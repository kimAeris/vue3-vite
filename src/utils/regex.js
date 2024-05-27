// 정규식에 해당하는 특수문자 및 공백 제거
export const removeSpecialCharAndSpace = (text) => {
    const regex = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\" ]/gm;

    return text.replace(regex, "");
};

// 정규식에 해당하는 특수문자 제거
export const removeSpecialChar = (text) => {
    const regex = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gm;

    return text.replace(regex, "");
};

// 날짜 YYYY-MM-DD 형식 정규식 검사
export const validDate = (text) => {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;

    return regex.test(text);
};
