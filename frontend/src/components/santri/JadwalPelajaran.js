import { useEffect, useState } from 'react';
import { Badge, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

// Custom styles
const customStyles = `
  .jadwal-card {
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  }
  
  .jadwal-card:hover {
    box-shadow: 0 8px 25px rgba(0,123,255,0.15);
    transform: translateY(-3px);
    border-color: #007bff;
  }
  
  .profile-icon {
    transition: all 0.4s ease;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  }
  
  .profile-icon:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 4px 15px rgba(0,123,255,0.4);
  }
  
  .schedule-item {
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    cursor: pointer;
  }
  
  .schedule-item:hover {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(0,123,255,0.2);
    border-color: #007bff;
  }
  
  .table-responsive {
    border-radius: 0.75rem;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    background: white;
    max-height: 75vh;
  }
  
  .table th {
    background: linear-gradient(135deg, #495057 0%, #343a40 100%);
    color: white;
    font-weight: 600;
    text-align: center;
    padding: 8px 4px;
    border: none;
    position: sticky;
    top: 0;
    z-index: 10;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.75rem;
  }
  
  .table td {
    border-color: #f1f3f4;
    vertical-align: middle;
    padding: 4px 2px;
  }
  
  .empty-schedule {
    opacity: 0.4;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .empty-schedule:hover {
    opacity: 0.7;
    transform: scale(1.02);
  }
  
  .badge {
    transition: all 0.2s ease;
  }
  
  .badge:hover {
    transform: scale(1.05);
  }
  
  .alert {
    border-radius: 10px;
    border: none;
  }
  
  .btn {
    transition: all 0.3s ease;
    border-radius: 8px;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .container-fluid {
    animation: fadeIn 0.6s ease-in;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .schedule-item.highlight {
    animation: pulse 1s ease-in-out;
  }
  
  @media (max-width: 768px) {
    .table-responsive {
      font-size: 0.8rem;
      margin: 0 10px;
      border-radius: 8px;
    }
    
    .schedule-item {
      padding: 0.5rem !important;
      min-height: 80px;
    }
    
    .jadwal-card {
      margin: 0 10px;
    }
    
    .table th {
      padding: 10px 4px;
      font-size: 0.85rem;
    }
    
    .table td {
      padding: 8px 4px;
    }
    
    .badge {
      font-size: 0.75rem;
    }
  }
  
  @media (max-width: 576px) {
    .jadwal-card .card-body {
      padding: 1rem;
    }
    
    .jadwal-card h3 {
      font-size: 1.2rem;
    }
    
    .table th {
      font-size: 0.75rem;
      padding: 8px 2px;
    }
    
    .schedule-item {
      min-height: 70px;
      padding: 6px !important;
    }
    
    .badge {
      font-size: 0.7rem;
      padding: 4px 6px;
    }
    
    .table-responsive {
      margin: 0 5px;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('jadwal-styles')) {
  const style = document.createElement('style');
  style.id = 'jadwal-styles';
  style.textContent = customStyles;
  document.head.appendChild(style);
}

const JadwalPelajaran = () => {
  const { santriId, currentUser } = useAuth();
  const [santri, setSantri] = useState({
    id: santriId || null,
    namaSantri: '',
    nisn: '',
    kelas: '',
    kodeKelas: ''
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
  const [error, setError] = useState(null);

  // Component untuk menampilkan jadwal per hari
  const JadwalCell = ({ daySchedule, rowIndex }) => {
    if (daySchedule[rowIndex]) {
      const schedule = daySchedule[rowIndex];
      return (
        <div className="border rounded p-1 schedule-item h-100" style={{minHeight: '60px'}}>
          <div className="mb-1">
            <Badge bg="primary" className="d-block text-wrap fw-bold" style={{fontSize: '0.65rem', padding: '2px 4px'}}>
              <i className="fas fa-book me-1"></i>
              {schedule.mapel}
            </Badge>
          </div>
          <div className="small" style={{fontSize: '0.6rem', lineHeight: '1.2'}}>
            <div className="mb-1 text-primary">
              <i className="fas fa-clock me-1"></i>
              <strong>{schedule.jam}</strong>
            </div>
            <div className="mb-1 text-success">
              <i className="fas fa-chalkboard-teacher me-1"></i>
              {schedule.ustadz}
            </div>
            <div className="text-danger">
              <i className="fas fa-map-marker-alt me-1"></i>
              {schedule.ruangan}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center text-muted py-2 empty-schedule" style={{minHeight: '60px'}}>
          <i className="fas fa-moon mb-1"></i>
          <br />
          <small style={{fontSize: '0.6rem'}}>Tidak ada jadwal</small>
        </div>
      );
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchJadwal();
  }, []);

  const fetchProfile = async () => {
    if (!santriId) {
      setError('Santri ID tidak ditemukan');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getProfile.php?santri_id=${santriId}`);
      const result = await response.json();
      if (result.status === 'success') {
        setSantri({
          id: result.data.id,
          namaSantri: result.data.nama,
          nisn: result.data.nis,
          kelas: result.data.kelas || 'Belum ditempatkan',
          kodeKelas: result.data.kode_kelas || 'N/A'
        });
      } else {
        setError(result.message || 'Gagal mengambil data profil santri');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Terjadi kesalahan saat mengambil data profil santri');
    }
  };

  const fetchJadwal = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getJadwal.php?santri_id=${santriId}`);
      const result = await response.json();
      if (result.success) {
        setJadwal(result.data);
      } else {
        setError(result.message || 'Gagal mengambil data jadwal');
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      setError('Terjadi kesalahan saat mengambil data jadwal');
    } finally {
      setLoading(false);
    }
  };

  // Menghitung jumlah baris maksimum berdasarkan hari dengan jumlah mata pelajaran terbanyak
  const maxRows = Math.max(...Object.values(jadwal).map(jadwal => jadwal.length), 1);
  
  // Menghitung statistik jadwal
  const getJadwalStats = () => {
    const totalMapel = Object.values(jadwal).reduce((total, day) => total + day.length, 0);
    const uniqueMapel = new Set();
    const uniqueUstadz = new Set();
    
    Object.values(jadwal).forEach(day => {
      day.forEach(schedule => {
        uniqueMapel.add(schedule.mapel);
        uniqueUstadz.add(schedule.ustadz);
      });
    });
    
    return {
      totalMapel,
      uniqueMapel: uniqueMapel.size,
      uniqueUstadz: uniqueUstadz.size,
      activeDays: Object.values(jadwal).filter(day => day.length > 0).length
    };
  };
  
  const stats = getJadwalStats();

  return (
    <div className="container-fluid">
      <Row className="mb-2">
        <Col>
          <h4 className="text-primary mb-2">📚 Jadwal Pelajaran</h4>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Memuat jadwal pelajaran...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <div className="alert alert-danger d-inline-block">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="mt-3">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setLoading(true);
                fetchProfile();
                fetchJadwal();
              }}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Coba Lagi
            </button>
          </div>
        </div>
      ) : (
        <>
          <Row className="mb-2">
            {/* Profil Santri */}
            <Col md={6} className="mb-2">
              <Card className="shadow-sm jadwal-card h-100">
                <Card.Body className="py-2">
                  <Row>
                    <Col xs={6}>
                      <div className="text-center">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-1 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-user-graduate"></i>
                        </div>
                        <h6 className="text-muted mb-0" style={{fontSize: '0.7rem'}}>Nama Santri</h6>
                        <p className="fw-bold mb-0 text-primary" style={{fontSize: '0.8rem'}}>{santri.namaSantri}</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-1 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-id-card"></i>
                        </div>
                        <h6 className="text-muted mb-0" style={{fontSize: '0.7rem'}}>NIS</h6>
                        <p className="fw-bold mb-0 text-success" style={{fontSize: '0.8rem'}}>{santri.nisn}</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={6}>
                      <div className="text-center">
                        <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-1 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-users"></i>
                        </div>
                        <h6 className="text-muted mb-0" style={{fontSize: '0.7rem'}}>Kelas</h6>
                        <p className="fw-bold mb-0 text-info" style={{fontSize: '0.8rem'}}>{santri.kelas}</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center">
                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-1 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-code"></i>
                        </div>
                        <h6 className="text-muted mb-0" style={{fontSize: '0.7rem'}}>Kode Kelas</h6>
                        <p className="fw-bold mb-0 text-warning" style={{fontSize: '0.8rem'}}>{santri.kodeKelas}</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Statistik Jadwal */}
            <Col md={6} className="mb-2">
              <Row>
                <Col xs={6} className="mb-1">
                  <Card className="h-100 border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <Card.Body className="text-white text-center py-2">
                      <i className="fas fa-book mb-1"></i>
                      <h6 className="fw-bold mb-0">{stats.totalMapel}</h6>
                      <small style={{fontSize: '0.65rem'}}>Total Mapel</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="mb-1">
                  <Card className="h-100 border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                    <Card.Body className="text-white text-center py-2">
                      <i className="fas fa-layer-group mb-1"></i>
                      <h6 className="fw-bold mb-0">{stats.uniqueMapel}</h6>
                      <small style={{fontSize: '0.65rem'}}>Jenis Mapel</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="mb-1">
                  <Card className="h-100 border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                    <Card.Body className="text-white text-center py-2">
                      <i className="fas fa-chalkboard-teacher mb-1"></i>
                      <h6 className="fw-bold mb-0">{stats.uniqueUstadz}</h6>
                      <small style={{fontSize: '0.65rem'}}>Ustadz</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="mb-1">
                  <Card className="h-100 border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
                    <Card.Body className="text-white text-center py-2">
                      <i className="fas fa-calendar-day mb-1"></i>
                      <h6 className="fw-bold mb-0">{stats.activeDays}</h6>
                      <small style={{fontSize: '0.65rem'}}>Hari Aktif</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Card className="shadow-sm jadwal-card">
            <Card.Header className="bg-gradient-primary text-white py-2">
              <h6 className="mb-0">
                <i className="fas fa-calendar-week me-2"></i>
                Jadwal Pelajaran Minggu Ini
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0" hover>
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="text-center" style={{width: '80px'}}>
                        <i className="fas fa-clock me-1"></i>Jam
                      </th>
                      <th className="text-center">
                        <i className="fas fa-calendar-day me-1"></i>Senin
                      </th>
                      <th className="text-center">
                        <i className="fas fa-calendar-day me-1"></i>Selasa
                      </th>
                      <th className="text-center">
                        <i className="fas fa-calendar-day me-1"></i>Rabu
                      </th>
                      <th className="text-center">
                        <i className="fas fa-calendar-day me-1"></i>Kamis
                      </th>
                      <th className="text-center">
                        <i className="fas fa-calendar-day me-1"></i>Jumat
                      </th>
                      <th className="text-center">
                        <i className="fas fa-calendar-day me-1"></i>Sabtu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: maxRows }).map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-bottom">
                        <td className="text-center align-middle bg-light">
                          <Badge bg="secondary" className="px-3 py-2">
                            {rowIndex + 1}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <JadwalCell daySchedule={jadwal.Senin} rowIndex={rowIndex} />
                        </td>
                        <td className="p-2">
                          <JadwalCell daySchedule={jadwal.Selasa} rowIndex={rowIndex} />
                        </td>
                        <td className="p-2">
                          <JadwalCell daySchedule={jadwal.Rabu} rowIndex={rowIndex} />
                        </td>
                        <td className="p-2">
                          <JadwalCell daySchedule={jadwal.Kamis} rowIndex={rowIndex} />
                        </td>
                        <td className="p-2">
                          <JadwalCell daySchedule={jadwal.Jumat} rowIndex={rowIndex} />
                        </td>
                        <td className="p-2">
                          <JadwalCell daySchedule={jadwal.Sabtu} rowIndex={rowIndex} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default JadwalPelajaran;
