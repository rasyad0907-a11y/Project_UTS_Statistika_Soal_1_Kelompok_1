
# STATDESK – Kalkulator Data Deskriptif

Aplikasi analisis statistik deskriptif berbasis web yang digunakan untuk mengolah data numerik, menghitung ukuran statistik, dan menampilkan visualisasi data secara interaktif.

Proyek ini dikembangkan oleh Kelompok 2 untuk memenuhi tugas mata kuliah Statistika.

## Deskripsi Aplikasi

STATDESK merupakan aplikasi berbasis HTML, CSS, dan JavaScript yang membantu pengguna melakukan analisis statistik deskriptif dengan lebih mudah.

Pengguna dapat memasukkan data secara manual atau mengunggah file CSV. Data yang dimasukkan kemudian diproses untuk menghasilkan berbagai ukuran statistik deskriptif beserta visualisasinya.

## Fitur Utama

- Input data numerik secara manual.
- Upload dataset menggunakan file CSV.
- Perhitungan statistik deskriptif secara otomatis.
- Menampilkan jumlah data, total, rata-rata, median, dan modus.
- Menghitung nilai minimum, maksimum, dan jangkauan.
- Menghitung kuartil pertama (Q1) dan kuartil ketiga (Q3).
- Menghitung interquartile range (IQR).
- Menghitung varians dan standar deviasi.
- Menghitung koefisien variasi.
- Menampilkan interpretasi hasil statistik.
- Visualisasi data menggunakan grafik.
- Menampilkan data dalam urutan terurut.
- Pencarian kamus rumus dan istilah statistik.
- Mengunduh template CSV.
- Mengekspor hasil ke CSV.
- Mencetak atau menyimpan laporan dalam format PDF.
- Menghapus data dan mengatur ulang aplikasi.

## Struktur Folder

```text
stat-deskriptif-modular/
│
├── index.html
├── sample_mahasiswa.csv
├── README.md
│
├── partials/
│   ├── layout.html
│   ├── section-header.html
│   ├── section-input.html
│   ├── section-summary.html
│   ├── section-stats-cards.html
│   ├── section-visualization.html
│   ├── section-sorted-viewer.html
│   └── section-modal-footer.html
│
├── css/
│   ├── 01-base.css
│   ├── 02-components.css
│   ├── 03-plugins.css
│   └── 04-print.css
│
└── js/
    ├── 01-state-utils.js
    ├── 02-input-parser.js
    ├── 03-stats-engine.js
    ├── 04-render-dashboard.js
    ├── 05-visualization.js
    ├── 06-export-print.js
    └── 07-main-init.js
```

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur halaman aplikasi |
| CSS3 | Tampilan dan desain antarmuka |
| JavaScript | Logika dan perhitungan statistik |
| Chart.js | Visualisasi data statistik |
| Papa Parse | Membaca dan memproses file CSV |

## Cara Menjalankan Aplikasi

1. Download atau clone repository proyek.
2. Ekstrak folder proyek jika masih berbentuk ZIP.
3. Buka folder `stat-deskriptif-modular` menggunakan Visual Studio Code.
4. Pastikan seluruh file dan folder berada pada struktur yang sesuai.
5. Instal ekstensi Live Server jika belum tersedia.
6. Klik kanan file `index.html`.
7. Pilih **Open with Live Server**.
8. Aplikasi akan terbuka melalui browser.

## Cara Menggunakan Aplikasi

### 1. Memasukkan Data

Pengguna dapat memasukkan angka secara manual melalui kolom input yang tersedia.

### 2. Mengunggah File CSV

Pengguna dapat mengunggah dataset dengan format `.csv`.

Aplikasi juga menyediakan file contoh `sample_mahasiswa.csv` yang dapat digunakan untuk pengujian.

### 3. Menghitung Statistik

Klik tombol **Hitung Statistik** untuk memproses data dan menghasilkan ukuran statistik deskriptif.

### 4. Melihat Hasil

Hasil perhitungan akan ditampilkan pada bagian dashboard dan hasil statistik, termasuk tabel, ringkasan, serta visualisasi grafik.

### 5. Mengekspor Hasil

Pengguna dapat mengunduh hasil analisis dalam format CSV atau mencetak laporan menjadi PDF.

## Dataset Contoh

File `sample_mahasiswa.csv` berisi data 22 mahasiswa dengan atribut:

- NIM
- Nama
- Nilai_Ujian
- Waktu_Belajar_Jam
- Kehadiran_Persen

Dataset ini digunakan sebagai contoh pengujian fitur pembacaan CSV dan analisis statistik.

## Rumus Statistik yang Digunakan

| Ukuran Statistik | Keterangan |
|---|---|
| Mean | Rata-rata data |
| Median | Nilai tengah |
| Modus | Nilai yang paling sering muncul |
| Range | Selisih nilai maksimum dan minimum |
| Varians | Ukuran penyebaran data |
| Standar Deviasi | Akar kuadrat varians |
| Kuartil | Pembagian data menjadi empat bagian |
| IQR | Selisih Q3 dan Q1 |
| Koefisien Variasi | Perbandingan standar deviasi terhadap mean |

## Pengembang

**Kelompok 2**

Proyek ini dibuat sebagai bagian dari pembelajaran dan penerapan materi statistika deskriptif menggunakan teknologi web.

---

© 2026 STATDESK – Kalkulator Data Deskriptif.
