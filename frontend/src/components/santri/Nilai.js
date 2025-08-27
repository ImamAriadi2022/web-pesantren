import { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

const Nilai = () => {
  const { santriId, currentUser } = useAuth();
  const [nilaiData, setNilaiData] = useState([]);
  const [santriInfo, setSantriInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNilaiData();
  }, []);

  const fetchNilaiData = async () => {
    if (!santriId) {
      setError('Data santri tidak ditemukan. Silakan login ulang.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getNilai.php?santri_id=${santriId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setNilaiData(result.data.nilai || []);
        setSantriInfo(result.data.santri || null);
      } else {
        setError(result.message || 'Gagal mengambil data nilai');
      }
    } catch (err) {
      console.error('Error fetching nilai data:', err);
      setError('Terjadi kesalahan saat mengambil data nilai');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (nilai) => {
    if (!nilai.uts && !nilai.uas) return '-';
    const uts = parseFloat(nilai.uts || 0);
    const uas = parseFloat(nilai.uas || 0);
    return ((uts + uas) / 2).toFixed(1);
  };

  const getGrade = (rata) => {
    const avg = parseFloat(rata);
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'E';
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
      <h2>Nilai Santri</h2>
      
      {santriInfo && (
        <div className="mb-4 border p-3 text-start"> 
          <p><strong>Nama Santri:</strong> {santriInfo.nama}</p>
          <p><strong>NIS:</strong> {santriInfo.nis}</p>
          <p><strong>Kelas:</strong> {santriInfo.kelas}</p>
          <p><strong>Wali Kelas:</strong> {santriInfo.wali_kelas}</p>
          <p><strong>Tahun Ajaran:</strong> {santriInfo.tahun_ajaran}</p>
          <p><strong>Semester:</strong> {santriInfo.semester}</p>
        </div>
      )}

      {nilaiData.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mata Pelajaran</th>
              <th>UTS</th>
              <th>UAS</th>
              <th>Rata-rata</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {nilaiData.map((nilai, index) => {
              const rata = calculateAverage(nilai);
              return (
                <tr key={index}>
                  <td>{nilai.nama_mapel}</td>
                  <td>{nilai.uts || '-'}</td>
                  <td>{nilai.uas || '-'}</td>
                  <td>{rata}</td>
                  <td>
                    <span className={`badge ${
                      getGrade(rata) === 'A' ? 'bg-success' :
                      getGrade(rata) === 'B' ? 'bg-primary' :
                      getGrade(rata) === 'C' ? 'bg-warning' :
                      getGrade(rata) === 'D' ? 'bg-danger' : 'bg-dark'
                    }`}>
                      {getGrade(rata)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">
          <Alert.Heading>Informasi</Alert.Heading>
          <p>Belum ada data nilai yang tersedia untuk santri ini.</p>
        </Alert>
      )}
    </div>
  );
};

export default Nilai;
