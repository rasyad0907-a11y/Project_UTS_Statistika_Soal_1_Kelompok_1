
# Project UTS Statistika Soal 1 Kelompok 1

Aplikasi berbasis web untuk melakukan pengolahan dan analisis statistik deskriptif secara praktis, interaktif, dan mudah digunakan. Aplikasi ini membantu pengguna menghitung berbagai ukuran statistik, memahami karakteristik data, serta melihat distribusi data melalui visualisasi grafik.

## Identitas Kelompok

**Kelompok 1**

| No. | NIM | Nama Anggota |
|---|---|---|
| 1 | 2503010035 | Wafik Muhammad Almajdi |
| 2 | 2503010025 | Muhammad Rasyad Mubarok |
| 3 | 2503010132 | Allya Hericka Putri |
| 4 | 2503010051 | Reva Nur Budiman |

---

## Deskripsi Aplikasi

Project UTS Statistika Soal 1 merupakan aplikasi berbasis web yang dirancang untuk membantu proses perhitungan statistik deskriptif pada sekumpulan data numerik.

Pengguna dapat memasukkan data secara manual maupun mengunggah file CSV. Setelah data diproses, aplikasi akan menampilkan hasil perhitungan statistik, tabel distribusi frekuensi, dan visualisasi data.

Aplikasi ini dibuat sebagai bagian dari pemenuhan tugas Ujian Tengah Semester (UTS) mata kuliah Statistika.

## Fitur Utama

### 1. Input Data

Pengguna dapat memasukkan data melalui dua metode:

- Input Manual: Memasukkan sekumpulan angka secara langsung.
- Upload CSV: Mengunggah file CSV yang berisi data.
- Pemisah Data: Mendukung pemisah koma, titik koma, spasi, dan baris baru sesuai implementasi parser.
- Preview Data: Menampilkan pratinjau data sebelum dilakukan perhitungan.

### 2. Pengolahan Data

- Membaca dan memproses data numerik.
- Menghitung jumlah data yang dimasukkan.
- Mengurutkan data dari nilai terkecil hingga terbesar.
- Memproses data sebagai dasar analisis statistik.

### 3. Perhitungan Statistik Deskriptif

Aplikasi menyediakan berbagai perhitungan statistik deskriptif, meliputi:

| No. | Ukuran Statistik | Keterangan |
|---|---|---|
| 1 | Jumlah Data (n) | Banyaknya data yang dianalisis |
| 2 | Total Data (Σx) | Jumlah keseluruhan nilai |
| 3 | Mean | Nilai rata-rata |
| 4 | Median | Nilai tengah setelah data diurutkan |
| 5 | Modus | Nilai yang paling sering muncul |
| 6 | Minimum | Nilai terkecil |
| 7 | Maksimum | Nilai terbesar |
| 8 | Range | Selisih nilai maksimum dan minimum |
| 9 | Varians Sampel | Tingkat penyebaran data sampel |
| 10 | Varians Populasi | Tingkat penyebaran data populasi |
| 11 | Standar Deviasi Sampel | Simpangan baku sampel |
| 12 | Standar Deviasi Populasi | Simpangan baku populasi |
| 13 | Kuartil | Q1, Q2, dan Q3 |
| 14 | Interquartile Range | Selisih antara Q3 dan Q1 |

### 4. Visualisasi Data

Visualisasi digunakan untuk membantu pengguna memahami karakteristik dan distribusi data.

Visualisasi yang disediakan mengikuti modul visualisasi aplikasi, meliputi:

- Histogram untuk melihat distribusi frekuensi data.
- Box Plot untuk melihat persebaran data dan mendeteksi pencilan.
- Grafik distribusi frekuensi untuk menggambarkan jumlah data pada setiap interval kelas.

### 5. Tabel Distribusi Frekuensi

Aplikasi menyediakan tabel distribusi frekuensi yang berisi:

- Interval kelas.
- Batas bawah dan batas atas kelas.
- Nilai tengah kelas.
- Frekuensi absolut.
- Frekuensi relatif.
- Frekuensi kumulatif.

### 6. Deteksi Outlier

Aplikasi dapat membantu mengidentifikasi nilai pencilan (outlier) menggunakan metode Interquartile Range (IQR).

Perhitungan menggunakan rumus:

- IQR = Q3 - Q1
- Batas bawah = Q1 - (1,5 × IQR)
- Batas atas = Q3 + (1,5 × IQR)

Data yang berada di luar batas tersebut dapat dikategorikan sebagai outlier.

### 7. Export dan Cetak Hasil

Aplikasi menyediakan fitur untuk menyimpan dan mencetak hasil analisis, sesuai fungsi yang tersedia pada modul ekspor:

- Export hasil perhitungan ke CSV.
- Mencetak laporan.
- Menyimpan hasil melalui fitur cetak browser sebagai PDF.
- Menampilkan data yang telah diurutkan.

---

## Teknologi yang Digunakan

Teknologi yang digunakan dalam pengembangan aplikasi:

- HTML5: Membuat struktur halaman aplikasi.
- CSS3: Mengatur tampilan dan desain antarmuka.
- JavaScript ES6+: Mengelola input, proses perhitungan, dan interaksi aplikasi.
- CSV: Format file untuk pertukaran data.

Library tambahan mengikuti konfigurasi yang digunakan pada file `index.html`.

---

## Struktur Folder

```text
Project_UTS_Statistika_Soal_1_Kelompok_1/
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

## Cara Menjalankan Aplikasi

1. Download atau clone repository proyek.
2. Ekstrak folder proyek apabila masih berbentuk ZIP.
3. Buka folder `Project_UTS_Statistika_Soal_1_Kelompok_1` menggunakan Visual Studio Code.
4. Pastikan seluruh folder dan file berada pada struktur yang sesuai.
5. Jalankan aplikasi menggunakan Live Server.
6. Buka halaman `index.html` melalui browser.

Catatan: Karena aplikasi menggunakan file HTML terpisah di dalam folder `partials`, disarankan menjalankannya melalui Live Server agar proses pemuatan file berjalan dengan baik.

## Contoh Penggunaan

1. Buka aplikasi melalui browser.
2. Masukkan data numerik secara manual atau unggah file CSV.
3. Periksa data yang telah dimasukkan.
4. Jalankan proses perhitungan.
5. Lihat hasil statistik deskriptif pada dashboard.
6. Amati grafik dan tabel distribusi frekuensi.
7. Gunakan fitur export atau cetak apabila diperlukan.

## Tujuan Pembuatan

Pembuatan aplikasi ini bertujuan untuk:

- Mempermudah proses perhitungan statistik deskriptif.
- Mengurangi kesalahan dalam perhitungan manual.
- Membantu memahami konsep dasar statistika.
- Menampilkan hasil analisis dalam bentuk tabel dan grafik.
- Menerapkan pemrograman modular dalam pengembangan aplikasi web.
- Mengembangkan kemampuan kerja sama tim dalam menyelesaikan proyek pemrograman.

---

## Penutup

Project UTS Statistika Soal 1 Kelompok 1 dibuat sebagai bentuk penerapan materi statistika deskriptif ke dalam sebuah aplikasi berbasis web. Melalui aplikasi ini, proses pengolahan data diharapkan menjadi lebih mudah, cepat, dan terstruktur.

**Project UTS Statistika Soal 1 Kelompok 1**

Dibuat untuk memenuhi tugas Ujian Tengah Semester mata kuliah Statistika.
