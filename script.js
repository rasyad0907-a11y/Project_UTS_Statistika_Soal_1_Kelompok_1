
let data = [];
let dataChart = null;
let frequencyChart = null;
let lastResults = null;

const $ = id => document.getElementById(id);

function formatNumber(value) {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return "-";
    }

    return Number(value.toFixed(4)).toLocaleString("id-ID", {
        maximumFractionDigits: 4
    });
}

function parseInput(value) {
    return value
        .split(/[\s,;]+/)
        .filter(item => item.trim() !== "")
        .map(Number);
}

function getMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function getQuartiles(values) {
    const sorted = [...values].sort((a, b) => a - b);

    if (sorted.length < 2) {
        return {
            q1: sorted[0],
            q3: sorted[0]
        };
    }

    const middle = Math.floor(sorted.length / 2);

    const lower = sorted.length % 2 === 0
        ? sorted.slice(0, middle)
        : sorted.slice(0, middle);

    const upper = sorted.length % 2 === 0
        ? sorted.slice(middle)
        : sorted.slice(middle + 1);

    return {
        q1: getMedian(lower),
        q3: getMedian(upper)
    };
}

function calculateStatistics(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;

    const sum = values.reduce((total, value) => total + value, 0);
    const mean = sum / n;
    const median = getMedian(sorted);

    const frequency = {};

    values.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
    });

    const highestFrequency = Math.max(...Object.values(frequency));

    const modes = Object.keys(frequency)
        .filter(key => frequency[key] === highestFrequency)
        .map(Number);

    const mode = highestFrequency === 1 ? [] : modes;

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    const quartiles = getQuartiles(sorted);
    const q1 = quartiles.q1;
    const q3 = quartiles.q3;
    const iqr = q3 - q1;

    const squaredDifference = values.reduce((total, value) => {
        return total + Math.pow(value - mean, 2);
    }, 0);

    const variance = n > 1 ? squaredDifference / (n - 1) : 0;
    const std = Math.sqrt(variance);
    const cv = mean !== 0 ? (std / Math.abs(mean)) * 100 : null;

    return {
        n,
        sum,
        mean,
        median,
        mode,
        highestFrequency,
        min,
        max,
        range,
        q1,
        q3,
        iqr,
        variance,
        std,
        cv,
        sorted,
        frequency
    };
}

function updatePreview() {
    const table = $("previewTable");

    $("previewCount").textContent = data.length + " Data";

    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="2" class="empty-state">
                    Belum ada data yang dimasukkan.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = data.map((value, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatNumber(value)}</td>
        </tr>
    `).join("");
}

function updateDashboard(results) {
    $("totalData").textContent = results.n;
    $("dashboardMean").textContent = formatNumber(results.mean);
    $("dashboardMin").textContent = formatNumber(results.min);
    $("dashboardMax").textContent = formatNumber(results.max);
}

function updateResults(results) {
    $("resultN").textContent = results.n;
    $("resultSum").textContent = formatNumber(results.sum);
    $("resultMean").textContent = formatNumber(results.mean);
    $("resultMedian").textContent = formatNumber(results.median);

    $("resultMode").textContent = results.mode.length
        ? results.mode.map(formatNumber).join(", ")
        : "Tidak ada";

    $("resultRange").textContent = formatNumber(results.range);
    $("resultMin").textContent = formatNumber(results.min);
    $("resultMax").textContent = formatNumber(results.max);
    $("resultQ1").textContent = formatNumber(results.q1);
    $("resultQ3").textContent = formatNumber(results.q3);
    $("resultIQR").textContent = formatNumber(results.iqr);
    $("resultVariance").textContent = formatNumber(results.variance);
    $("resultStd").textContent = formatNumber(results.std);
    $("resultCV").textContent = results.cv === null
        ? "-"
        : formatNumber(results.cv) + "%";

    updateDashboard(results);
    updateInterpretation(results);
}

function updateInterpretation(results) {
    const modeText = results.mode.length
        ? results.mode.map(formatNumber).join(", ")
        : "tidak terdapat modus";

    $("interpretation").innerHTML = `
        <p>Jumlah data yang diolah sebanyak <strong>${results.n}</strong> data dengan jumlah keseluruhan nilai sebesar <strong>${formatNumber(results.sum)}</strong>.</p>

        <p>Nilai rata-rata (mean) adalah <strong>${formatNumber(results.mean)}</strong>, sedangkan nilai tengah (median) adalah <strong>${formatNumber(results.median)}</strong>.</p>

        <p>Modus dari data tersebut adalah <strong>${modeText}</strong>.</p>

        <p>Nilai terkecil adalah <strong>${formatNumber(results.min)}</strong> dan nilai terbesar adalah <strong>${formatNumber(results.max)}</strong>, sehingga diperoleh range sebesar <strong>${formatNumber(results.range)}</strong>.</p>

        <p>Standar deviasi sampel sebesar <strong>${formatNumber(results.std)}</strong> dengan varians sampel sebesar <strong>${formatNumber(results.variance)}</strong>.</p>
    `;
}

function updateCharts(results) {
    if (dataChart) {
        dataChart.destroy();
    }

    if (frequencyChart) {
        frequencyChart.destroy();
    }

    dataChart = new Chart($("dataChart"), {
        type: "line",
        data: {
            labels: results.sorted.map((_, index) => "Data " + (index + 1)),
            datasets: [{
                label: "Nilai Data",
                data: results.sorted,
                borderColor: "#258db9",
                backgroundColor: "rgba(37, 141, 185, 0.12)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    const labels = Object.keys(results.frequency);
    const values = Object.values(results.frequency);

    frequencyChart = new Chart($("frequencyChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Frekuensi",
                data: values,
                backgroundColor: "#6c9fc7",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function calculate() {
    const input = $("dataInput").value.trim();

    if (!input) {
        alert("Silakan masukkan data terlebih dahulu.");
        return;
    }

    const values = parseInput(input);

    if (values.length === 0 || values.some(value => !Number.isFinite(value))) {
        alert("Data tidak valid. Masukkan angka yang benar.");
        return;
    }

    data = values;
    lastResults = calculateStatistics(data);

    updatePreview();
    updateResults(lastResults);
    updateCharts(lastResults);

    alert("Perhitungan statistik berhasil dilakukan.");
}

$("calculateBtn").addEventListener("click", calculate);

$("clearBtn").addEventListener("click", () => {
    data = [];
    lastResults = null;

    $("dataInput").value = "";
    $("fileStatus").textContent = "Belum ada file yang dipilih.";

    updatePreview();

    $("totalData").textContent = "0";
    $("dashboardMean").textContent = "0";
    $("dashboardMin").textContent = "0";
    $("dashboardMax").textContent = "0";

    [
        "resultN",
        "resultSum",
        "resultMean",
        "resultMedian",
        "resultRange",
        "resultMin",
        "resultMax",
        "resultQ1",
        "resultQ3",
        "resultIQR",
        "resultVariance",
        "resultStd"
    ].forEach(id => $(id).textContent = "0");

    $("resultMode").textContent = "-";
    $("resultCV").textContent = "0%";

    $("interpretation").innerHTML = `
        <p>Masukkan data terlebih dahulu untuk melihat interpretasi.</p>
    `;

    if (dataChart) {
        dataChart.destroy();
        dataChart = null;
    }

    if (frequencyChart) {
        frequencyChart.destroy();
        frequencyChart = null;
    }
});

$("csvFile").addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
        complete: function(results) {
            const values = [];

            results.data.forEach(row => {
                row.forEach(cell => {
                    const cleaned = String(cell).trim();

                    if (cleaned !== "" && !isNaN(cleaned)) {
                        values.push(Number(cleaned));
                    }
                });
            });

            if (values.length === 0) {
                alert("File CSV tidak memiliki data angka yang valid.");
                return;
            }

            data = values;
            $("dataInput").value = data.join(", ");
            $("fileStatus").textContent = "File berhasil diunggah: " + file.name;

            updatePreview();
            calculateFromData();
        },
        error: function() {
            alert("Gagal membaca file CSV.");
        }
    });
});

function calculateFromData() {
    if (data.length === 0) return;

    lastResults = calculateStatistics(data);

    updatePreview();
    updateResults(lastResults);
    updateCharts(lastResults);
}

$("downloadTemplate").addEventListener("click", () => {
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
});

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

$("exportCSV").addEventListener("click", () => {
    if (!lastResults) {
        alert("Hitung data terlebih dahulu.");
        return;
    }

    const r = lastResults;

    const rows = [
        ["Keterangan", "Hasil"],
        ["Jumlah Data", r.n],
        ["Jumlah Nilai", r.sum],
        ["Mean", r.mean],
        ["Median", r.median],
        ["Modus", r.mode.length ? r.mode.join(", ") : "Tidak ada"],
        ["Minimum", r.min],
        ["Maksimum", r.max],
        ["Range", r.range],
        ["Q1", r.q1],
        ["Q3", r.q3],
        ["IQR", r.iqr],
        ["Varians Sampel", r.variance],
        ["Standar Deviasi Sampel", r.std],
        ["Koefisien Variasi", r.cv === null ? "-" : r.cv + "%"]
    ];

    const csv = rows.map(row => row.join(",")).join("\n");

    downloadFile(
        csv,
        "hasil_statistika_kelompok_1.csv",
        "text/csv;charset=utf-8;"
    );
});


$("exportPDF").addEventListener("click", () => {
    if (!lastResults) {
        alert("Hitung data terlebih dahulu.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const r = lastResults;
    const pageWidth = pdf.internal.pageSize.getWidth();

    // HEADER NAVY
    pdf.setFillColor(20, 33, 59);
    pdf.rect(0, 0, pageWidth, 48, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("STATDESK", 18, 20);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("KALKULATOR DATA DESKRIPTIF", 18, 29);
    pdf.text("KELOMPOK 1", 18, 38);

    // JUDUL
    pdf.setTextColor(30, 48, 75);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("HASIL PERHITUNGAN STATISTIKA", 18, 64);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 135, 155);
    pdf.text("Laporan hasil pengolahan data statistik deskriptif", 18, 72);

    // KOTAK RINGKASAN
    pdf.setFillColor(235, 245, 251);
    pdf.roundedRect(18, 82, pageWidth - 36, 30, 3, 3, "F");

    pdf.setTextColor(40, 110, 150);
    pdf.setFontSize(9);
    pdf.text("JUMLAH DATA", 25, 92);
    pdf.text("RATA-RATA", 85, 92);
    pdf.text("MEDIAN", 145, 92);

    pdf.setTextColor(25, 45, 70);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(String(r.n), 25, 103);
    pdf.text(formatNumber(r.mean), 85, 103);
    pdf.text(formatNumber(r.median), 145, 103);

    // TABEL HASIL
    const rows = [
        ["Jumlah Data", r.n],
        ["Jumlah Nilai", formatNumber(r.sum)],
        ["Mean", formatNumber(r.mean)],
        ["Median", formatNumber(r.median)],
        ["Modus", r.mode.length ? r.mode.map(formatNumber).join(", ") : "Tidak ada"],
        ["Nilai Minimum", formatNumber(r.min)],
        ["Nilai Maksimum", formatNumber(r.max)],
        ["Range", formatNumber(r.range)],
        ["Kuartil 1 (Q1)", formatNumber(r.q1)],
        ["Kuartil 3 (Q3)", formatNumber(r.q3)],
        ["Interquartile Range (IQR)", formatNumber(r.iqr)],
        ["Varians Sampel", formatNumber(r.variance)],
        ["Standar Deviasi Sampel", formatNumber(r.std)],
        ["Koefisien Variasi", r.cv === null ? "-" : formatNumber(r.cv) + "%"]
    ];

    let y = 127;

    pdf.setFillColor(37, 105, 145);
    pdf.rect(18, y - 7, pageWidth - 36, 12, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("INDIKATOR STATISTIK", 24, y);
    pdf.text("HASIL", 145, y);

    y += 12;

    rows.forEach((row, index) => {
        if (index % 2 === 0) {
            pdf.setFillColor(240, 246, 250);
        } else {
            pdf.setFillColor(255, 255, 255);
        }

        pdf.rect(18, y - 7, pageWidth - 36, 10, "F");

        pdf.setTextColor(55, 70, 90);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(row[0]), 24, y);

        pdf.setFont("helvetica", "bold");
        pdf.text(String(row[1]), 145, y);

        y += 10;
    });

    // INTERPRETASI
    y += 12;

    pdf.setTextColor(30, 48, 75);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("INTERPRETASI DATA", 18, y);

    y += 9;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(90, 105, 125);

    const interpretation = [
        `Jumlah data yang diolah sebanyak ${r.n} data.`,
        `Rata-rata data sebesar ${formatNumber(r.mean)}.`,
        `Median data sebesar ${formatNumber(r.median)}.`,
        `Nilai minimum ${formatNumber(r.min)} dan maksimum ${formatNumber(r.max)}.`,
        `Jangkauan data sebesar ${formatNumber(r.range)}.`,
        `Standar deviasi sampel sebesar ${formatNumber(r.std)}.`
    ];

    interpretation.forEach(item => {
        const lines = pdf.splitTextToSize(item, pageWidth - 40);

        if (y + lines.length * 5 > 275) {
            pdf.addPage();
            y = 25;
        }

        pdf.text(lines, 20, y);
        y += lines.length * 5 + 3;
    });

    // FOOTER
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(20, 33, 59);
    pdf.rect(0, pageHeight - 16, pageWidth, 16, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text("© 2026 STATDESK - KELOMPOK 1", 18, pageHeight - 6);

    pdf.save("Laporan_Statistika_Kelompok_1.pdf");
});


$("formulaSearch").addEventListener("input", event => {
    const keyword = event.target.value.toLowerCase();

    document.querySelectorAll(".dictionary-card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(keyword)
            ? ""
            : "none";
    });
});

$("termSearch").addEventListener("input", event => {
    const keyword = event.target.value.toLowerCase();

    document.querySelectorAll(".term-card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(keyword)
            ? ""
            : "none";
    });
});

// NAVIGASI OTOMATIS MENGIKUTI SCROLL

const navLinks = document.querySelectorAll(".nav-link");

const sections = document.querySelectorAll(
    "#dashboard, #input, #hasil, #visualisasi, #rumus, #istilah"
);

const observer = new IntersectionObserver(entries => {
    const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleSections.length > 0) {
        const activeId = visibleSections[0].target.id;

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + activeId
            );
        });
    }
}, {
    root: null,
    rootMargin: "-15% 0px -65% 0px",
    threshold: [0, 0.1, 0.25, 0.5]
});

sections.forEach(section => observer.observe(section));

// NAVIGASI SAAT DIKLIK

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// DRAG AND DROP FILE CSV

const dropArea = $("dropArea");

dropArea.addEventListener("dragover", event => {
    event.preventDefault();
    dropArea.style.borderColor = "#258db9";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#aebfd0";
});

dropArea.addEventListener("drop", event => {
    event.preventDefault();
    dropArea.style.borderColor = "#aebfd0";

    const file = event.dataTransfer.files[0];

    if (!file || !file.name.toLowerCase().endsWith(".csv")) {
        alert("Silakan masukkan file CSV.");
        return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    $("csvFile").files = transfer.files;

    $("csvFile").dispatchEvent(new Event("change"));
});

updatePreview();
