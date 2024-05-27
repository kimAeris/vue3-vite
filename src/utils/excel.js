import ExcelJS from "exceljs";
import { removeSpecialCharAndSpace } from "./regex";
import theme from "@/plugins/vuetify/config/theme";

export const HEADER_COLOR = `00${theme.themes.light.colors.primary.slice(1)}`;
export const FONT_COLOR = `00${theme.themes.light.colors["on-primary"].slice(
    1
)}`;
export const BORDER_COLOR = `00${theme.themes.light.colors[
    "on-surface-variant"
].slice(1)}`;

export const styles = {
    fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: HEADER_COLOR,
        },
    },
    font: {
        color: {
            argb: FONT_COLOR,
        },
        bold: true,
    },
    border: {
        top: { style: "thin", color: { argb: BORDER_COLOR } },
        left: { style: "thin", color: { argb: BORDER_COLOR } },
        bottom: { style: "thin", color: { argb: BORDER_COLOR } },
        right: { style: "thin", color: { argb: BORDER_COLOR } },
    },
};

export const downloadExcel = async (columns, rows, title = "sheet") => {
    if (!columns || !rows || rows.length === 0 || columns.length === 0) {
        if (import.meta.env.DEV) console.warn(columns);
        if (import.meta.env.DEV) console.warn(rows);
        throw { msg: commonCode("MESSAGE", "MSG000005"), type: "warning" };
    }

    // 특수문자 제거
    const removeSpecialTitle = removeSpecialCharAndSpace(title);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(removeSpecialTitle);

    // 제목 삽입 및 스타일 적용
    const titleCell = worksheet.getCell("A1");
    titleCell.value = title;
    titleCell.font = {
        size: 18,
        bold: true,
    };
    titleCell.alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    const headers = columnsToHeaders(columns);

    worksheet.mergeCells(1, 1, 1, headers.length);

    const columnsDepth = getColumnDepth(columns);

    drawHaeders(worksheet, columns, columnsDepth, 2, 1, 2);
    drawBody(worksheet, headers, rows, columnsDepth + 1); // headerEndRow = 타이틀 + 헤더깊이

    // 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const listener = document.createElement("a");
    listener.href = window.URL.createObjectURL(blob);
    listener.download = `${removeSpecialTitle}.xlsx`;
    listener.click();
};

// 헤더 최대 깊이 찾기
export const getColumnDepth = (headers) => {
    let depth = 0;

    headers.forEach((item) => {
        if (item.children) {
            let childDepth = getColumnDepth(item.children);
            if (childDepth > depth) {
                depth = childDepth;
            }
        }
    });

    return 1 + depth;
};

export const columnsToHeaders = (data) => {
    let result = [];

    data.forEach((item) => {
        if (item.children) {
            result.push(...columnsToHeaders(item.children));
        } else {
            result.push(item);
        }
    });

    return result;
};

export const drawHaeders = (
    worksheet,
    columns,
    columnDepth,
    rowIndex,
    columnIndex,
    startRowIndex
) => {
    columns.forEach((item) => {
        const cell = worksheet.getCell(rowIndex, columnIndex);
        cell.value = item.title;
        cell.fill = styles.fill;
        cell.font = styles.font;
        cell.border = styles.border;
        if (item.align) {
            cell.alignment = {
                vertical: "middle",
                horizontal: item.align,
            };
        }

        let endColumnIndex = columnIndex;
        if (item.colspan) endColumnIndex += item.colspan - 1;

        let endRowIndex = rowIndex;
        if (!item.children) endRowIndex = columnDepth - 1 + startRowIndex; // 깊이 + 시작인덱스

        worksheet.mergeCells(
            rowIndex,
            columnIndex,
            endRowIndex,
            endColumnIndex
        );

        if (item.children) {
            drawHaeders(
                worksheet,
                item.children,
                columnDepth,
                rowIndex + 1,
                columnIndex,
                startRowIndex
            );
        }

        columnIndex = endColumnIndex + 1;
    });
};

export const drawBody = (worksheet, headers, rows, headerEndRow) => {
    rows.forEach((item, index) => {
        let columnIndex = 1;
        headers.forEach(({ key, align, colspan }) => {
            const rowIndex = headerEndRow + index + 1;
            const cell = worksheet.getCell(
                rowIndex, // 시작위치 + 인덱스 + 인덱스가0부터니까 1
                columnIndex
            );
            cell.value = item[key];
            cell.border = styles.border;

            if (align) {
                cell.alignment = {
                    vertical: "middle",
                    horizontal: align,
                };
            }

            let endColumnIndex = columnIndex;
            if (colspan) {
                endColumnIndex += colspan - 1;
                worksheet.mergeCells(
                    rowIndex,
                    columnIndex,
                    rowIndex,
                    endColumnIndex
                );
            }
            columnIndex = endColumnIndex + 1;
        });
    });
};
