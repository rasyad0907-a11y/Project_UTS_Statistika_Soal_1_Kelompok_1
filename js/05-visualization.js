
import {
    $,
    formatNumber,
    dataChart,
    frequencyChart,
    setDataChart,
    setFrequencyChart
} from "./01-state-utils.js";

export function destroyCharts() {
    if (dataChart) {
        dataChart.destroy();
        setDataChart(null);
    }

    if (frequencyChart) {
        frequencyChart.destroy();
        setFrequencyChart(null);
    }
}

export function updateCharts(results) {
    if (!window.Chart) {
        console.error("Chart.js belum dimuat.");
        return;
    }

    const dataCanvas = $("dataChart");
    const frequencyCanvas = $("frequencyChart");

    if (!dataCanvas || !frequencyCanvas) return;

    destroyCharts();

    const newDataChart = new Chart(dataCanvas, {
        type: "line",

        data: {
            labels: results.sorted.map(
                (_, index) => "Data " + (index + 1)
            ),

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
                },

                tooltip: {
                    callbacks: {
                        label: context =>
                            "Nilai: " + formatNumber(context.raw)
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    setDataChart(newDataChart);

    const labels = Object.keys(results.frequency)
        .sort((a, b) => Number(a) - Number(b));

    const values = labels.map(
        label => results.frequency[label]
    );

    const newFrequencyChart = new Chart(frequencyCanvas, {
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
                x: {
                    title: {
                        display: true,
                        text: "Nilai"
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    },

                    title: {
                        display: true,
                        text: "Frekuensi"
                    }
                }
            }
        }
    });

    setFrequencyChart(newFrequencyChart);
}
