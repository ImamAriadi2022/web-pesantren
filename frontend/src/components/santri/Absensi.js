import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const Absensi = () => {
  const [santri, setSantri] = useState({
    namaSantri: '',
    nisn: '',
    kelas: '',
    waliKelas: ''
  });
  
  const [absensiData, setAbsensiData] = useState([]);
  const [summary, setSummary] = useState({
    total_hari: 0,
    total_hadir: 0,
    total_izin: 0,
    total_sakit: 0,
    total_alpha: 0,
    persentase_hadir: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchAbsensi();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getProfile.php?santri_id=1`);
      const result = await response.json();
      if (result.success) {
        setSantri({
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

  const fetchAbsensi = async () => {
    try {
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getAbsensi.php?santri_id=1`);
      const result = await response.json();
      if (result.success) {
        setAbsensiData(result.data.absensi);
        setSummary(result.data.summary);
      }
    } catch (error) {
      console.error('Error fetching absensi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Rekap Daftar Hadir Santri</h2>
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
                <th>Tanggal</th>
                <th>Status</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {absensiData.map((a, index) => (
                <tr key={index}>
                  <td>{a.tanggal}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'Hadir' ? 'bg-success' :
                      a.status === 'Izin' ? 'bg-warning' :
                      a.status === 'Sakit' ? 'bg-info' : 'bg-danger'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{a.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-4">
            <p><strong>Total Hari:</strong> {summary.total_hari}</p>
            <p><strong>Total Hadir:</strong> {summary.total_hadir}</p>
            <p><strong>Total Izin:</strong> {summary.total_izin}</p>
            <p><strong>Total Sakit:</strong> {summary.total_sakit}</p>
            <p><strong>Total Alpha:</strong> {summary.total_alpha}</p>
            <p><strong>Persentase Kehadiran:</strong> {summary.persentase_hadir}%</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Absensi;