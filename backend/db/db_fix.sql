

CREATE TABLE `absensi` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('Hadir','Izin','Sakit','Alpha') NOT NULL,
  `keterangan` text,
  `dibuat_oleh` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `absensi`
--

INSERT INTO `absensi` (`id`, `santri_id`, `tanggal`, `status`, `keterangan`, `dibuat_oleh`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-08-27', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(2, 1, '2025-08-26', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(3, 1, '2025-08-25', 'Izin', 'Sakit demam', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(4, 2, '2025-08-27', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(5, 2, '2025-08-26', 'Alpha', 'Tanpa keterangan', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(6, 2, '2025-08-25', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(7, 3, '2025-08-27', 'Sakit', 'Demam tinggi', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(8, 3, '2025-08-26', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(9, 3, '2025-08-25', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(10, 4, '2025-08-27', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(11, 4, '2025-08-26', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(12, 4, '2025-08-25', 'Izin', 'Keperluan keluarga', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(13, 5, '2025-08-27', 'Hadir', 'tepat waktu', 1, '2025-08-28 03:44:29', '2025-08-28 03:54:08'),
(14, 5, '2025-08-26', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29'),
(15, 5, '2025-08-25', 'Hadir', '', 1, '2025-08-28 03:44:29', '2025-08-28 03:44:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `asrama`
--

CREATE TABLE `asrama` (
  `id` int NOT NULL,
  `nama_asrama` varchar(100) NOT NULL,
  `kode_asrama` varchar(20) NOT NULL,
  `kapasitas` int NOT NULL DEFAULT '0',
  `lokasi` varchar(255) DEFAULT NULL,
  `jenis` enum('Putra','Putri') NOT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `fasilitas` text,
  `status` enum('Aktif','Tidak Aktif','Renovasi') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `asrama`
--

INSERT INTO `asrama` (`id`, `nama_asrama`, `kode_asrama`, `kapasitas`, `lokasi`, `jenis`, `penanggung_jawab`, `fasilitas`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Test Asrama Updated', 'TA01', 25, 'Lantai 2', 'Putra', 'Ustadz Budi', 'WiFi, AC', 'Aktif', '2025-08-27 09:55:23', '2025-08-27 09:55:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal_pelajaran`
--

CREATE TABLE `jadwal_pelajaran` (
  `id` int NOT NULL,
  `mapel_id` int NOT NULL,
  `ustadz_id` int NOT NULL,
  `kelas_id` int DEFAULT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `ruangan` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jadwal_pelajaran`
--

INSERT INTO `jadwal_pelajaran` (`id`, `mapel_id`, `ustadz_id`, `kelas_id`, `hari`, `jam_mulai`, `jam_selesai`, `ruangan`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Senin', '07:00:00', '08:30:00', 'Ruang A1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(2, 2, 2, 1, 'Senin', '08:30:00', '10:00:00', 'Ruang A2', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(3, 5, 3, 1, 'Senin', '10:15:00', '11:45:00', 'Ruang B1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(4, 7, 4, 1, 'Senin', '13:00:00', '14:30:00', 'Ruang B2', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(5, 12, 7, 1, 'Senin', '14:30:00', '16:00:00', 'Ruang C1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(6, 3, 1, 1, 'Selasa', '07:00:00', '08:30:00', 'Ruang A1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(7, 4, 2, 1, 'Selasa', '08:30:00', '10:00:00', 'Ruang A2', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(8, 8, 4, 1, 'Selasa', '10:15:00', '11:45:00', 'Ruang B1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(9, 6, 5, 2, 'Selasa', '13:00:00', '14:30:00', 'Ruang B2', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(10, 13, 6, 2, 'Selasa', '14:30:00', '16:00:00', 'Ruang C1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(11, 5, 3, 2, 'Rabu', '07:00:00', '08:30:00', 'Ruang A1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(12, 9, 4, 2, 'Rabu', '08:30:00', '10:00:00', 'Ruang A2', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(13, 1, 1, 2, 'Rabu', '10:15:00', '11:45:00', 'Ruang B1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(14, 10, 5, 2, 'Rabu', '13:00:00', '14:30:00', 'Ruang B2', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(15, 14, 6, 2, 'Rabu', '14:30:00', '16:00:00', 'Ruang C1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(16, 11, 5, 2, 'Kamis', '07:00:00', '08:30:00', 'Ruang A1', '2025-08-27 05:23:15', '2025-08-27 17:47:12'),
(17, 2, 2, 3, 'Kamis', '08:30:00', '10:00:00', 'Ruang A2', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(18, 6, 5, 3, 'Kamis', '10:15:00', '11:45:00', 'Ruang B1', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(19, 4, 2, 3, 'Kamis', '13:00:00', '14:30:00', 'Ruang B2', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(20, 12, 7, 3, 'Kamis', '14:30:00', '16:00:00', 'Ruang C1', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(21, 7, 6, 3, 'Jumat', '07:00:00', '08:30:00', 'Ruang A1', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(22, 3, 1, 3, 'Jumat', '08:30:00', '10:00:00', 'Ruang A2', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(23, 8, 4, 3, 'Jumat', '10:15:00', '11:45:00', 'Ruang B1', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(24, 12, 7, 3, 'Sabtu', '07:00:00', '08:30:00', 'Ruang C1', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(25, 13, 6, 3, 'Sabtu', '08:30:00', '10:00:00', 'Ruang C2', '2025-08-27 05:23:15', '2025-08-27 17:47:13'),
(26, 14, 6, 3, 'Sabtu', '10:15:00', '11:45:00', 'Ruang C3', '2025-08-27 05:23:15', '2025-08-27 17:47:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id` int NOT NULL,
  `nama_kelas` varchar(100) NOT NULL,
  `kode_kelas` varchar(20) NOT NULL,
  `kapasitas` int DEFAULT '30',
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kelas`
--

INSERT INTO `kelas` (`id`, `nama_kelas`, `kode_kelas`, `kapasitas`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Kelas 1A', 'K1A', 30, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(2, 'Kelas 1B', 'K1B', 30, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(3, 'Kelas 2A', 'K2A', 30, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(4, 'Kelas 2B', 'K2B', 30, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(5, 'Kelas 3A', 'K3A', 30, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(6, 'Kelas 3B', 'K3B', 30, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(7, 'Kelas 4A', 'K4A', 25, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(8, 'Kelas 5A', 'K5A', 25, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(9, 'Kelas 6A', 'K6A', 25, 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mata_pelajaran`
--

CREATE TABLE `mata_pelajaran` (
  `id` int NOT NULL,
  `kode_mapel` varchar(20) NOT NULL,
  `nama_mapel` varchar(100) NOT NULL,
  `kelas_id` int DEFAULT NULL,
  `keterangan` text,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mata_pelajaran`
--

INSERT INTO `mata_pelajaran` (`id`, `kode_mapel`, `nama_mapel`, `kelas_id`, `keterangan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'AQ001', 'Al-Quran dan Hadits', NULL, 'Pembelajaran Al-Quran dan Hadits', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(2, 'AK002', 'Akidah Akhlak', NULL, 'Pembelajaran Akidah dan Akhlak', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(3, 'FQ003', 'Fiqh', NULL, 'Pembelajaran Fiqh', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(4, 'SKI004', 'Sejarah Kebudayaan Islam', NULL, 'Pembelajaran Sejarah Kebudayaan Islam', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(5, 'BA005', 'Bahasa Arab', NULL, 'Pembelajaran Bahasa Arab', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(6, 'BI006', 'Bahasa Indonesia', NULL, 'Pembelajaran Bahasa Indonesia', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(7, 'BE007', 'Bahasa Inggris', NULL, 'Pembelajaran Bahasa Inggris', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(8, 'MAT008', 'Matematika', NULL, 'Pembelajaran Matematika', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(9, 'IPA009', 'Ilmu Pengetahuan Alam', NULL, 'Pembelajaran IPA', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(10, 'IPS010', 'Ilmu Pengetahuan Sosial', NULL, 'Pembelajaran IPS', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(11, 'PKN011', 'Pendidikan Kewarganegaraan', NULL, 'Pembelajaran PKN', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(12, 'THF012', 'Tahfidz Al-Quran', NULL, 'Hafalan Al-Quran', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(13, 'SEN013', 'Seni dan Budaya', NULL, 'Pembelajaran Seni dan Budaya', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(14, 'OLR014', 'Olahraga', NULL, 'Pendidikan Jasmani dan Olahraga', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `nilai`
--

CREATE TABLE `nilai` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `mapel_id` int NOT NULL,
  `jenis_nilai` enum('UTS','UAS','Tugas','Quiz','Praktek') NOT NULL,
  `nilai` decimal(5,2) NOT NULL,
  `kkm` int DEFAULT '75',
  `semester` enum('Ganjil','Genap') NOT NULL,
  `dibuat_oleh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `nilai`
--

INSERT INTO `nilai` (`id`, `santri_id`, `mapel_id`, `jenis_nilai`, `nilai`, `kkm`, `semester`, `dibuat_oleh`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'UTS', 85.50, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(2, 1, 2, 'UTS', 78.75, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(3, 1, 5, 'UTS', 90.00, 75, 'Ganjil', 3, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(4, 1, 8, 'Tugas', 88.25, 75, 'Ganjil', 4, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(5, 1, 12, 'Quiz', 92.00, 75, 'Ganjil', 7, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(6, 2, 1, 'UTS', 92.00, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(7, 2, 3, 'UTS', 85.75, 75, 'Ganjil', 1, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(8, 2, 6, 'Tugas', 89.50, 75, 'Ganjil', 5, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(9, 2, 9, 'Quiz', 87.25, 75, 'Ganjil', 4, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(10, 2, 13, 'UTS', 91.00, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(11, 3, 2, 'UTS', 76.50, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(12, 3, 4, 'UTS', 82.25, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(13, 3, 7, 'Tugas', 85.00, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(14, 3, 10, 'Quiz', 79.75, 75, 'Ganjil', 5, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(15, 3, 14, 'UTS', 88.50, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(16, 4, 1, 'UTS', 90.75, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(17, 4, 3, 'UTS', 87.50, 75, 'Ganjil', 1, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(18, 4, 8, 'Tugas', 92.25, 75, 'Ganjil', 4, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(19, 4, 11, 'Quiz', 85.00, 75, 'Ganjil', 5, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(20, 4, 12, 'UTS', 89.75, 75, 'Ganjil', 7, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(21, 5, 2, 'UTS', 82.00, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(22, 5, 5, 'UTS', 88.25, 75, 'Ganjil', 3, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(23, 5, 9, 'Tugas', 84.50, 75, 'Ganjil', 4, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(24, 5, 12, 'Quiz', 90.00, 75, 'Ganjil', 7, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(25, 5, 13, 'UTS', 86.75, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(26, 6, 1, 'UTS', 87.25, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(27, 6, 4, 'UTS', 83.50, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(28, 6, 6, 'Tugas', 91.00, 75, 'Ganjil', 5, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(29, 6, 10, 'Quiz', 88.75, 75, 'Ganjil', 5, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(30, 6, 14, 'UTS', 85.25, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(31, 7, 2, 'UTS', 94.00, 75, 'Ganjil', 2, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(32, 7, 3, 'UTS', 89.25, 75, 'Ganjil', 1, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(33, 7, 7, 'Tugas', 92.50, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(34, 7, 11, 'Quiz', 87.75, 75, 'Ganjil', 5, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(35, 7, 13, 'UTS', 93.25, 75, 'Ganjil', 6, '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(37, 2, 2, 'Quiz', 95.00, 75, 'Ganjil', 1, '2025-08-28 03:39:27', '2025-08-28 03:39:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasi_nilai`
--

CREATE TABLE `notifikasi_nilai` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `nilai_id` int NOT NULL,
  `pesan` text NOT NULL,
  `dibaca` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `notifikasi_nilai`
--

INSERT INTO `notifikasi_nilai` (`id`, `santri_id`, `nilai_id`, `pesan`, `dibaca`, `created_at`) VALUES
(2, 2, 37, 'Nilai baru telah diinput untuk mata pelajaran Akidah Akhlak. Jenis: Quiz, Nilai: 95.00', 0, '2025-08-28 03:39:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` int NOT NULL,
  `nama_setting` varchar(100) NOT NULL,
  `nilai_setting` text,
  `deskripsi` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengaturan`
--

INSERT INTO `pengaturan` (`id`, `nama_setting`, `nilai_setting`, `deskripsi`, `created_at`, `updated_at`) VALUES
(1, 'nama_pesantren', 'Pesantren Al-Hikmah', 'Nama pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(2, 'alamat_pesantren', 'Jl. Raya Pesantren No. 123', 'Alamat pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(3, 'telepon_pesantren', '021-12345678', 'Nomor telepon pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(4, 'email_pesantren', 'info@alhikmah.ac.id', 'Email pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(5, 'website_pesantren', 'https://www.alhikmah.ac.id', 'Website pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(6, 'logo_pesantren', 'logo.png', 'Logo pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(7, 'kepala_pesantren', 'KH. Ahmad Dahlan', 'Nama kepala pesantren', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(8, 'tahun_ajaran_aktif', '2024/2025', 'Tahun ajaran yang sedang aktif', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(9, 'semester_aktif', 'Ganjil', 'Semester yang sedang aktif', '2025-08-27 05:23:13', '2025-08-27 05:23:13'),
(10, 'alamat', 'Jl. Pesantren Al-Hikmah Baru No. 456, Lampung Utara', 'Alamat lengkap pesantren', '2025-08-27 10:26:00', '2025-08-27 13:23:24'),
(11, 'email_instansi', 'psb.baru@alhikmah.ac.id', 'Email resmi panitia PSB', '2025-08-27 10:26:00', '2025-08-27 13:23:24'),
(12, 'whatsapp', '6285555666777', 'Nomor WhatsApp panitia PSB', '2025-08-27 10:26:00', '2025-08-27 13:23:24'),
(13, 'website', 'https://alhikmah-baru.ac.id', 'Website resmi pesantren', '2025-08-27 10:26:00', '2025-08-27 13:23:24'),
(14, 'tahun_ajaran', '2025/2026', 'Tahun ajaran untuk PSB', '2025-08-27 10:26:00', '2025-08-27 13:23:24'),
(15, 'status_psb', 'Buka', 'Status pendaftaran santri baru', '2025-08-27 10:26:00', '2025-08-27 13:23:24'),
(17, 'judul_web', 'Pesantren Wali Songo', 'Judul web', '2025-08-27 10:26:49', '2025-08-27 14:11:58'),
(18, 'tagline_web', '', 'Tagline web', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(19, 'caption_web', '', 'Caption web', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(20, 'tentang_web', '', 'Tentang web', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(21, 'footer_web', '', 'Footer web', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(22, 'logo_web', '', 'Logo web', '2025-08-27 10:26:49', '2025-08-27 14:39:51'),
(23, 'nama_instansi', 'Test Instansi Updated', 'Nama instansi', '2025-08-27 10:26:49', '2025-08-27 14:00:03'),
(24, 'nama_pimpinan', '', 'Nama pimpinan', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(25, 'nik_pimpinan', '', 'Nik pimpinan', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(28, 'telp', '', 'Telp', '2025-08-27 10:26:49', '2025-08-27 11:57:48'),
(33, 'psb_pdf', 'uploads/psb_brosur_1756296052.pdf', 'Brosur pendaftaran dalam format PDF', '2025-08-27 10:26:49', '2025-08-27 13:23:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `santri`
--

CREATE TABLE `santri` (
  `id` int NOT NULL,
  `nis` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kelas_id` int DEFAULT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` text,
  `no_hp` varchar(20) DEFAULT NULL,
  `nama_wali` varchar(100) DEFAULT NULL,
  `no_hp_wali` varchar(20) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif','Alumni') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `santri`
--

INSERT INTO `santri` (`id`, `nis`, `nama`, `kelas_id`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_hp`, `nama_wali`, `no_hp_wali`, `foto`, `status`, `created_at`, `updated_at`) VALUES
(1, '2024001', 'Muhammad Rizki Pratama', 1, 'Jakarta', '2010-01-15', 'Laki-laki', 'Jl. Kemerdekaan No. 123, Jakarta', '081234567101', 'Budi Santoso', '081234567201', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(2, '2024002', 'Fatimah Azzahra', 1, 'Bogor', '2010-03-20', 'Perempuan', 'Jl. Merdeka No. 456, Bogor', '081234567102', 'Ahmad Rahman', '081234567202', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(3, '2024003', 'Abdullah Al-Mahdi', 2, 'Depok', '2010-05-10', 'Laki-laki', 'Jl. Pancasila No. 789, Depok', '081234567103', 'Hasan Basri', '081234567203', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(4, '2024004', 'Khadijah binti Khuwailid', 2, 'Tangerang', '2010-07-25', 'Perempuan', 'Jl. Proklamasi No. 321, Tangerang', '081234567104', 'Omar Bakri', '081234567204', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(5, '2024005', 'Ali Zainal Abidin', 3, 'Bekasi', '2009-02-14', 'Laki-laki', 'Jl. Pahlawan No. 654, Bekasi', '081234567105', 'Yusuf Ibrahim', '081234567205', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(6, '2024006', 'Ahmad Fauzi Rahman', 3, 'Bandung', '2009-06-30', 'Laki-laki', 'Jl. Veteran No. 111, Bandung', '081234567106', 'Mahmud Fauzi', '081234567206', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(7, '2024007', 'Siti Nurhalimah', 4, 'Surabaya', '2009-08-12', 'Perempuan', 'Jl. Diponegoro No. 222, Surabaya', '081234567107', 'Slamet Riyadi', '081234567207', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(8, '2024008', 'Muhammad Ikhsan Hidayat', 4, 'Yogyakarta', '2009-10-05', 'Laki-laki', 'Jl. Gajah Mada No. 333, Yogyakarta', '081234567108', 'Hidayat Iman', '081234567208', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(9, '2024009', 'Zainab binti Jahsh', 5, 'Semarang', '2008-12-22', 'Perempuan', 'Jl. Sudirman No. 444, Semarang', '081234567109', 'Jahsh Ahmad', '081234567209', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(10, '2024010', 'Hamzah ibn Abdul Muttalib', 5, 'Medan', '2008-04-18', 'Laki-laki', 'Jl. Imam Bonjol No. 555, Medan', '081234567110', 'Abdul Muttalib', '081234567210', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(11, '2024011', 'Hafsah binti Umar', 6, 'Palembang', '2008-07-03', 'Perempuan', 'Jl. Ahmad Yani No. 666, Palembang', '081234567111', 'Umar Khattab', '081234567211', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(12, '2024012', 'Saad ibn Abi Waqqas', 6, 'Makassar', '2008-09-15', 'Laki-laki', 'Jl. Hasanuddin No. 777, Makassar', '081234567112', 'Abi Waqqas', '081234567212', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(13, '2024013', 'Ummu Salamah', 7, 'Balikpapan', '2007-11-08', 'Perempuan', 'Jl. Mulawarman No. 888, Balikpapan', '081234567113', 'Abu Salamah', '081234567213', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(14, '2024014', 'Khalid ibn Walid', 8, 'Pontianak', '2007-01-25', 'Laki-laki', 'Jl. Sultan Syarif No. 999, Pontianak', '081234567114', 'Walid Mughirah', '081234567214', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(15, '2024015', 'Safiyyah binti Huyay', 9, 'Banjarmasin', '2006-05-14', 'Perempuan', 'Jl. Lambung Mangkurat No. 101, Banjarmasin', '081234567115', 'Huyay ibn Akhtab', '081234567215', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `santri_asrama`
--

CREATE TABLE `santri_asrama` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `asrama_id` int NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `tanggal_keluar` date DEFAULT NULL,
  `status` enum('Aktif','Pindah','Keluar') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `santri_asrama`
--

INSERT INTO `santri_asrama` (`id`, `santri_id`, `asrama_id`, `tanggal_masuk`, `tanggal_keluar`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2025-08-27', '2025-08-27', 'Keluar', '2025-08-27 09:56:28', '2025-08-27 09:57:19'),
(2, 3, 2, '2025-08-27', NULL, 'Aktif', '2025-08-27 09:56:48', '2025-08-27 09:56:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_izin_keluar`
--

CREATE TABLE `surat_izin_keluar` (
  `id` int NOT NULL,
  `santri_id` int NOT NULL,
  `tanggal_keluar` date NOT NULL,
  `jam_keluar` time NOT NULL,
  `tanggal_kembali` date NOT NULL,
  `jam_kembali` time NOT NULL,
  `keperluan` text NOT NULL,
  `alamat_tujuan` text NOT NULL,
  `nama_penjemput` varchar(100) DEFAULT NULL,
  `no_hp_penjemput` varchar(20) DEFAULT NULL,
  `status` enum('Belum Kembali','Sudah di Pesantren') DEFAULT 'Belum Kembali',
  `disetujui_oleh` int DEFAULT NULL,
  `tanggal_disetujui` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `surat_izin_keluar`
--

INSERT INTO `surat_izin_keluar` (`id`, `santri_id`, `tanggal_keluar`, `jam_keluar`, `tanggal_kembali`, `jam_kembali`, `keperluan`, `alamat_tujuan`, `nama_penjemput`, `no_hp_penjemput`, `status`, `disetujui_oleh`, `tanggal_disetujui`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-08-28', '10:00:00', '2025-08-28', '16:00:00', 'Kontrol kesehatan di rumah sakit', 'RS Siloam Jakarta, Jl. Garnisun Dalam No. 2-3, Semanggi, Jakarta Pusat', 'Budi Santoso', '081234567201', 'Belum Kembali', NULL, NULL, '2025-08-27 09:40:34', '2025-08-27 09:40:34'),
(3, 3, '2025-09-01', '10:00:00', '2025-09-01', '16:00:00', 'Menghadiri pernikahan saudara', 'Gedung Serbaguna Masjid Al-Ikhlas, Jl. Raya Bogor Km 25', 'Ahmad Abdullah', '08123456789', 'Sudah di Pesantren', NULL, NULL, '2025-08-27 10:05:17', '2025-08-27 10:15:20'),
(4, 4, '2025-09-02', '09:00:00', '2025-09-02', '18:00:00', 'Kontrol kesehatan rutin', 'Puskesmas Ciputat, Jl. Ir. H. Juanda No. 10', NULL, NULL, 'Sudah di Pesantren', NULL, NULL, '2025-08-27 10:13:01', '2025-08-27 10:13:13'),
(5, 5, '2025-09-03', '08:00:00', '2025-09-03', '20:00:00', 'Mengurus administrasi keluarga', 'Kantor Kelurahan Ciputat', 'Ayah Kandung', '081987654321', 'Sudah di Pesantren', NULL, NULL, '2025-08-27 10:13:35', '2025-08-27 10:13:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `role` enum('Admin','Ustadz','Santri') NOT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$Rh8ViD20Q8foaiqtLqIdPeX0Hg.dabPbIQz/2v3GWFj/vSMT/FgAS', 'Administrator Pesantren', 'Admin', 'Aktif', '2025-08-27 05:23:14', '2025-08-27 05:23:14'),
(2, 'ust001', '$2y$10$UEsoQ9S1jSv4SWImetSc.ex/jQJOwMJyjNnaD3JVxhj5kYOt.hiQG', 'Ustadz Ahmad Dahlan', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(3, 'ust002', '$2y$10$zhaeYcvjUMkRqoqG0D9msutMtj9psDPJrp.0H7MtfqeUCw91OUGeW', 'Ustadz Muhammad Abduh', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(4, 'ust003', '$2y$10$A1RwfqqviYG4oKAGJHvKPOXAiGm8aWH6uPQ6WGdQf8.23cPKWAJhe', 'Ustadzah Fatimah Az-Zahra', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(5, 'ust004', '$2y$10$nKf2LM0xtFzD33Ht9stE2.C35LAs7xu0sBnIle8lGsuy5RkzfJpiu', 'Ustadz Ali ibn Abi Thalib', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(6, 'ust005', '$2y$10$Emw61w5TCwwHDx4gh4hlfeKmZVx/AKQ7yfv3ovvqBAEvwFQ7HRObW', 'Ustadzah Aisyah binti Abu Bakar', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(7, 'ust006', '$2y$10$mv0lMChch4.KU.LVw5kkReOk1PLsQQT9TWq4mmtiXdrIgd0jjKuO6', 'Ustadz Umar ibn Khattab', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(8, 'ust007', '$2y$10$qP0dWKFh1/SVORPFqCAzu.aoPflcdqlUN/BAff6CZbSpXMrK185KC', 'Ustadzah Khadijah binti Khuwailid', 'Ustadz', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(9, 'sant001', '$2y$10$OFBgXd1wEJcotSq5dQ5PjORsKGNjlqYDJi.KowXegv8cNJk.zgey.', 'Muhammad Rizki Pratama', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(10, 'sant002', '$2y$10$ozQfbWp7JgcUZUED9S6nL.7HJfgR3i3xn7EAi9goSksvxt5GoknO2', 'Fatimah Azzahra', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(11, 'sant003', '$2y$10$HEvSy24Djg8bvTnZ6k6Oquf49BfgucbmGW7ZZRt1XaS6qeixqDtxi', 'Abdullah Al-Mahdi', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(12, 'sant004', '$2y$10$qukpsNoufQpaJBC/onuAZOl1KEjLVVjGnHHRjKhKdgYwowOj9bht.', 'Khadijah binti Khuwailid', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(13, 'sant005', '$2y$10$g6VtfWmog/i1bsFsweT0tOCW7Sj.iO/YKFQrD04TfqSEFCrRu6xui', 'Ali Zainal Abidin', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(14, 'sant006', '$2y$10$xpvPP06KhaUffUVEBmOSUuuY9UunIfGRp55XlraY.wM7o0tHW5oGW', 'Ahmad Fauzi Rahman', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(15, 'sant007', '$2y$10$5Xp6OF.0DBpmtEipePYab.Z8bZQIgTrp1Qagpbsz49qpvxSgz6.s2', 'Siti Nurhalimah', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(16, 'sant008', '$2y$10$1yrDEgyVGn2nTDZFiqNJTuRHSqKdRVrFM.TZ0YRqyQnCLnP.0O4eW', 'Muhammad Ikhsan Hidayat', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(17, 'sant009', '$2y$10$aXNx.4wiJarhxA4nStsIguzYRqMktrSoKCHNJnqw9Y7tD3ruv5mmS', 'Zainab binti Jahsh', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(18, 'sant010', '$2y$10$vmgcVt8kQF6rWTBzSRQzF.UzuPRKR8k.zResJ2cx2KJ/jWKKHgSoi', 'Hamzah ibn Abdul Muttalib', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(19, 'sant011', '$2y$10$1LxLlAfC3eW1.XYQ0lr4s.ZOJVn2dL23ptMJvQaSPgXdPHapm6yfO', 'Hafsah binti Umar', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(20, 'sant012', '$2y$10$g81cW3JTHlOmkdJxqq15LOT9Hc6vtRXlqFPinxj7wSqCx1ky8BSLe', 'Saad ibn Abi Waqqas', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(21, 'sant013', '$2y$10$Y2yXnFmV3/6zv4HHm9w9KuZZAJFSIqoIMHhtKRw5wCTyUEFnpsJua', 'Ummu Salamah', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(22, 'sant014', '$2y$10$8oZQkeeH99OEv.xtBFnfvu0orKw7b9dvIukmjX32HV0DrItF9Bn82', 'Khalid ibn Walid', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(23, 'sant015', '$2y$10$h.NJQ8WNB3FZaO8NPRetbe4Y.9RMPbiJpm6TLS2WRKP9JkXNleYzy', 'Safiyyah binti Huyay', 'Santri', 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ustadz`
--

CREATE TABLE `ustadz` (
  `id` int NOT NULL,
  `nip` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` text,
  `no_hp` varchar(20) DEFAULT NULL,
  `pendidikan_terakhir` varchar(100) DEFAULT NULL,
  `mata_pelajaran` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ustadz`
--

INSERT INTO `ustadz` (`id`, `nip`, `nama`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_hp`, `pendidikan_terakhir`, `mata_pelajaran`, `foto`, `status`, `created_at`, `updated_at`) VALUES
(1, 'UST001', 'Ustadz Ahmad Dahlan', 'Jakarta update', '1980-05-15', 'Laki-laki', 'Jl. Masjid No. 1, Jakarta Pusat', '081234567001', 'S1 Pendidikan Agama Islam', 'Al-Quran dan Hadits, Fiqh', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-28 09:40:59'),
(2, 'UST002', 'Ustadz Ahmad Dahlan', 'Bandung', '1975-08-20', 'Laki-laki', 'Jl. Pondok No. 2, Bandung', '081234567002', 'S2 Tafsir Hadits', 'Al-Quran dan Hadits, Akidah Akhlak', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:45:00'),
(3, 'UST003', 'Ustadzah Fatimah Az-Zahra', 'Surabaya', '1985-03-10', 'Perempuan', 'Jl. Santri No. 3, Surabaya', '081234567003', 'S1 Bahasa Arab', 'Bahasa Arab', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(4, 'UST004', 'Ustadz Ali ibn Abi Thalib', 'Yogyakarta', '1978-12-05', 'Laki-laki', 'Jl. Pesantren No. 4, Yogyakarta', '081234567004', 'S1 Pendidikan Matematika', 'Matematika, IPA', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(5, 'UST005', 'Ustadzah Aisyah binti Abu Bakar', 'Semarang', '1982-07-25', 'Perempuan', 'Jl. Madrasah No. 5, Semarang', '081234567005', 'S1 Pendidikan Bahasa Indonesia', 'Bahasa Indonesia, PKN', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(6, 'UST006', 'Ustadz Umar ibn Khattab', 'Medan', '1977-11-30', 'Laki-laki', 'Jl. Dakwah No. 6, Medan', '081234567006', 'S1 Pendidikan Bahasa Inggris', 'Bahasa Inggris, Seni', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15'),
(7, 'UST007', 'Ustadzah Khadijah binti Khuwailid', 'Palembang', '1983-09-18', 'Perempuan', 'Jl. Tahfidz No. 7, Palembang', '081234567007', 'S1 Pendidikan Al-Quran', 'Tahfidz Al-Quran, SKI', NULL, 'Aktif', '2025-08-27 05:23:15', '2025-08-27 05:23:15');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_santri_tanggal` (`santri_id`,`tanggal`),
  ADD KEY `idx_absensi_santri` (`santri_id`),
  ADD KEY `idx_absensi_tanggal` (`tanggal`),
  ADD KEY `idx_absensi_status` (`status`);

--
-- Indeks untuk tabel `asrama`
--
ALTER TABLE `asrama`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_asrama` (`kode_asrama`);

--
-- Indeks untuk tabel `jadwal_pelajaran`
--
ALTER TABLE `jadwal_pelajaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mapel_id` (`mapel_id`),
  ADD KEY `idx_jadwal_hari` (`hari`),
  ADD KEY `idx_jadwal_ustadz` (`ustadz_id`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indeks untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_kelas` (`kode_kelas`);

--
-- Indeks untuk tabel `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_mapel` (`kode_mapel`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indeks untuk tabel `nilai`
--
ALTER TABLE `nilai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nilai_santri` (`santri_id`),
  ADD KEY `idx_nilai_mapel` (`mapel_id`);

--
-- Indeks untuk tabel `notifikasi_nilai`
--
ALTER TABLE `notifikasi_nilai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nilai_id` (`nilai_id`),
  ADD KEY `idx_notifikasi_santri` (`santri_id`);

--
-- Indeks untuk tabel `pengaturan`
--
ALTER TABLE `pengaturan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_setting` (`nama_setting`);

--
-- Indeks untuk tabel `santri`
--
ALTER TABLE `santri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nis` (`nis`),
  ADD KEY `idx_santri_kelas` (`kelas_id`),
  ADD KEY `idx_santri_status` (`status`);

--
-- Indeks untuk tabel `santri_asrama`
--
ALTER TABLE `santri_asrama`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_santri_asrama_aktif` (`santri_id`,`asrama_id`,`status`),
  ADD KEY `idx_santri_asrama_santri` (`santri_id`),
  ADD KEY `idx_santri_asrama_asrama` (`asrama_id`),
  ADD KEY `idx_santri_asrama_status` (`status`);

--
-- Indeks untuk tabel `surat_izin_keluar`
--
ALTER TABLE `surat_izin_keluar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_id` (`santri_id`),
  ADD KEY `disetujui_oleh` (`disetujui_oleh`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `ustadz`
--
ALTER TABLE `ustadz`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `asrama`
--
ALTER TABLE `asrama`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `jadwal_pelajaran`
--
ALTER TABLE `jadwal_pelajaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `nilai`
--
ALTER TABLE `nilai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `notifikasi_nilai`
--
ALTER TABLE `notifikasi_nilai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `pengaturan`
--
ALTER TABLE `pengaturan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT untuk tabel `santri`
--
ALTER TABLE `santri`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `santri_asrama`
--
ALTER TABLE `santri_asrama`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `surat_izin_keluar`
--
ALTER TABLE `surat_izin_keluar`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT untuk tabel `ustadz`
--
ALTER TABLE `ustadz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `absensi`
--
ALTER TABLE `absensi`
  ADD CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jadwal_pelajaran`
--
ALTER TABLE `jadwal_pelajaran`
  ADD CONSTRAINT `jadwal_pelajaran_ibfk_1` FOREIGN KEY (`mapel_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_pelajaran_ibfk_2` FOREIGN KEY (`ustadz_id`) REFERENCES `ustadz` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_pelajaran_ibfk_3` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  ADD CONSTRAINT `mata_pelajaran_ibfk_1` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `nilai`
--
ALTER TABLE `nilai`
  ADD CONSTRAINT `nilai_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nilai_ibfk_2` FOREIGN KEY (`mapel_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifikasi_nilai`
--
ALTER TABLE `notifikasi_nilai`
  ADD CONSTRAINT `notifikasi_nilai_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifikasi_nilai_ibfk_2` FOREIGN KEY (`nilai_id`) REFERENCES `nilai` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `santri`
--
ALTER TABLE `santri`
  ADD CONSTRAINT `santri_ibfk_1` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `santri_asrama`
--
ALTER TABLE `santri_asrama`
  ADD CONSTRAINT `santri_asrama_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `santri_asrama_ibfk_2` FOREIGN KEY (`asrama_id`) REFERENCES `asrama` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `surat_izin_keluar`
--
ALTER TABLE `surat_izin_keluar`
  ADD CONSTRAINT `surat_izin_keluar_ibfk_1` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `surat_izin_keluar_ibfk_2` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;


