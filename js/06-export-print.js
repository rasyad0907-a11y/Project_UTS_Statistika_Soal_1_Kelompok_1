
import {
    $,
    lastResults,
    formatNumber,
    downloadFile
} from "./01-state-utils.js";


// ==========================================
// HELPER
// ==========================================

function getPDFLibrary() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error("Library jsPDF belum dimuat.");
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    if (typeof pdf.autoTable !== "function") {
        throw new Error("Library jsPDF AutoTable belum dimuat.");
    }

    return pdf;
}

function safeFormat(value) {
    if (value === null || value === undefined) {
        return "-";
    }

    if (typeof value === "number") {
        return formatNumber(value);
    }

    return String(value);
}

function getOutliers(r) {
    const sorted = r.sorted || [];

    const lowerFence = r.q1 - (1.5 * r.iqr);
    const upperFence = r.q3 + (1.5 * r.iqr);

    return {
        lowerFence,
        upperFence,
        values: sorted.filter(value =>
            value < lowerFence || value > upperFence
        )
    };
}

function getPopulationStats(r) {
    const sorted = r.sorted || [];

    if (!sorted.length) {
        return {
            variance: null,
            std: null
        };
    }

    const mean = r.mean;

    const variance = sorted.reduce((total, value) => {
        return total + Math.pow(value - mean, 2);
    }, 0) / sorted.length;

    return {
        variance,
        std: Math.sqrt(variance)
    };
}

function getCanvasImage(id) {
    const canvas = $(id);

    if (!canvas || typeof canvas.toDataURL !== "function") {
        return null;
    }

    try {
        return canvas.toDataURL("image/png", 1);
    } catch (error) {
        console.warn("Grafik tidak dapat dimasukkan:", error);
        return null;
    }
}


// ==========================================
// DOWNLOAD TEMPLATE CSV
// ==========================================

export function downloadTemplate() {

    const csv = `NIM,Nama,Nilai_Ujian,Waktu_Belajar_Jam,Kehadiran_Persen
10201,Andika Saputra,82,16.0,92
10202,Bella Maharani,76,12.5,88
10203,Chandra Wijaya,91,21.0,97
10204,Dinda Amelia,68,9.5,84
10205,Farhan Akbar,87,19.0,96
10206,Galih Prakoso,59,7.0,72
10207,Hana Safitri,94,23.5,100
10208,Ilham Maulana,73,14.0,90
10209,Jessica Ananda,80,17.5,93
10210,Kevin Firmansyah,65,10.5,81
10211,Laras Puspita,89,20.0,98
10212,Miko Alfarizi,71,11.5,86
10213,Nadia Oktaviani,95,25.0,99
10214,Oscar Ramadhan,57,6.5,68
10215,Pratama Nugraha,84,18.0,94
10216,Rahma Febriani,78,15.0,91
10217,Surya Kurniawan,63,8.0,79
10218,Tania Aprilia,92,22.5,100
10219,Vicky Firmansyah,75,13.5,89
10220,Yuni Kartika,86,19.5,95
10221,Zaki Mubarok,69,10.0,83
10222,Alifia Ramadhani,88,18.5,97`;

    downloadFile(
        csv,
        "template_data_mahasiswa.csv",
        "text/csv;charset=utf-8;"
    );
}


// ==========================================
// EXPORT HASIL KE CSV
// ==========================================

export function exportCSV() {

    if (!lastResults) {
        alert("Hitung data terlebih dahulu.");
        return;
    }

    const r = lastResults;

    const population = getPopulationStats(r);
    const outliers = getOutliers(r);

    const rows = [
        ["KALKULATOR DATA DESKRIPTIF - KELOMPOK 1"],
        ["Keterangan", "Hasil"],
        ["Jumlah Data", r.n],
        ["Jumlah Nilai", r.sum],
        ["Mean", r.mean],
        ["Median", r.median],
        [
            "Modus",
            r.mode && r.mode.length
                ? r.mode.join(", ")
                : "Tidak ada modus"
        ],
        ["Minimum", r.min],
        ["Maksimum", r.max],
        ["Range", r.range],
        ["Varians Sampel", r.variance],
        ["Varians Populasi", population.variance],
        ["Standar Deviasi Sampel", r.std],
        ["Standar Deviasi Populasi", population.std],
        ["Q1", r.q1],
        ["Q3", r.q3],
        ["IQR", r.iqr],
        ["Koefisien Variasi", r.cv === null ? "-" : r.cv + "%"],
        ["Batas Outlier Bawah", outliers.lowerFence],
        ["Batas Outlier Atas", outliers.upperFence],
        ["Jumlah Outlier", outliers.values.length],
        ["Nilai Outlier", outliers.values.join(", ") || "Tidak ada"]
    ];

    if (r.sorted && r.sorted.length) {
        rows.push([]);
        rows.push(["DATA TERURUT"]);
        rows.push(["No", "Nilai"]);

        r.sorted.forEach((value, index) => {
            rows.push([index + 1, value]);
        });
    }

    const csv = rows.map(row =>
        row.map(value => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
        }).join(",")
    ).join("\r\n");

    downloadFile(
        "\uFEFF" + csv,
        "hasil_statistika_kelompok_1.csv",
        "text/csv;charset=utf-8;"
    );
}


// ==========================================
// EXPORT LAPORAN PDF
// ==========================================

export function exportPDF() {

    if (!lastResults) {
        alert("Hitung data terlebih dahulu.");
        return;
    }

    try {

        const pdf = getPDFLibrary();

        const r = lastResults;

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const margin = 18;

        const population = getPopulationStats(r);
        const outliers = getOutliers(r);

        const date = new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const colors = {
            navy: [20, 33, 59],
            blue: [37, 105, 145],
            lightBlue: [235, 245, 251],
            text: [45, 60, 80],
            muted: [120, 135, 155],
            white: [255, 255, 255]
        };


        // ==================================
        // HALAMAN PERTAMA - HEADER
        // ==================================

        pdf.setFillColor(...colors.navy);
        pdf.rect(0, 0, pageWidth, 48, "F");

        pdf.setTextColor(...colors.white);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(21);

        pdf.text("STATDESK", margin, 19);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        pdf.text(
            "KALKULATOR DATA DESKRIPTIF",
            margin,
            28
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);

        pdf.text(
            "KELOMPOK 1",
            margin,
            37
        );


        // ==================================
        // JUDUL LAPORAN
        // ==================================

        pdf.setTextColor(...colors.navy);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);

        pdf.text(
            "LAPORAN HASIL ANALISIS STATISTIK",
            margin,
            64
        );

        pdf.setTextColor(...colors.muted);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        pdf.text(
            "Analisis Statistik Deskriptif dan Visualisasi Data",
            margin,
            71
        );

        pdf.text(
            "Tanggal laporan: " + date,
            margin,
            78
        );


        // ==================================
        // RINGKASAN UTAMA
        // ==================================

        pdf.setFillColor(...colors.lightBlue);

        pdf.roundedRect(
            margin,
            86,
            pageWidth - (margin * 2),
            32,
            3,
            3,
            "F"
        );

        const summaryPositions = [
            margin + 8,
            margin + 68,
            margin + 128
        ];

        const summaryLabels = [
            "JUMLAH DATA",
            "RATA-RATA",
            "MEDIAN"
        ];

        const summaryValues = [
            String(r.n),
            safeFormat(r.mean),
            safeFormat(r.median)
        ];

        for (let i = 0; i < 3; i++) {

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(...colors.blue);

            pdf.text(
                summaryLabels[i],
                summaryPositions[i],
                97
            );

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.setTextColor(...colors.navy);

            pdf.text(
                summaryValues[i],
                summaryPositions[i],
                109
            );
        }


        // ==================================
        // TABEL PARAMETER STATISTIK
        // ==================================

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(...colors.navy);

        pdf.text(
            "HASIL PERHITUNGAN STATISTIK",
            margin,
            132
        );

        const statisticsRows = [

            ["1", "Jumlah Data (n)", safeFormat(r.n)],
            ["2", "Total Nilai (Σx)", safeFormat(r.sum)],
            ["3", "Rata-rata (Mean)", safeFormat(r.mean)],
            ["4", "Median (Me)", safeFormat(r.median)],

            [
                "5",
                "Modus (Mo)",
                r.mode && r.mode.length
                    ? r.mode.map(safeFormat).join(", ")
                    : "Tidak ada modus"
            ],

            ["6", "Nilai Terkecil (Xmin)", safeFormat(r.min)],
            ["7", "Nilai Terbesar (Xmax)", safeFormat(r.max)],
            ["8", "Jangkauan (Range)", safeFormat(r.range)],

            [
                "9",
                "Varians Sampel (s²)",
                safeFormat(r.variance)
            ],

            [
                "10",
                "Varians Populasi",
                safeFormat(population.variance)
            ],

            [
                "11",
                "Standar Deviasi Sampel (s)",
                safeFormat(r.std)
            ],

            [
                "12",
                "Standar Deviasi Populasi",
                safeFormat(population.std)
            ],

            ["13", "Kuartil 1 (Q1)", safeFormat(r.q1)],
            ["14", "Kuartil 3 (Q3)", safeFormat(r.q3)],
            ["15", "Jarak Interkuartil (IQR)", safeFormat(r.iqr)],

            [
                "16",
                "Koefisien Variasi",
                r.cv === null ? "-" : safeFormat(r.cv) + "%"
            ]

        ];

        pdf.autoTable({

            startY: 138,

            head: [
                ["No.", "Parameter Statistik", "Hasil"]
            ],

            body: statisticsRows,

            theme: "grid",

            margin: {
                left: margin,
                right: margin,
                bottom: 23
            },

            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 3,
                textColor: colors.text,
                lineColor: [220, 228, 236],
                lineWidth: 0.2
            },

            headStyles: {
                fillColor: colors.blue,
                textColor: colors.white,
                fontStyle: "bold",
                halign: "center"
            },

            alternateRowStyles: {
                fillColor: [242, 247, 251]
            },

            columnStyles: {
                0: {
                    cellWidth: 13,
                    halign: "center"
                },

                1: {
                    cellWidth: 105
                },

                2: {
                    halign: "right"
                }
            },

            didDrawPage: function () {

                pdf.setFontSize(8);
                pdf.setTextColor(...colors.muted);

            }

        });


        // ==================================
        // DETEKSI OUTLIER
        // ==================================

        let currentY = pdf.lastAutoTable.finalY + 12;

        if (currentY > pageHeight - 65) {
            pdf.addPage();
            currentY = 25;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(...colors.navy);

        pdf.text(
            "DETEKSI ANGKA TIDAK WAJAR",
            margin,
            currentY
        );

        currentY += 8;

        pdf.autoTable({

            startY: currentY,

            head: [
                ["Keterangan", "Hasil"]
            ],

            body: [
                [
                    "Batas Wajar Terendah",
                    safeFormat(outliers.lowerFence)
                ],
                [
                    "Batas Wajar Tertinggi",
                    safeFormat(outliers.upperFence)
                ],
                [
                    "Jumlah Outlier",
                    String(outliers.values.length)
                ],
                [
                    "Nilai Outlier",
                    outliers.values.length
                        ? outliers.values.map(safeFormat).join(", ")
                        : "Tidak ditemukan"
                ]
            ],

            theme: "grid",

            margin: {
                left: margin,
                right: margin,
                bottom: 23
            },

            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 3,
                textColor: colors.text
            },

            headStyles: {
                fillColor: colors.blue,
                textColor: colors.white,
                fontStyle: "bold"
            },

            alternateRowStyles: {
                fillColor: [242, 247, 251]
            }

        });


        // ==================================
        // INTERPRETASI DATA
        // ==================================

        currentY = pdf.lastAutoTable.finalY + 12;

        if (currentY > pageHeight - 65) {
            pdf.addPage();
            currentY = 25;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(...colors.navy);

        pdf.text(
            "RINGKASAN DAN KESIMPULAN",
            margin,
            currentY
        );

        currentY += 8;

        const interpretations = [

            `Jumlah data yang dianalisis sebanyak ${r.n} angka.`,

            `Nilai rata-rata data adalah ${safeFormat(r.mean)}, sedangkan nilai tengah (median) adalah ${safeFormat(r.median)}.`,

            `Nilai terkecil adalah ${safeFormat(r.min)} dan nilai terbesar adalah ${safeFormat(r.max)} dengan jangkauan ${safeFormat(r.range)}.`,

            `Kuartil pertama (Q1) adalah ${safeFormat(r.q1)} dan kuartil ketiga (Q3) adalah ${safeFormat(r.q3)}.`,

            `Jarak interkuartil (IQR) adalah ${safeFormat(r.iqr)}.`,

            `Standar deviasi sampel sebesar ${safeFormat(r.std)} menunjukkan tingkat penyebaran data terhadap rata-ratanya.`,

            outliers.values.length
                ? `Terdapat ${outliers.values.length} data yang terdeteksi sebagai outlier, yaitu ${outliers.values.map(safeFormat).join(", ")}.`
                : "Tidak ditemukan data yang termasuk outlier berdasarkan metode 1.5 × IQR."

        ];

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...colors.text);

        interpretations.forEach((item, index) => {

            const lines = pdf.splitTextToSize(
                (index + 1) + ". " + item,
                pageWidth - (margin * 2) - 5
            );

            if (currentY + (lines.length * 5) > pageHeight - 25) {
                pdf.addPage();
                currentY = 25;
            }

            pdf.text(lines, margin + 2, currentY);

            currentY += (lines.length * 5) + 4;

        });


        // ==================================
        // DATA TERURUT
        // ==================================

        if (r.sorted && r.sorted.length) {

            currentY += 5;

            if (currentY > pageHeight - 55) {
                pdf.addPage();
                currentY = 25;
            }

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(...colors.navy);

            pdf.text(
                "DATA TERURUT",
                margin,
                currentY
            );

            currentY += 7;

            const sortedRows = r.sorted.map((value, index) => [
                index + 1,
                safeFormat(value),
                value < outliers.lowerFence || value > outliers.upperFence
                    ? "OUTLIER"
                    : "Normal"
            ]);

            pdf.autoTable({

                startY: currentY,

                head: [
                    ["No.", "Nilai", "Keterangan"]
                ],

                body: sortedRows,

                theme: "grid",

                margin: {
                    left: margin,
                    right: margin,
                    bottom: 23
                },

                styles: {
                    font: "helvetica",
                    fontSize: 8,
                    cellPadding: 2.5,
                    textColor: colors.text
                },

                headStyles: {
                    fillColor: colors.blue,
                    textColor: colors.white,
                    fontStyle: "bold"
                },

                alternateRowStyles: {
                    fillColor: [242, 247, 251]
                },

                columnStyles: {
                    0: {
                        cellWidth: 20,
                        halign: "center"
                    },

                    1: {
                        halign: "center"
                    },

                    2: {
                        halign: "center"
                    }
                },

                didParseCell: function (data) {

                    if (
                        data.section === "body" &&
                        data.column.index === 2 &&
                        data.cell.raw === "OUTLIER"
                    ) {
                        data.cell.styles.textColor = [210, 55, 55];
                        data.cell.styles.fontStyle = "bold";
                    }

                }

            });

        }


        // ==================================
        // VISUALISASI GRAFIK
        // ==================================

        const chartImages = [

            {
                id: "dataChart",
                title: "Grafik Data"
            },

            {
                id: "frequencyChart",
                title: "Grafik Frekuensi"
            }

        ];

        for (const chart of chartImages) {

            const image = getCanvasImage(chart.id);

            if (!image) continue;

            pdf.addPage();

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.setTextColor(...colors.navy);

            pdf.text(
                chart.title.toUpperCase(),
                margin,
                25
            );

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(...colors.muted);

            pdf.text(
                "Visualisasi hasil pengolahan data statistik deskriptif.",
                margin,
                32
            );

            const imageWidth = pageWidth - (margin * 2);
            const imageHeight = 105;

            pdf.addImage(
                image,
                "PNG",
                margin,
                42,
                imageWidth,
                imageHeight
            );
        }


        // ==================================
        // FOOTER SELURUH HALAMAN
        // ==================================

        const totalPages = pdf.internal.getNumberOfPages();

        for (let page = 1; page <= totalPages; page++) {

            pdf.setPage(page);

            pdf.setDrawColor(220, 228, 236);

            pdf.line(
                margin,
                pageHeight - 18,
                pageWidth - margin,
                pageHeight - 18
            );

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(...colors.muted);

            pdf.text(
                "2026 | STATDESK - KELOMPOK 1",
                margin,
                pageHeight - 11
            );

            pdf.text(
                `Halaman ${page} dari ${totalPages}`,
                pageWidth - margin,
                pageHeight - 11,
                {
                    align: "right"
                }
            );
        }


        // ==================================
        // SIMPAN PDF
        // ==================================

        pdf.save("Laporan_Statistika_Kelompok_1.pdf");

        console.log("Laporan PDF berhasil dibuat.");

    } catch (error) {

        console.error("Gagal membuat PDF:", error);

        alert(
            "Gagal membuat laporan PDF.\n\n" +
            error.message
        );
    }
}
