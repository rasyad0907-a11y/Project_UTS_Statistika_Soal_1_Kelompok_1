
export let data = [];
export let dataChart = null;
export let frequencyChart = null;
export let lastResults = null;

export const $ = id => document.getElementById(id);

export function setData(value) {
    data = value;
}

export function setLastResults(value) {
    lastResults = value;
}

export function setDataChart(value) {
    dataChart = value;
}

export function setFrequencyChart(value) {
    frequencyChart = value;
}

export function formatNumber(value) {
    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(value)
    ) {
        return "-";
    }

    return Number(value.toFixed(4)).toLocaleString("id-ID", {
        maximumFractionDigits: 4
    });
}

export function parseInput(value) {
    return value
        .split(/[\s,;]+/)
        .filter(item => item.trim() !== "")
        .map(Number);
}

export function getMedian(values) {
    if (!values.length) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

export function getQuartiles(values) {
    const sorted = [...values].sort((a, b) => a - b);

    if (sorted.length === 0) {
        return { q1: null, q3: null };
    }

    if (sorted.length === 1) {
        return {
            q1: sorted[0],
            q3: sorted[0]
        };
    }

    const middle = Math.floor(sorted.length / 2);

    const lower = sorted.slice(0, middle);

    const upper = sorted.length % 2 === 0
        ? sorted.slice(middle)
        : sorted.slice(middle + 1);

    return {
        q1: getMedian(lower),
        q3: getMedian(upper)
    };
}

export function downloadFile(content, filename, type) {
    const blob = new Blob(["\uFEFF", content], { type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}
