import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

const Absensi = () => {
  const [siswa] = useState({
    id: 1,
    namaSiswa: 'Santri 1',
    nisn: '1234567890',
    kelas: '10A',
    waliKelas: 'Ustadz 1',
    absensi: [
      { tanggal: '2025-01-01', status: 'Hadir' },
      { tanggal: '2025-01-02', status: 'Hadir' },
      { tanggal: '2025-01-03', status: 'Izin' },
      { tanggal: '2025-01-04', status: 'Hadir' },
      { tanggal: '2025-01-05', status: 'Sakit' },
      // Tambahkan data absensi lainnya di sini
    ]
  });

  const totalHari = siswa.absensi.length;
  const totalHadir = siswa.absensi.filter(a => a.status === 'Hadir').length;
  const persentaseHadir = (totalHadir / totalHari) * 100;

  return (
    <div>
      <h2>Rekap Daftar Hadir Siswa</h2>
      <div className="mb-4 border p-3 text-start"> 
        <p><strong>Nama Siswa:</strong> {siswa.namaSiswa}</p>
        <p><strong>NISN:</strong> {siswa.nisn}</p>
        <p><strong>Kelas:</strong> {siswa.kelas}</p>
        <p><strong>Wali Kelas:</strong> {siswa.waliKelas}</p>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {siswa.absensi.map((a, index) => (
            <tr key={index}>
              <td>{a.tanggal}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-4">
        <p><strong>Total Hari:</strong> {totalHari}</p>
        <p><strong>Total Hadir:</strong> {totalHadir}</p>
        <p><strong>Persentase Kehadiran:</strong> {persentaseHadir.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default Absensi;