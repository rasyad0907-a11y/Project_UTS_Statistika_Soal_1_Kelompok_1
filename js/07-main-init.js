
import {
    $,
    data,
    setData,
    setLastResults,
    parseInput
} from "./01-state-utils.js";

import { parseCSVFile } from "./02-input-parser.js";
import { calculateStatistics } from "./03-stats-engine.js";
import { updatePreview, updateResults } from "./04-render-dashboard.js";
import { updateCharts, destroyCharts } from "./05-visualization.js";
import { downloadTemplate, exportCSV, exportPDF } from "./06-export-print.js";

// ========================================
// PERHITUNGAN STATISTIK
// ========================================

function calculate() {
    const input = $("dataInput");

    if (!input || !input.value.trim()) {
        alert("Silakan masukkan data terlebih dahulu.");
        return;
    }

    const values = parseInput(input.value);

    if (
        values.length === 0 ||
        values.some(value => !Number.isFinite(value))
    ) {
        alert("Data tidak valid. Masukkan angka yang benar.");
        return;
    }

    setData(values);
    calculateFromData();

    alert("Perhitungan statistik berhasil dilakukan.");
}

function calculateFromData() {
    if (data.length === 0) return;

    try {
        const results = calculateStatistics(data);

        setLastResults(results);

        updatePreview();
        updateResults(results);
        updateCharts(results);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// ========================================
// HAPUS DATA APLIKASI
// ========================================

function clearApplication() {
    setData([]);
    setLastResults(null);

    if ($("dataInput")) {
        $("dataInput").value = "";
    }

    if ($("csvFile")) {
        $("csvFile").value = "";
    }

    if ($("fileStatus")) {
        $("fileStatus").textContent =
            "Belum ada file yang dipilih.";
    }

    updatePreview();

    const dashboardIds = [
        "totalData",
        "dashboardMean",
        "dashboardMin",
        "dashboardMax"
    ];

    dashboardIds.forEach(id => {
        if ($(id)) {
            $(id).textContent = "0";
        }
    });

    const resultIds = [
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
    ];

    resultIds.forEach(id => {
        if ($(id)) {
            $(id).textContent = "0";
        }
    });

    if ($("resultMode")) {
        $("resultMode").textContent = "-";
    }

    if ($("resultCV")) {
        $("resultCV").textContent = "0%";
    }

    if ($("interpretation")) {
        $("interpretation").innerHTML =
            "<p>Masukkan data terlebih dahulu untuk melihat interpretasi.</p>";
    }

    destroyCharts();
}

// ========================================
// UPLOAD CSV
// ========================================

async function handleCSVUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("File harus berformat CSV.");
        event.target.value = "";
        return;
    }

    try {
        const result = await parseCSVFile(file);

        setData(result.values);

        if ($("dataInput")) {
            $("dataInput").value =
                result.values.join(", ");
        }

        if ($("fileStatus")) {
            $("fileStatus").textContent =
                "File berhasil diunggah: " +
                file.name +
                " | Kolom: " +
                result.column;
        }

        calculateFromData();

        alert(
            "File berhasil dibaca.\n" +
            "Kolom: " + result.column + "\n" +
            "Jumlah data: " + result.values.length
        );

    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "Gagal membaca file CSV."
        );

        event.target.value = "";
    }
}

// ========================================
// PENCARIAN KAMUS RUMUS
// ========================================

function setupFormulaSearch() {
    const search = $("formulaSearch");

    if (!search) return;

    search.addEventListener("input", event => {
        const keyword =
            event.target.value.toLowerCase();

        document
            .querySelectorAll(".dictionary-card")
            .forEach(card => {
                card.style.display =
                    card.textContent
                        .toLowerCase()
                        .includes(keyword)
                        ? ""
                        : "none";
            });
    });
}

// ========================================
// PENCARIAN KAMUS ISTILAH
// ========================================

function setupTermSearch() {
    const search = $("termSearch");

    if (!search) return;

    search.addEventListener("input", event => {
        const keyword =
            event.target.value.toLowerCase();

        document
            .querySelectorAll(".term-card")
            .forEach(card => {
                card.style.display =
                    card.textContent
                        .toLowerCase()
                        .includes(keyword)
                        ? ""
                        : "none";
            });
    });
}

// ========================================
// NAVIGASI AKTIF DAN SMOOTH SCROLL
// ========================================

function setupNavigation() {
    const menuLinks = [
        ...document.querySelectorAll(".menu-link")
    ];

    if (!menuLinks.length) return;

    const sections = menuLinks
        .map(link => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) {
                return null;
            }

            const section = document.getElementById(
                href.substring(1)
            );

            if (!section) return null;

            return {
                link,
                section,
                href
            };
        })
        .filter(Boolean);

    if (!sections.length) return;

    let ticking = false;
    let animationFrame = null;
    let isNavigating = false;

    const scrollDuration = 700;

    // ------------------------------------
    // MENGATUR MENU AKTIF
    // ------------------------------------

    function setActiveNavigation(activeLink) {
        menuLinks.forEach(link => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        });

        if (!activeLink) return;

        activeLink.classList.add("active");

        activeLink.setAttribute(
            "aria-current",
            "page"
        );

        // Scroll menu horizontal pada mobile
        const sidebarMenu =
            activeLink.closest(".sidebar-menu");

        if (
            sidebarMenu &&
            window.innerWidth <= 768
        ) {
            const menuRect =
                sidebarMenu.getBoundingClientRect();

            const linkRect =
                activeLink.getBoundingClientRect();

            if (
                linkRect.left < menuRect.left ||
                linkRect.right > menuRect.right
            ) {
                activeLink.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest"
                });
            }
        }
    }

    // ------------------------------------
    // EASING ANIMATION
    // ------------------------------------

    function easeInOutCubic(progress) {
        return progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    // ------------------------------------
    // CUSTOM SMOOTH SCROLL
    // ------------------------------------

    function smoothScrollTo(target) {
        // Hentikan animasi sebelumnya
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        const startPosition = window.scrollY;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            25;

        const distance =
            targetPosition - startPosition;

        const startTime = performance.now();

        isNavigating = true;

        function animate(currentTime) {
            const elapsed =
                currentTime - startTime;

            const progress = Math.min(
                elapsed / scrollDuration,
                1
            );

            const easedProgress =
                easeInOutCubic(progress);

            const currentPosition =
                startPosition +
                distance * easedProgress;

            window.scrollTo({
                top: currentPosition,
                behavior: "instant"
            });

            if (progress < 1) {
                animationFrame =
                    requestAnimationFrame(animate);

            } else {
                animationFrame = null;
                isNavigating = false;

                updateActiveOnScroll();
            }
        }

        animationFrame =
            requestAnimationFrame(animate);
    }

    // ------------------------------------
    // MENENTUKAN SECTION AKTIF
    // ------------------------------------

    function updateActiveOnScroll() {
        const activationPoint =
            window.innerHeight * 0.30;

        let currentSection = sections[0];

        for (const item of sections) {
            const rect =
                item.section.getBoundingClientRect();

            if (rect.top <= activationPoint) {
                currentSection = item;
            } else {
                break;
            }
        }

        // Deteksi bagian paling bawah halaman
        const atBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5;

        if (atBottom) {
            currentSection =
                sections[sections.length - 1];
        }

        setActiveNavigation(currentSection.link);
    }

    // ------------------------------------
    // OPTIMASI SCROLL
    // ------------------------------------

    function handleScroll() {
        if (ticking || isNavigating) return;

        ticking = true;

        requestAnimationFrame(() => {
            updateActiveOnScroll();
            ticking = false;
        });
    }

    // ------------------------------------
    // KLIK MENU NAVIGASI
    // ------------------------------------

    sections.forEach(item => {
        item.link.addEventListener("click", event => {
            event.preventDefault();

            setActiveNavigation(item.link);

            if (window.location.hash !== item.href) {
                history.pushState(
                    null,
                    "",
                    item.href
                );
            }

            smoothScrollTo(item.section);
        });
    });

    // ------------------------------------
    // EVENT SCROLL
    // ------------------------------------

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    // ------------------------------------
    // EVENT RESIZE
    // ------------------------------------

    window.addEventListener("resize", () => {
        handleScroll();
    });

    // ------------------------------------
    // BACK DAN FORWARD BROWSER
    // ------------------------------------

    window.addEventListener("popstate", () => {
        const hash =
            window.location.hash || "#dashboard";

        const target = sections.find(
            item => item.href === hash
        );

        if (target) {
            setActiveNavigation(target.link);

            smoothScrollTo(target.section);
        }
    });

    // ------------------------------------
    // HASH CHANGE
    // ------------------------------------

    window.addEventListener("hashchange", () => {
        const hash =
            window.location.hash || "#dashboard";

        const target = sections.find(
            item => item.href === hash
        );

        if (target) {
            setActiveNavigation(target.link);
        }
    });

    // ------------------------------------
    // DETEKSI AWAL
    // ------------------------------------

    const initialHash =
        window.location.hash || "#dashboard";

    const initialSection = sections.find(
        item => item.href === initialHash
    );

    if (initialSection) {
        setActiveNavigation(initialSection.link);
    }

    updateActiveOnScroll();
}

// ========================================
// DRAG AND DROP CSV
// ========================================

function setupDragAndDrop() {
    const dropArea = $("dropArea");
    const csvFile = $("csvFile");

    if (!dropArea || !csvFile) return;

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

        if (
            !file ||
            !file.name.toLowerCase().endsWith(".csv")
        ) {
            alert("Silakan masukkan file CSV.");
            return;
        }

        const transfer = new DataTransfer();

        transfer.items.add(file);
        csvFile.files = transfer.files;

        csvFile.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );
    });
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    $("calculateBtn")?.addEventListener(
        "click",
        calculate
    );

    $("clearBtn")?.addEventListener(
        "click",
        clearApplication
    );

    $("csvFile")?.addEventListener(
        "change",
        handleCSVUpload
    );

    $("downloadTemplate")?.addEventListener(
        "click",
        downloadTemplate
    );

    $("exportCSV")?.addEventListener(
        "click",
        exportCSV
    );

    $("exportPDF")?.addEventListener(
        "click",
        exportPDF
    );

    setupFormulaSearch();
    setupTermSearch();
    setupNavigation();
    setupDragAndDrop();
}

// ========================================
// INITIALIZATION
// ========================================

function initializeApplication() {
    updatePreview();

    setupEventListeners();

    console.log(
        "STATDESK berhasil diinisialisasi."
    );
}

initializeApplication();
