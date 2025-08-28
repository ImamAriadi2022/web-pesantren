import { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

const Absensi = () => {
  const { santriId, currentUser } = useAuth();
  const [santri, setSantri] = useState({
    nama: '',
    nis: ''
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
      // Menggunakan pola yang sama seperti KelolaAbsensi
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getAbsensi.php?santri_id=${santriId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Set santri info from the response
        const santriInfo = result.data.santri;
        if (santriInfo) {
          setSantri({
            nama: santriInfo.nama || '',
            nis: santriInfo.nis || ''
          });
        }
        
        setAbsensiData(result.data.absensi || []);
        setSummary(result.data.summary || {
          total_hari: 0,
          total_hadir: 0,
          total_izin: 0,
          total_sakit: 0,
          total_alpha: 0,
          persentase_hadir: 0
        });
      } else {
        console.error('Error fetching absensi:', result.message);
        setError(result.message || 'Gagal mengambil data absensi');
      }
    } catch (error) {
      console.error('Error fetching absensi:', error);
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
      </div>
      
      {/* Attendance Table */}
      {absensiData.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {absensiData.map((a, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{new Date(a.tanggal).toLocaleDateString('id-ID')}</td>
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
      
      {/* Summary Statistics */}
      {absensiData.length > 0 && (
        <div className="mt-4">
          <h5>Ringkasan Kehadiran</h5>
          <div className="row">
            <div className="col-md-2">
              <div className="card text-center bg-primary text-white">
                <div className="card-body">
                  <h6>Total Hari</h6>
                  <h4>{summary.total_hari || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center bg-success text-white">
                <div className="card-body">
                  <h6>Hadir</h6>
                  <h4>{summary.total_hadir || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center bg-warning text-white">
                <div className="card-body">
                  <h6>Izin</h6>
                  <h4>{summary.total_izin || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center bg-info text-white">
                <div className="card-body">
                  <h6>Sakit</h6>
                  <h4>{summary.total_sakit || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center bg-danger text-white">
                <div className="card-body">
                  <h6>Alpha</h6>
                  <h4>{summary.total_alpha || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center bg-dark text-white">
                <div className="card-body">
                  <h6>Persentase</h6>
                  <h4>{summary.persentase_hadir || 0}%</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Absensi;
