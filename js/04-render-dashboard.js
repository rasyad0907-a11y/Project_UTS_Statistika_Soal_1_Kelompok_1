
import {
    $,
    data,
    formatNumber,
    escapeHTML
} from "./01-state-utils.js";

export function updatePreview() {
    const table = $("previewTable");

    if (!table) return;

    const previewCount = $("previewCount");
    if (previewCount) {
        previewCount.textContent = data.length + " Data";
    }

    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="2" class="empty-state">
                    Belum ada data yang dimasukkan.
                </td>
            </tr>
        `;
        updateSortedData();
        return;
    }

    table.innerHTML = data.map((value, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatNumber(value)}</td>
        </tr>
    `).join("");

    updateSortedData();
}

export function updateSortedData() {
    const container = $("sortedData");

    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">↕</div>
                <h4>Belum Ada Data</h4>
                <p>Masukkan data untuk menampilkan urutan data.</p>
            </div>
        `;
        return;
    }

    const sortedValues = [...data].sort((a, b) => a - b);

    container.innerHTML = `
        <div class="sorted-list">
            ${sortedValues.map((value, index) => `
                <div class="sorted-item">
                    <span class="sorted-index">${index + 1}</span>
                    <span class="sorted-value">${formatNumber(value)}</span>
                </div>
            `).join("")}
        </div>

        <div class="sorted-total">
            <span>Total Data</span>
            <strong>${sortedValues.length} Data</strong>
        </div>
    `;
}

export function updateDashboard(results) {
    $("totalData").textContent = results.n;
    $("dashboardMean").textContent = formatNumber(results.mean);
    $("dashboardMin").textContent = formatNumber(results.min);
    $("dashboardMax").textContent = formatNumber(results.max);
}

export function updateResults(results) {
    const resultElements = {
        resultN: results.n,
        resultSum: formatNumber(results.sum),
        resultMean: formatNumber(results.mean),
        resultMedian: formatNumber(results.median),
        resultRange: formatNumber(results.range),
        resultMin: formatNumber(results.min),
        resultMax: formatNumber(results.max),
        resultQ1: formatNumber(results.q1),
        resultQ3: formatNumber(results.q3),
        resultIQR: formatNumber(results.iqr),
        resultVariance: formatNumber(results.variance),
        resultStd: formatNumber(results.std)
    };

    Object.entries(resultElements).forEach(([id, value]) => {
        const element = $(id);
        if (element) element.textContent = value;
    });

    const modeElement = $("resultMode");
    if (modeElement) {
        modeElement.textContent = results.mode.length
            ? results.mode.map(formatNumber).join(", ")
            : "Tidak ada";
    }

    const cvElement = $("resultCV");
    if (cvElement) {
        cvElement.textContent = results.cv === null
            ? "-"
            : formatNumber(results.cv) + "%";
    }

    updateDashboard(results);
    updateInterpretation(results);
    updateSortedData();
}

export function updateInterpretation(results) {
    const modeText = results.mode.length
        ? results.mode.map(formatNumber).join(", ")
        : "tidak terdapat modus";

    const interpretation = $("interpretation");

    if (!interpretation) return;

    interpretation.innerHTML = `
        <p>
            Jumlah data yang diolah sebanyak
            <strong>${results.n}</strong> data dengan jumlah
            keseluruhan nilai sebesar
            <strong>${formatNumber(results.sum)}</strong>.
        </p>

        <p>
            Nilai rata-rata (mean) adalah
            <strong>${formatNumber(results.mean)}</strong>,
            sedangkan nilai tengah (median) adalah
            <strong>${formatNumber(results.median)}</strong>.
        </p>

        <p>
            Modus dari data tersebut adalah
            <strong>${escapeHTML(modeText)}</strong>.
        </p>

        <p>
            Nilai terkecil adalah
            <strong>${formatNumber(results.min)}</strong>
            dan nilai terbesar adalah
            <strong>${formatNumber(results.max)}</strong>,
            sehingga diperoleh range sebesar
            <strong>${formatNumber(results.range)}</strong>.
        </p>

        <p>
            Kuartil pertama (Q1) sebesar
            <strong>${formatNumber(results.q1)}</strong>
            dan kuartil ketiga (Q3) sebesar
            <strong>${formatNumber(results.q3)}</strong>.
        </p>

        <p>
            Interquartile Range (IQR) sebesar
            <strong>${formatNumber(results.iqr)}</strong>.
        </p>

        <p>
            Standar deviasi sampel sebesar
            <strong>${formatNumber(results.std)}</strong>
            dengan varians sampel sebesar
            <strong>${formatNumber(results.variance)}</strong>.
        </p>
    `;
}
