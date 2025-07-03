import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const JadwalPelajaran = () => {
  const [santri, setSantri] = useState({
    id: 1,
    namaSantri: '',
    nisn: '',
    kelas: '',
    waliKelas: ''
  });
  
  const [jadwal, setJadwal] = useState({
    'Senin': [],
    'Selasa': [],
    'Rabu': [],
    'Kamis': [],
    'Jumat': [],
    'Sabtu': []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchJadwal();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getProfile.php?santri_id=1`);
      const result = await response.json();
      if (result.success) {
        setSantri({
          id: result.data.id,
          namaSantri: result.data.nama,
          nisn: result.data.nis,
          kelas: result.data.nama_kelas || 'Belum ditempatkan',
          waliKelas: result.data.wali_kelas || 'Belum ditentukan'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchJadwal = async () => {
    try {
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getJadwal.php?santri_id=1`);
      const result = await response.json();
      if (result.success) {
        setJadwal(result.data);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menghitung jumlah baris maksimum berdasarkan hari dengan jumlah mata pelajaran terbanyak
  const maxRows = Math.max(...Object.values(jadwal).map(jadwal => jadwal.length), 1);

  return (
    <div>
      <h2>Jadwal Pelajaran</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4 border p-3 text-start"> 
            <p><strong>Nama Santri:</strong> {santri.namaSantri}</p>
            <p><strong>NISN:</strong> {santri.nisn}</p>
            <p><strong>Kelas:</strong> {santri.kelas}</p>
            <p><strong>Wali Kelas:</strong> {santri.waliKelas}</p>
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
                  <td>{jadwal.Senin[rowIndex] ? `${jadwal.Senin[rowIndex].mapel} (${jadwal.Senin[rowIndex].jam})` : ''}</td>
                  <td>{jadwal.Selasa[rowIndex] ? `${jadwal.Selasa[rowIndex].mapel} (${jadwal.Selasa[rowIndex].jam})` : ''}</td>
                  <td>{jadwal.Rabu[rowIndex] ? `${jadwal.Rabu[rowIndex].mapel} (${jadwal.Rabu[rowIndex].jam})` : ''}</td>
                  <td>{jadwal.Kamis[rowIndex] ? `${jadwal.Kamis[rowIndex].mapel} (${jadwal.Kamis[rowIndex].jam})` : ''}</td>
                  <td>{jadwal.Jumat[rowIndex] ? `${jadwal.Jumat[rowIndex].mapel} (${jadwal.Jumat[rowIndex].jam})` : ''}</td>
                  <td>{jadwal.Sabtu[rowIndex] ? `${jadwal.Sabtu[rowIndex].mapel} (${jadwal.Sabtu[rowIndex].jam})` : ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default JadwalPelajaran;