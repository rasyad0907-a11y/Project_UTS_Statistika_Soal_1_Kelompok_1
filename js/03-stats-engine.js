
import { getMedian, getQuartiles } from "./01-state-utils.js";

export function calculateStatistics(values) {
    if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Data belum tersedia.");
    }

    if (values.some(value => !Number.isFinite(value))) {
        throw new Error("Terdapat data yang tidak valid.");
    }

    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;

    const sum = values.reduce(
        (total, value) => total + value,
        0
    );

    const mean = sum / n;
    const median = getMedian(sorted);

    const frequency = {};

    values.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
    });

    const highestFrequency = Math.max(
        ...Object.values(frequency)
    );

    const modes = Object.keys(frequency)
        .filter(key => frequency[key] === highestFrequency)
        .map(Number)
        .sort((a, b) => a - b);

    const mode = highestFrequency === 1 ? [] : modes;

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    const { q1, q3 } = getQuartiles(sorted);

    const iqr = q3 - q1;

    const squaredDifference = values.reduce(
        (total, value) => {
            return total + Math.pow(value - mean, 2);
        },
        0
    );

    const variance = n > 1
        ? squaredDifference / (n - 1)
        : 0;

    const std = Math.sqrt(variance);

    const cv = mean !== 0
        ? (std / Math.abs(mean)) * 100
        : null;

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
