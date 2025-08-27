-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 27 Agu 2025 pada 04.20
-- Versi server: 8.0.30
-- Versi PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_pesantren`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `absensi`
--

CREATE TABLE `absensi` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('Hadir','Izin','Sakit','Alpha') NOT NULL,
  `keterangan` text,
  `dibuat_oleh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `absensi`
--

INSERT INTO `absensi` (`id`, `santri_id`, `tanggal`, `status`, `keterangan`, `dibuat_oleh`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-01-01', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 1, '2025-01-02', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 1, '2025-01-03', 'Izin', 'Izin sakit demam', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 1, '2025-01-04', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 1, '2025-01-05', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 2, '2025-01-01', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 2, '2025-01-02', 'Alpha', 'Tidak ada keterangan', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 2, '2025-01-03', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 2, '2025-01-04', 'Sakit', 'Sakit flu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(10, 2, '2025-01-05', 'Hadir', 'Hadir tepat waktu', 2, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(11, 6, '2025-07-28', 'Hadir', 'hadir dibelakang pom', 1, '2025-07-28 15:24:18', '2025-07-29 02:29:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `asrama`
--

CREATE TABLE `asrama` (
  `id` int NOT NULL,
  `nama_asrama` varchar(100) NOT NULL,
  `kode_asrama` varchar(20) NOT NULL,
  `kapasitas` int NOT NULL,
  `lokasi` varchar(200) DEFAULT NULL,
  `jenis` enum('Putra','Putri') NOT NULL,
  `penanggung_jawab_id` int DEFAULT NULL,
  `fasilitas` text,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `asrama`
--

INSERT INTO `asrama` (`id`, `nama_asrama`, `kode_asrama`, `kapasitas`, `lokasi`, `jenis`, `penanggung_jawab_id`, `fasilitas`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Asrama Al-Ikhlas', 'ASR001', 50, 'Blok A Lantai 1', 'Putra', 1, 'AC, WiFi, Kamar Mandi Dalam, Lemari', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 'Asrama At-Taqwa', 'ASR002', 45, 'Blok A Lantai 2', 'Putra', 2, 'AC, WiFi, Kamar Mandi Dalam, Lemari', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 'Asrama Ar-Rahman', 'ASR003', 40, 'Blok B Lantai 1', 'Putri', 4, 'AC, WiFi, Kamar Mandi Dalam, Lemari, Cermin', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 'Asrama As-Sakinah', 'ASR004', 42, 'Blok B Lantai 2', 'Putri', 5, 'AC, WiFi, Kamar Mandi Dalam, Lemari, Cermin', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 'Asrama Al-Barokah', 'ASR005', 35, 'Blok C', 'Putra', 3, 'Kipas Angin, WiFi, Kamar Mandi Luar, Lemari', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal_pelajaran`
--

CREATE TABLE `jadwal_pelajaran` (
  `id` int NOT NULL,
  `kelas_id` int NOT NULL,
  `mapel_id` int NOT NULL,
  `ustadz_id` int NOT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `ruangan` varchar(50) DEFAULT NULL,
  `tahun_ajaran` varchar(10) DEFAULT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `jadwal_pelajaran`
--

INSERT INTO `jadwal_pelajaran` (`id`, `kelas_id`, `mapel_id`, `ustadz_id`, `hari`, `jam_mulai`, `jam_selesai`, `ruangan`, `tahun_ajaran`, `semester`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Senin', '07:00:00', '08:30:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 1, 5, 3, 'Senin', '08:45:00', '10:15:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 1, 6, 4, 'Senin', '10:30:00', '12:00:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 1, 4, 5, 'Senin', '13:00:00', '14:30:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 1, 2, 2, 'Selasa', '07:00:00', '08:30:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 1, 7, 4, 'Selasa', '08:45:00', '10:15:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 1, 8, 3, 'Selasa', '10:30:00', '12:00:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 1, 3, 1, 'Rabu', '07:00:00', '08:30:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 1, 9, 3, 'Rabu', '08:45:00', '10:15:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(10, 1, 10, 4, 'Rabu', '10:30:00', '12:00:00', 'Ruang 101', '2023/2024', 'Ganjil', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id` int NOT NULL,
  `kode_kelas` varchar(20) NOT NULL,
  `nama_kelas` varchar(100) NOT NULL,
  `tingkat` enum('1','2','3','4','5','6') NOT NULL,
  `wali_kelas_id` int DEFAULT NULL,
  `kapasitas` int DEFAULT '30',
  `keterangan` text,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `kelas`
--

INSERT INTO `kelas` (`id`, `kode_kelas`, `nama_kelas`, `tingkat`, `wali_kelas_id`, `kapasitas`, `keterangan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'K001', 'Kelas 1A', '1', 1, 25, 'Kelas tingkat 1 putra', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 'K002', 'Kelas 1B', '1', 2, 25, 'Kelas tingkat 1 putra', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 'K003', 'Kelas 1C', '1', 4, 25, 'Kelas tingkat 1 putri', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 'K004', 'Kelas 2A', '2', 3, 30, 'Kelas tingkat 2 putra', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 'K005', 'Kelas 2B', '2', 5, 30, 'Kelas tingkat 2 putri', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 'K006', 'Kelas 3A', '3', 1, 28, 'Kelas tingkat 3 putra', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 'K007', 'Kelas 3B', '3', 4, 28, 'Kelas tingkat 3 putri', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 'K0010', 'Kelas 10 B', '1', NULL, 30, 'Kelas tingkat 10 Putra', 'Aktif', '2025-07-29 02:14:03', '2025-07-29 02:14:03');

-- --------------------------------------------------------

--
-- Struktur dari tabel `keuangan`
--

CREATE TABLE `keuangan` (
  `id` int NOT NULL,
  `santri_id` int DEFAULT NULL,
  `kode_transaksi` varchar(50) NOT NULL,
  `jenis_transaksi` enum('Pemasukan','Pengeluaran') NOT NULL,
  `kategori` enum('SPP','Daftar Ulang','Seragam','Makan','Asrama','Lainnya') NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `tanggal_transaksi` date NOT NULL,
  `metode_pembayaran` enum('Tunai','Transfer','Debit','Kredit') DEFAULT 'Tunai',
  `keterangan` text,
  `bukti_pembayaran` text,
  `status` enum('Pending','Berhasil','Gagal') DEFAULT 'Pending',
  `diproses_oleh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `keuangan`
--

INSERT INTO `keuangan` (`id`, `santri_id`, `kode_transaksi`, `jenis_transaksi`, `kategori`, `jumlah`, `tanggal_transaksi`, `metode_pembayaran`, `keterangan`, `bukti_pembayaran`, `status`, `diproses_oleh`, `created_at`, `updated_at`) VALUES
(1, 1, 'TRX20250101001', 'Pemasukan', 'SPP', 500000.00, '2025-01-01', 'Transfer', 'Pembayaran SPP Januari 2025', NULL, 'Berhasil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 1, 'TRX20250101002', 'Pemasukan', 'Makan', 300000.00, '2025-01-01', 'Transfer', 'Pembayaran makan Januari 2025', NULL, 'Berhasil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 2, 'TRX20250101003', 'Pemasukan', 'SPP', 500000.00, '2025-01-02', 'Tunai', 'Pembayaran SPP Januari 2025', NULL, 'Berhasil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 3, 'TRX20250101004', 'Pemasukan', 'Daftar Ulang', 1000000.00, '2025-01-01', 'Transfer', 'Daftar ulang tahun ajaran 2024/2025', NULL, 'Berhasil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `komunikasi`
--

CREATE TABLE `komunikasi` (
  `id` int NOT NULL,
  `pengirim_id` int NOT NULL,
  `penerima_id` int NOT NULL,
  `judul` varchar(200) NOT NULL,
  `pesan` text NOT NULL,
  `tipe` enum('Pribadi','Umum','Kelas','Pengumuman') DEFAULT 'Pribadi',
  `kelas_id` int DEFAULT NULL,
  `lampiran` text,
  `status` enum('Terkirim','Dibaca','Dibalas') DEFAULT 'Terkirim',
  `tanggal_baca` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `laporan`
--

CREATE TABLE `laporan` (
  `id` int NOT NULL,
  `jenis_laporan` enum('Santri','Ustadz','Asrama','Keuangan','Absensi','Nilai','Tahfidz') NOT NULL,
  `periode_dari` date NOT NULL,
  `periode_sampai` date NOT NULL,
  `filter_data` json DEFAULT NULL,
  `data_laporan` json DEFAULT NULL,
  `dibuat_oleh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `aksi` varchar(100) NOT NULL,
  `tabel_target` varchar(50) DEFAULT NULL,
  `id_target` int DEFAULT NULL,
  `data_lama` json DEFAULT NULL,
  `data_baru` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mata_pelajaran`
--

CREATE TABLE `mata_pelajaran` (
  `id` int NOT NULL,
  `kode_mapel` varchar(20) NOT NULL,
  `nama_mapel` varchar(100) NOT NULL,
  `deskripsi` text,
  `sks` int DEFAULT '1',
  `kkm` int DEFAULT '75',
  `kategori` enum('Umum','Agama','Tahfidz','Keterampilan') DEFAULT 'Umum',
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `mata_pelajaran`
--

INSERT INTO `mata_pelajaran` (`id`, `kode_mapel`, `nama_mapel`, `deskripsi`, `sks`, `kkm`, `kategori`, `status`, `created_at`, `updated_at`) VALUES
(1, 'AL001', 'Al-Quran dan Hadits', 'Pembelajaran Al-Quran dan Hadits', 1, 75, 'Agama', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 'FIQ001', 'Fiqih', 'Pembelajaran Fiqih', 1, 75, 'Agama', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 'AKH001', 'Akhlaq', 'Pembelajaran Akhlaq dan Tasawuf', 1, 75, 'Agama', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 'THF001', 'Tahfidz Quran', 'Hafalan Al-Quran', 1, 75, 'Tahfidz', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 'MTK001', 'Matematika', 'Pembelajaran Matematika', 1, 75, 'Umum', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 'BIN001', 'Bahasa Indonesia', 'Pembelajaran Bahasa Indonesia', 1, 75, 'Umum', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 'BING001', 'Bahasa Inggris', 'Pembelajaran Bahasa Inggris', 1, 75, 'Umum', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 'IPA001', 'IPA', 'Ilmu Pengetahuan Alam', 1, 75, 'Umum', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 'IPS001', 'IPS', 'Ilmu Pengetahuan Sosial', 1, 75, 'Umum', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(10, 'KTK001', 'Keterampilan', 'Pembelajaran Keterampilan Hidup', 1, 75, 'Keterampilan', 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(11, '0203', 'Bahasa jepang', '', 1, 75, 'Umum', 'Aktif', '2025-07-29 02:30:09', '2025-07-29 02:30:09'),
(12, '875df', 'bahasa inffris', '', 1, 75, 'Umum', 'Aktif', '2025-07-29 02:34:50', '2025-07-29 02:34:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `nilai`
--

CREATE TABLE `nilai` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `mapel_id` int NOT NULL,
  `jenis_nilai` enum('Tugas','UTS','UAS','Praktik','Hafalan') NOT NULL,
  `nilai` decimal(5,2) NOT NULL,
  `kkm` int DEFAULT '75',
  `bobot` decimal(3,2) DEFAULT '1.00',
  `keterangan` text,
  `tahun_ajaran` varchar(10) DEFAULT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `dibuat_oleh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `nilai`
--

INSERT INTO `nilai` (`id`, `santri_id`, `mapel_id`, `jenis_nilai`, `nilai`, `kkm`, `bobot`, `keterangan`, `tahun_ajaran`, `semester`, `dibuat_oleh`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'UTS', 85.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 1, 1, 'UAS', 88.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 1, 5, 'UTS', 78.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 3, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 1, 5, 'UAS', 82.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 3, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 1, 6, 'UTS', 90.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 4, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 1, 6, 'UAS', 92.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 4, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 2, 1, 'UTS', 75.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 2, 1, 'UAS', 80.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 1, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 2, 5, 'UTS', 85.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 3, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(10, 2, 5, 'UAS', 87.00, 75, 1.00, NULL, '2023/2024', 'Ganjil', 3, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(11, 9, 7, 'UTS', 86.00, 75, 1.00, '', '2024/2025', 'Ganjil', 1, '2025-07-29 07:42:42', '2025-07-29 07:42:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasi_nilai`
--

CREATE TABLE `notifikasi_nilai` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `nilai_id` int NOT NULL,
  `pesan` text NOT NULL,
  `status` enum('Belum Dibaca','Sudah Dibaca') DEFAULT 'Belum Dibaca',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `notifikasi_nilai`
--

INSERT INTO `notifikasi_nilai` (`id`, `santri_id`, `nilai_id`, `pesan`, `status`, `created_at`, `updated_at`) VALUES
(1, 9, 11, 'Nilai baru telah diinput untuk mata pelajaran Bahasa Inggris. Jenis: UTS, Nilai: 86.00, KKM: 75, Status: Tuntas', 'Belum Dibaca', '2025-07-29 07:42:42', '2025-07-29 07:42:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelanggaran`
--

CREATE TABLE `pelanggaran` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `jenis_pelanggaran` varchar(200) NOT NULL,
  `deskripsi` text NOT NULL,
  `tanggal_pelanggaran` date NOT NULL,
  `sanksi` text,
  `poin_pelanggaran` int DEFAULT '0',
  `status` enum('Ringan','Sedang','Berat') DEFAULT 'Ringan',
  `dilaporkan_oleh` int DEFAULT NULL,
  `ditangani_oleh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pendaftar_psb`
--

CREATE TABLE `pendaftar_psb` (
  `id` int NOT NULL,
  `psb_id` int NOT NULL,
  `nomor_pendaftaran` varchar(50) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `asal_sekolah` varchar(100) DEFAULT NULL,
  `nama_ayah` varchar(100) DEFAULT NULL,
  `nama_ibu` varchar(100) DEFAULT NULL,
  `pekerjaan_ayah` varchar(100) DEFAULT NULL,
  `pekerjaan_ibu` varchar(100) DEFAULT NULL,
  `penghasilan_orangtua` enum('< 1 Juta','1-3 Juta','3-5 Juta','> 5 Juta') DEFAULT NULL,
  `foto` text,
  `berkas_pendukung` text,
  `status` enum('Daftar','Lulus Seleksi','Tidak Lulus','Diterima','Tidak Diterima') DEFAULT 'Daftar',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengaturan_web`
--

CREATE TABLE `pengaturan_web` (
  `id` int NOT NULL,
  `judul_web` varchar(255) DEFAULT NULL,
  `tagline_web` varchar(255) DEFAULT NULL,
  `caption_web` text,
  `tentang_web` text,
  `footer_web` text,
  `logo_web` longtext,
  `nama_instansi` varchar(255) DEFAULT NULL,
  `nama_pimpinan` varchar(255) DEFAULT NULL,
  `nik_pimpinan` varchar(50) DEFAULT NULL,
  `alamat_instansi` text,
  `email_instansi` varchar(255) DEFAULT NULL,
  `telp` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `pengaturan_web`
--

INSERT INTO `pengaturan_web` (`id`, `judul_web`, `tagline_web`, `caption_web`, `tentang_web`, `footer_web`, `logo_web`, `nama_instansi`, `nama_pimpinan`, `nik_pimpinan`, `alamat_instansi`, `email_instansi`, `telp`, `whatsapp`, `created_at`, `updated_at`) VALUES
(1, 'Pondok Pesantren Walisongo', 'Mendidik Generasi Qurani dan Berkarakter', 'Membentuk santri yang beriman, bertaqwa, dan berakhlak mulia', 'Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berdedikasi untuk membentuk generasi yang beriman, bertaqwa, dan berakhlak mulia.', 'Copyright © 2025 Pondok Pesantren Walisongo. All rights reserved.', NULL, 'Pondok Pesantren Walisongo', 'KH. Abdullah Walisongo', '1234567890123456', 'Jl. Pesantren No. 123, Lampung Utara', 'info@pesantrenwalisongo.com', '0724-123456', '081234567890', '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id` int NOT NULL,
  `judul` varchar(200) NOT NULL,
  `konten` text NOT NULL,
  `prioritas` enum('Rendah','Sedang','Tinggi','Urgent') DEFAULT 'Sedang',
  `target_role` enum('admin','pengajar','santri','all') DEFAULT 'all',
  `kelas_id` int DEFAULT NULL,
  `lampiran` text,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `dibuat_oleh` int NOT NULL,
  `status` enum('Draft','Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `psb`
--

CREATE TABLE `psb` (
  `id` int NOT NULL,
  `tahun_ajaran` varchar(10) NOT NULL,
  `tanggal_buka` date NOT NULL,
  `tanggal_tutup` date NOT NULL,
  `kuota_putra` int DEFAULT '0',
  `kuota_putri` int DEFAULT '0',
  `biaya_pendaftaran` decimal(15,2) DEFAULT NULL,
  `persyaratan` text,
  `kontak_panitia` varchar(20) DEFAULT NULL,
  `email_panitia` varchar(100) DEFAULT NULL,
  `status` enum('Dibuka','Ditutup','Selesai') DEFAULT 'Dibuka',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `psb`
--

INSERT INTO `psb` (`id`, `tahun_ajaran`, `tanggal_buka`, `tanggal_tutup`, `kuota_putra`, `kuota_putri`, `biaya_pendaftaran`, `persyaratan`, `kontak_panitia`, `email_panitia`, `status`, `created_at`, `updated_at`) VALUES
(1, '2024/2025', '2024-03-01', '2024-06-30', 100, 80, 250000.00, '1. Fotokopi ijazah SD/MI yang telah dilegalisir\n2. Fotokopi SKHUN yang telah dilegalisir\n3. Fotokopi akta kelahiran\n4. Fotokopi kartu keluarga\n5. Pas foto 3x4 sebanyak 4 lembar\n6. Surat keterangan sehat dari dokter\n7. Surat pernyataan sanggup mengikuti peraturan pesantren', '081234567890', 'psb@pesantrenwalisongo.com', 'Dibuka', '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `santri`
--

CREATE TABLE `santri` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `foto` text,
  `nama` varchar(100) NOT NULL,
  `nis` varchar(30) NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `asal_sekolah` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `nama_wali` varchar(100) DEFAULT NULL,
  `no_hp_wali` varchar(20) DEFAULT NULL,
  `pekerjaan_wali` varchar(100) DEFAULT NULL,
  `alamat_wali` text,
  `telepon_wali` varchar(20) DEFAULT NULL,
  `status` enum('Aktif','Nonaktif','Lulus','Keluar') DEFAULT 'Aktif',
  `tanggal_masuk` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `santri`
--

INSERT INTO `santri` (`id`, `user_id`, `foto`, `nama`, `nis`, `jenis_kelamin`, `asal_sekolah`, `tanggal_lahir`, `alamat`, `telepon`, `nama_wali`, `no_hp_wali`, `pekerjaan_wali`, `alamat_wali`, `telepon_wali`, `status`, `tanggal_masuk`, `created_at`, `updated_at`) VALUES
(1, 7, NULL, 'Ahmad Fauzi Santoso', '2023001', 'Laki-laki', 'SMP Negeri 1 Metro', '2008-05-15', 'Jl. Merdeka No. 123, Metro', '081234567801', 'Budi Santoso', NULL, 'Petani', 'Jl. Merdeka No. 123, Metro', '081234567801', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 8, NULL, 'Muhammad Rizki Pratama', '2023002', 'Laki-laki', 'SMP Negeri 2 Bandar Lampung', '2008-08-20', 'Jl. Kartini No. 45, Bandar Lampung', '081234567802', 'Andi Pratama', NULL, 'Pedagang', 'Jl. Kartini No. 45, Bandar Lampung', '081234567802', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 9, NULL, 'Siti Aminah Putri', '2023003', 'Perempuan', 'SMP Negeri 3 Way Kanan', '2008-03-10', 'Jl. Diponegoro No. 67, Way Kanan', '081234567803', 'Hasan Basri', NULL, 'Guru', 'Jl. Diponegoro No. 67, Way Kanan', '081234567803', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 10, NULL, 'Fatimah Zahra', '2023004', 'Perempuan', 'SMP Islam Terpadu', '2008-12-05', 'Jl. Ahmad Yani No. 89, Lampung Utara', '081234567804', 'Abdullah Rahman', NULL, 'Wiraswasta', 'Jl. Ahmad Yani No. 89, Lampung Utara', '081234567804', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 11, NULL, 'Ali Akbar Maulana', '2023005', 'Laki-laki', 'SMP Negeri 4 Tulang Bawang', '2009-01-18', 'Jl. Sudirman No. 12, Tulang Bawang', '081234567805', 'Maulana Malik', NULL, 'Buruh', 'Jl. Sudirman No. 12, Tulang Bawang', '081234567805', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 12, NULL, 'Khadijah Aisyah', '2023006', 'Perempuan', 'SMP Negeri 5 Pringsewu', '2008-09-22', 'Jl. Gajah Mada No. 34, Pringsewu', '081234567806', 'Umar Faruq', NULL, 'PNS', 'Jl. Gajah Mada No. 34, Pringsewu', '081234567806', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 13, NULL, 'Ibrahim Khalil', '2023007', 'Laki-laki', 'SMP Negeri 6 Lampung Selatan', '2008-11-30', 'Jl. Pahlawan No. 56, Lampung Selatan', '081234567807', 'Khalil Ahmad', NULL, 'Petani', 'Jl. Pahlawan No. 56, Lampung Selatan', '081234567807', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 14, NULL, 'Maryam Salsabila', '2023008', 'Perempuan', 'SMP Negeri 7 Tanggamus', '2008-07-14', 'Jl. Veteran No. 78, Tanggamus', '081234567808', 'Salim Usman', NULL, 'Sopir', 'Jl. Veteran No. 78, Tanggamus', '081234567808', 'Aktif', '2023-07-01', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 16, '', 'santri tambahan', '10773', 'Laki-laki', 'SMP 23 Metro', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Aktif', '2025-07-29', '2025-07-29 02:10:59', '2025-07-29 02:33:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `santri_asrama`
--

CREATE TABLE `santri_asrama` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `asrama_id` int NOT NULL,
  `nomor_kamar` varchar(10) DEFAULT NULL,
  `tanggal_masuk` date NOT NULL,
  `tanggal_keluar` date DEFAULT NULL,
  `status` enum('Aktif','Pindah','Keluar') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `santri_asrama`
--

INSERT INTO `santri_asrama` (`id`, `santri_id`, `asrama_id`, `nomor_kamar`, `tanggal_masuk`, `tanggal_keluar`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'A101', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 2, 1, 'A102', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 3, 3, 'B101', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 4, 3, 'B102', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 5, 2, 'A201', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 6, 4, 'B201', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 7, 5, 'C101', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 8, 4, 'B202', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `santri_kelas`
--

CREATE TABLE `santri_kelas` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `kelas_id` int NOT NULL,
  `tahun_ajaran` varchar(10) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `tanggal_keluar` date DEFAULT NULL,
  `status` enum('Aktif','Pindah','Lulus','Keluar') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `santri_kelas`
--

INSERT INTO `santri_kelas` (`id`, `santri_id`, `kelas_id`, `tahun_ajaran`, `semester`, `tanggal_masuk`, `tanggal_keluar`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 2, 1, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 3, 3, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 4, 3, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 5, 2, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 6, 5, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 7, 4, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 8, 5, '2023/2024', 'Ganjil', '2023-07-01', NULL, 'Aktif', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 3, 1, '2025/2026', 'Ganjil', '2025-07-29', '2025-07-29', 'Pindah', '2025-07-29 08:34:15', '2025-07-29 08:34:26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_izin_keluar`
--

CREATE TABLE `surat_izin_keluar` (
  `id` int NOT NULL,
  `nomor_surat` varchar(50) NOT NULL,
  `santri_id` int NOT NULL,
  `jenis_izin` enum('Sakit','Keperluan Keluarga','Urusan Penting','Lainnya') NOT NULL,
  `tanggal_keluar` date NOT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `jam_keluar` time DEFAULT NULL,
  `jam_masuk` time DEFAULT NULL,
  `tujuan` text,
  `keperluan` text NOT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `telepon_penanggung_jawab` varchar(20) DEFAULT NULL,
  `status` enum('Diajukan','Disetujui','Ditolak','Selesai') DEFAULT 'Diajukan',
  `disetujui_oleh` int DEFAULT NULL,
  `catatan_persetujuan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `surat_izin_keluar`
--

INSERT INTO `surat_izin_keluar` (`id`, `nomor_surat`, `santri_id`, `jenis_izin`, `tanggal_keluar`, `tanggal_masuk`, `jam_keluar`, `jam_masuk`, `tujuan`, `keperluan`, `penanggung_jawab`, `telepon_penanggung_jawab`, `status`, `disetujui_oleh`, `catatan_persetujuan`, `created_at`, `updated_at`) VALUES
(1, 'SI/001/PST/07/2025', 4, 'Keperluan Keluarga', '2025-07-22', '2025-07-30', NULL, NULL, 'yuuf', 'lugg', '', '08123456789', 'Disetujui', NULL, NULL, '2025-07-29 06:56:06', '2025-07-29 06:56:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tahfidz`
--

CREATE TABLE `tahfidz` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `surat` varchar(100) NOT NULL,
  `ayat_mulai` int NOT NULL,
  `ayat_selesai` int NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `target_selesai` date DEFAULT NULL,
  `status` enum('Belum Mulai','Sedang Hafalan','Selesai','Revisi') DEFAULT 'Belum Mulai',
  `nilai_hafalan` enum('A','B','C','D','E') DEFAULT NULL,
  `keterangan` text,
  `pembimbing_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `tahfidz`
--

INSERT INTO `tahfidz` (`id`, `santri_id`, `surat`, `ayat_mulai`, `ayat_selesai`, `tanggal_mulai`, `tanggal_selesai`, `target_selesai`, `status`, `nilai_hafalan`, `keterangan`, `pembimbing_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'Al-Baqarah', 1, 50, '2023-08-01', '2023-09-15', NULL, 'Selesai', 'A', NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 1, 'Al-Baqarah', 51, 100, '2023-09-16', '2023-11-01', NULL, 'Selesai', 'B', NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 1, 'Al-Baqarah', 101, 150, '2023-11-02', NULL, NULL, 'Sedang Hafalan', NULL, NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 2, 'Al-Fatihah', 1, 7, '2023-08-01', '2023-08-15', NULL, 'Selesai', 'A', NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 2, 'Al-Baqarah', 1, 25, '2023-08-16', '2023-09-30', NULL, 'Selesai', 'B', NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 3, 'Al-Fatihah', 1, 7, '2023-08-01', '2023-08-20', NULL, 'Selesai', 'A', NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 3, 'Al-Baqarah', 1, 30, '2023-08-21', NULL, NULL, 'Sedang Hafalan', NULL, NULL, 5, '2025-07-14 10:50:37', '2025-07-14 10:50:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','pengajar','santri') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'admin', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 'ustadz1@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'pengajar', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 'ustadz2@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'pengajar', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 'ustadz3@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'pengajar', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 'ustadzah1@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'pengajar', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(6, 'ustadzah2@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'pengajar', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(7, 'santri1@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(8, 'santri2@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(9, 'santri3@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(10, 'santri4@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(11, 'santri5@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(12, 'santri6@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(13, 'santri7@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(14, 'santri8@pesantren.com', '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'santri', '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(16, '10773@pesantren.com', '$2y$10$WoVLF/qCN/b3sIL7eoUE5u4eODjEkuSZkvWMdnx2HhZ0D4GF97EHC', 'santri', '2025-07-29 02:10:59', '2025-07-29 02:10:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ustadz`
--

CREATE TABLE `ustadz` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `foto` text,
  `nama` varchar(100) NOT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pendidikan_terakhir` varchar(100) DEFAULT NULL,
  `bidang_keahlian` varchar(100) DEFAULT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `tanggal_bergabung` date DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `ustadz`
--

INSERT INTO `ustadz` (`id`, `user_id`, `foto`, `nama`, `nik`, `jenis_kelamin`, `tempat_lahir`, `tanggal_lahir`, `alamat`, `telepon`, `email`, `pendidikan_terakhir`, `bidang_keahlian`, `status`, `tanggal_bergabung`, `tanggal_masuk`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, 'Ustadz Ahmad Fauzi', '3518041985121001', 'Laki-laki', 'Lampung', '1985-12-10', 'Jl. Pesantren No. 10', '081234567891', 'ustadz1@pesantren.com', 'S1 Pendidikan Agama Islam', 'Al-Quran dan Hadits', 'Aktif', '2020-01-01', NULL, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(2, 3, NULL, 'Ustadz Muhammad Rizki', '3518041987091002', 'Laki-laki', 'Palembang', '1987-09-15', 'Jl. Pesantren No. 11', '081234567892', 'ustadz2@pesantren.com', 'S2 Studi Islam', 'Fiqih dan Ushul Fiqih', 'Aktif', '2020-02-01', NULL, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(3, 4, NULL, 'Ustadz Abdullah Hakim', '3518041983051003', 'Laki-laki', 'Bandar Lampung', '1983-05-20', 'Jl. Pesantren No. 12', '081234567893', 'ustadz3@pesantren.com', 'S1 Matematika', 'Matematika dan IPA', 'Aktif', '2019-08-01', NULL, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(4, 5, NULL, 'Ustadzah Siti Aminah', '3518044988071004', 'Perempuan', 'Metro', '1988-07-25', 'Jl. Pesantren No. 13', '081234567894', 'ustadzah1@pesantren.com', 'S1 Pendidikan Bahasa', 'Bahasa Indonesia dan Inggris', 'Aktif', '2020-03-01', NULL, '2025-07-14 10:50:37', '2025-07-14 10:50:37'),
(5, 6, NULL, 'Ustadzah Fatimah Zahra', '3518044990111005', 'Perempuan', 'Way Kanan', '1990-11-12', 'Jl. Pesantren No. 14', '081234567895', 'ustadzah2@pesantren.com', 'S1 Tahfidz Quran', 'Tahfidz dan Qiroah', 'Aktif', '2021-01-01', NULL, '2025-07-14 10:50:37', '2025-07-14 10:50:37');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_santri_tanggal` (`santri_id`,`tanggal`),
  ADD KEY `dibuat_oleh` (`dibuat_oleh`);

--
-- Indeks untuk tabel `asrama`
--
ALTER TABLE `asrama`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_asrama` (`kode_asrama`),
  ADD KEY `penanggung_jawab_id` (`penanggung_jawab_id`),
  ADD KEY `idx_nama_asrama` (`nama_asrama`);

--
-- Indeks untuk tabel `jadwal_pelajaran`
--
ALTER TABLE `jadwal_pelajaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kelas_id` (`kelas_id`),
  ADD KEY `mapel_id` (`mapel_id`),
  ADD KEY `ustadz_id` (`ustadz_id`);

--
-- Indeks untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_kelas` (`kode_kelas`),
  ADD KEY `wali_kelas_id` (`wali_kelas_id`);

--
-- Indeks untuk tabel `keuangan`
--
ALTER TABLE `keuangan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_transaksi` (`kode_transaksi`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `diproses_oleh` (`diproses_oleh`);

--
-- Indeks untuk tabel `komunikasi`
--
ALTER TABLE `komunikasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengirim_id` (`pengirim_id`),
  ADD KEY `penerima_id` (`penerima_id`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indeks untuk tabel `laporan`
--
ALTER TABLE `laporan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dibuat_oleh` (`dibuat_oleh`);

--
-- Indeks untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_mapel` (`kode_mapel`),
  ADD KEY `idx_nama_mapel` (`nama_mapel`);

--
-- Indeks untuk tabel `nilai`
--
ALTER TABLE `nilai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `mapel_id` (`mapel_id`),
  ADD KEY `dibuat_oleh` (`dibuat_oleh`);

--
-- Indeks untuk tabel `notifikasi_nilai`
--
ALTER TABLE `notifikasi_nilai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `nilai_id` (`nilai_id`);

--
-- Indeks untuk tabel `pelanggaran`
--
ALTER TABLE `pelanggaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `dilaporkan_oleh` (`dilaporkan_oleh`),
  ADD KEY `ditangani_oleh` (`ditangani_oleh`);

--
-- Indeks untuk tabel `pendaftar_psb`
--
ALTER TABLE `pendaftar_psb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_pendaftaran` (`nomor_pendaftaran`),
  ADD KEY `psb_id` (`psb_id`);

--
-- Indeks untuk tabel `pengaturan_web`
--
ALTER TABLE `pengaturan_web`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dibuat_oleh` (`dibuat_oleh`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indeks untuk tabel `psb`
--
ALTER TABLE `psb`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `santri`
--
ALTER TABLE `santri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nis` (`nis`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_nama` (`nama`),
  ADD KEY `idx_status` (`status`);

--
-- Indeks untuk tabel `santri_asrama`
--
ALTER TABLE `santri_asrama`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `asrama_id` (`asrama_id`);

--
-- Indeks untuk tabel `santri_kelas`
--
ALTER TABLE `santri_kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_santri_kelas_tahun` (`santri_id`,`kelas_id`,`tahun_ajaran`,`semester`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indeks untuk tabel `surat_izin_keluar`
--
ALTER TABLE `surat_izin_keluar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_surat` (`nomor_surat`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `disetujui_oleh` (`disetujui_oleh`);

--
-- Indeks untuk tabel `tahfidz`
--
ALTER TABLE `tahfidz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `pembimbing_id` (`pembimbing_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `ustadz`
--
ALTER TABLE `ustadz`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik` (`nik`),
  ADD KEY `ustadz_ibfk_1` (`user_id`),
  ADD KEY `idx_nama` (`nama`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `asrama`
--
ALTER TABLE `asrama`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `jadwal_pelajaran`
--
ALTER TABLE `jadwal_pelajaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `keuangan`
--
ALTER TABLE `keuangan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `komunikasi`
--
ALTER TABLE `komunikasi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `nilai`
--
ALTER TABLE `nilai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `notifikasi_nilai`
--
ALTER TABLE `notifikasi_nilai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `pelanggaran`
--
ALTER TABLE `pelanggaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pendaftar_psb`
--
ALTER TABLE `pendaftar_psb`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pengaturan_web`
--
ALTER TABLE `pengaturan_web`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `psb`
--
ALTER TABLE `psb`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `santri`
--
ALTER TABLE `santri`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `santri_asrama`
--
ALTER TABLE `santri_asrama`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `santri_kelas`
--
ALTER TABLE `santri_kelas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `surat_izin_keluar`
--
ALTER TABLE `surat_izin_keluar`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tahfidz`
--
ALTER TABLE `tahfidz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `ustadz`
--
ALTER TABLE `ustadz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `absensi`
--
ALTER TABLE `absensi`
  ADD CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absensi_ibfk_2` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `asrama`
--
ALTER TABLE `asrama`
  ADD CONSTRAINT `asrama_ibfk_1` FOREIGN KEY (`penanggung_jawab_id`) REFERENCES `ustadz` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `jadwal_pelajaran`
--
ALTER TABLE `jadwal_pelajaran`
  ADD CONSTRAINT `jadwal_pelajaran_ibfk_1` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_pelajaran_ibfk_2` FOREIGN KEY (`mapel_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_pelajaran_ibfk_3` FOREIGN KEY (`ustadz_id`) REFERENCES `ustadz` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`wali_kelas_id`) REFERENCES `ustadz` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `keuangan`
--
ALTER TABLE `keuangan`
  ADD CONSTRAINT `keuangan_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `keuangan_ibfk_2` FOREIGN KEY (`diproses_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `komunikasi`
--
ALTER TABLE `komunikasi`
  ADD CONSTRAINT `komunikasi_ibfk_1` FOREIGN KEY (`pengirim_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `komunikasi_ibfk_2` FOREIGN KEY (`penerima_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `komunikasi_ibfk_3` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `laporan`
--
ALTER TABLE `laporan`
  ADD CONSTRAINT `laporan_ibfk_1` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD CONSTRAINT `log_aktivitas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `nilai`
--
ALTER TABLE `nilai`
  ADD CONSTRAINT `nilai_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nilai_ibfk_2` FOREIGN KEY (`mapel_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nilai_ibfk_3` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `notifikasi_nilai`
--
ALTER TABLE `notifikasi_nilai`
  ADD CONSTRAINT `notifikasi_nilai_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifikasi_nilai_ibfk_2` FOREIGN KEY (`nilai_id`) REFERENCES `nilai` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pelanggaran`
--
ALTER TABLE `pelanggaran`
  ADD CONSTRAINT `pelanggaran_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pelanggaran_ibfk_2` FOREIGN KEY (`dilaporkan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pelanggaran_ibfk_3` FOREIGN KEY (`ditangani_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pendaftar_psb`
--
ALTER TABLE `pendaftar_psb`
  ADD CONSTRAINT `pendaftar_psb_ibfk_1` FOREIGN KEY (`psb_id`) REFERENCES `psb` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD CONSTRAINT `pengumuman_ibfk_1` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengumuman_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `santri`
--
ALTER TABLE `santri`
  ADD CONSTRAINT `santri_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `santri_asrama`
--
ALTER TABLE `santri_asrama`
  ADD CONSTRAINT `santri_asrama_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `santri_asrama_ibfk_2` FOREIGN KEY (`asrama_id`) REFERENCES `asrama` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `santri_kelas`
--
ALTER TABLE `santri_kelas`
  ADD CONSTRAINT `santri_kelas_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `santri_kelas_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `surat_izin_keluar`
--
ALTER TABLE `surat_izin_keluar`
  ADD CONSTRAINT `surat_izin_keluar_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `surat_izin_keluar_ibfk_2` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `tahfidz`
--
ALTER TABLE `tahfidz`
  ADD CONSTRAINT `tahfidz_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tahfidz_ibfk_2` FOREIGN KEY (`pembimbing_id`) REFERENCES `ustadz` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `ustadz`
--
ALTER TABLE `ustadz`
  ADD CONSTRAINT `ustadz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
