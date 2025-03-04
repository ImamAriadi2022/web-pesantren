import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

const JadwalPelajaran = () => {
  const [siswa] = useState({
    id: 1,
    namaSiswa: 'Santri 1',
    nisn: '1234567890',
    kelas: '10A',
    waliKelas: 'Ustadz 1',
    jadwal: {
      'Senin': ['Matematika'],
      'Selasa': ['Bahasa Indonesia'],
      'Rabu': ['Bahasa Inggris'],
      'Kamis': ['Fisika'],
      'Jumat': ['Kimia', 'Agama Islam'],
      'Sabtu': ['Biologi'],
    }
  });

  // Menghitung jumlah baris maksimum berdasarkan hari dengan jumlah mata pelajaran terbanyak
  const maxRows = Math.max(...Object.values(siswa.jadwal).map(jadwal => jadwal.length));

  return (
    <div>
      <h2>Jadwal Pelajaran</h2>
      <div className="mb-4 border p-3 text-start"> 
        <p><strong>Nama Siswa:</strong> {siswa.namaSiswa}</p>
        <p><strong>NISN:</strong> {siswa.nisn}</p>
        <p><strong>Kelas:</strong> {siswa.kelas}</p>
        <p><strong>Wali Kelas:</strong> {siswa.waliKelas}</p>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nomor</th>
            <th>Senin</th>
            <th>Selasa</th>
            <th>Rabu</th>
            <th>Kamis</th>
            <th>Jumat</th>
            <th>Sabtu</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              <td>{siswa.jadwal.Senin[rowIndex] || ''}</td>
              <td>{siswa.jadwal.Selasa[rowIndex] || ''}</td>
              <td>{siswa.jadwal.Rabu[rowIndex] || ''}</td>
              <td>{siswa.jadwal.Kamis[rowIndex] || ''}</td>
              <td>{siswa.jadwal.Jumat[rowIndex] || ''}</td>
              <td>{siswa.jadwal.Sabtu[rowIndex] || ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default JadwalPelajaran;