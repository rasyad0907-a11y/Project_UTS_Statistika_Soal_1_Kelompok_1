
import { $ } from "./01-state-utils.js";

export function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        if (!window.Papa) {
            reject(new Error("Library PapaParse belum dimuat."));
            return;
        }

        window.Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,

            complete: function (results) {
                const rows = results.data;

                if (!rows || rows.length === 0) {
                    reject(new Error("File CSV kosong."));
                    return;
                }

                const headers = results.meta.fields || [];

                const preferredColumn = headers.find(header =>
                    header.trim().toLowerCase() === "nilai_ujian"
                );

                const numericColumns = headers.filter(header => {
                    const normalized = header.trim().toLowerCase();

                    if (
                        normalized === "nim" ||
                        normalized.includes("nama") ||
                        normalized.includes("id")
                    ) {
                        return false;
                    }

                    return rows.some(row => {
                        const value = String(row[header] ?? "")
                            .trim()
                            .replace(",", ".");

                        return value !== "" &&
                            Number.isFinite(Number(value));
                    });
                });

                const selectedColumn =
                    preferredColumn || numericColumns[0];

                if (!selectedColumn) {
                    reject(new Error(
                        "Tidak ditemukan kolom angka yang dapat dihitung."
                    ));
                    return;
                }

                const values = rows
                    .map(row => {
                        const value = String(row[selectedColumn] ?? "")
                            .trim()
                            .replace(",", ".");

                        return value === "" ? NaN : Number(value);
                    })
                    .filter(Number.isFinite);

                if (values.length === 0) {
                    reject(new Error(
                        "Kolom " + selectedColumn +
                        " tidak memiliki data angka yang valid."
                    ));
                    return;
                }

                resolve({
                    values,
                    column: selectedColumn,
                    totalRows: rows.length
                });
            },

            error: function (error) {
                reject(error);
            }
        });
    });
}

export function readManualInput() {
    const input = $("dataInput");

    if (!input) return [];

    const values = input.value
        .trim()
        .split(/[\s,;]+/)
        .filter(value => value !== "")
        .map(Number);

    if (
        values.length === 0 ||
        values.some(value => !Number.isFinite(value))
    ) {
        throw new Error("Data tidak valid. Masukkan angka yang benar.");
    }

    return values;
}
