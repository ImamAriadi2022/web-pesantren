import { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

const Absensi = () => {
  const { santriId, currentUser } = useAuth();
  const [santri, setSantri] = useState({
    nama: '',
    nis: '',
    kelas: '',
    wali_kelas: ''
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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const fetchAbsensi = async () => {
    if (!santriId) {
      setError('Data santri tidak ditemukan. Silakan login ulang.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getAbsensi.php?santri_id=${santriId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const result = await response.json();
      
      if (result.success) {
        // Set santri info from the response
        const santriInfo = result.data.santri;
        if (santriInfo) {
          setSantri({
            nama: santriInfo.nama || '',
            nis: santriInfo.nis || '',
            kelas: santriInfo.kelas || 'Belum ditempatkan',
            wali_kelas: santriInfo.wali_kelas || 'Belum ditentukan'
          });
        }
        
        setAbsensiData(result.data.absensi || []);
        setSummary(result.data.summary || {});
      } else {
        setError(result.message || 'Gagal mengambil data absensi');
      }
    } catch (err) {
      console.error('Error fetching absensi:', err);
      setError('Terjadi kesalahan saat mengambil data absensi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error!</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div>
      <h2>Rekap Daftar Hadir Santri</h2>
      
      {/* Santri Information */}
      <div className="mb-4 border p-3 text-start"> 
        <p><strong>Nama Santri:</strong> {santri.nama}</p>
        <p><strong>NIS:</strong> {santri.nis}</p>
        <p><strong>Kelas:</strong> {santri.kelas}</p>
        <p><strong>Wali Kelas:</strong> {santri.wali_kelas}</p>
      </div>
      
      {/* Attendance Table */}
      {absensiData.length > 0 ? (
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
      ) : (
        <Alert variant="info">
          <Alert.Heading>Informasi</Alert.Heading>
          <p>Belum ada data absensi yang tersedia untuk santri ini.</p>
        </Alert>
      )}
      
      {/* Summary */}
    </div>
  );
};

export default Absensi;
