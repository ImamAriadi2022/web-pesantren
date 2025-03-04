import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

const Nilai = () => {
  const [siswa] = useState({
    id: 1,
    namaSiswa: 'Santri 1',
    nisn: '1234567890',
    kelas: '10A',
    waliKelas: 'Ustadz 1',
    semester: 'Ganjil',
    waliSiswa: 'Orang Tua 1',
    nilai: {
      'Matematika': 85,
      'Bahasa Indonesia': 90,
      'Bahasa Inggris': 88,
      // Tambahkan pelajaran lainnya di sini
    }
  });

  return (
    <div>
      <h2>Nilai Siswa</h2>
      <div className="mb-4 border p-3 text-start"> 
        <p><strong>Nama Siswa:</strong> {siswa.namaSiswa}</p>
        <p><strong>NISN:</strong> {siswa.nisn}</p>
        <p><strong>Kelas:</strong> {siswa.kelas}</p>
        <p><strong>Wali Kelas:</strong> {siswa.waliKelas}</p>
        <p><strong>Semester:</strong> {siswa.semester}</p>
        <p><strong>Wali Siswa:</strong> {siswa.waliSiswa}</p>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mata Pelajaran</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(siswa.nilai).map(([pelajaran, nilai], index) => (
            <tr key={index}>
              <td>{pelajaran}</td>
              <td>{nilai}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Nilai;