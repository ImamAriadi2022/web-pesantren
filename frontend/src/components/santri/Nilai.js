import { useEffect, useState } from 'react';
import { Badge, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

// Custom styles
const customStyles = `
  .nilai-card {
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  }
  
  .nilai-card:hover {
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
  
  .nilai-table {
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    background: white;
  }
  
  .table th {
    background: linear-gradient(135deg, #495057 0%, #343a40 100%);
    color: white;
    font-weight: 600;
    text-align: center;
    padding: 12px 8px;
    border: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
  }
  
  .table td {
    border-color: #f1f3f4;
    vertical-align: middle;
    padding: 12px 8px;
  }
  
  .grade-badge {
    transition: all 0.2s ease;
    padding: 6px 12px;
    font-weight: bold;
  }
  
  .grade-badge:hover {
    transform: scale(1.1);
  }
  
  .stats-card {
    border-radius: 15px;
    border: none;
    transition: all 0.3s ease;
  }
  
  .stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
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
  
  @media (max-width: 768px) {
    .nilai-card {
      margin: 0 10px;
    }
    
    .table th {
      padding: 8px 4px;
      font-size: 0.75rem;
    }
    
    .table td {
      padding: 8px 4px;
      font-size: 0.85rem;
    }
    
    .grade-badge {
      padding: 4px 8px;
      font-size: 0.75rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('nilai-styles')) {
  const style = document.createElement('style');
  style.id = 'nilai-styles';
  style.textContent = customStyles;
  document.head.appendChild(style);
}

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
      setError(null);
      const response = await fetch(`https://teralab.my.id/backend/api/santri/getNilai.php?santri_id=${santriId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
    // Untuk format data yang sesuai dengan database
    if (!nilai.uts && !nilai.uas) return '-';
    const uts = parseFloat(nilai.uts || 0);
    const uas = parseFloat(nilai.uas || 0);
    
    // Jika hanya salah satu yang ada
    if (nilai.uts && !nilai.uas) return uts.toFixed(1);
    if (!nilai.uts && nilai.uas) return uas.toFixed(1);
    
    return ((uts + uas) / 2).toFixed(1);
  };

  const getGrade = (rata) => {
    if (rata === '-') return '-';
    const avg = parseFloat(rata);
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'E';
  };

  const getGradeBadgeClass = (grade) => {
    switch(grade) {
      case 'A': return 'bg-success';
      case 'B': return 'bg-primary';
      case 'C': return 'bg-warning';
      case 'D': return 'bg-danger';
      case 'E': return 'bg-dark';
      default: return 'bg-secondary';
    }
  };

  const calculateStats = () => {
    if (nilaiData.length === 0) return { totalMapel: 0, rataRata: 0, gradeA: 0, gradeB: 0 };
    
    let totalNilai = 0;
    let validNilai = 0;
    let gradeCount = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    
    nilaiData.forEach(nilai => {
      const rata = calculateAverage(nilai);
      if (rata !== '-') {
        totalNilai += parseFloat(rata);
        validNilai++;
        const grade = getGrade(rata);
        if (gradeCount[grade] !== undefined) {
          gradeCount[grade]++;
        }
      }
    });
    
    return {
      totalMapel: nilaiData.length,
      rataRata: validNilai > 0 ? (totalNilai / validNilai).toFixed(1) : 0,
      gradeA: gradeCount.A,
      gradeB: gradeCount.B
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted">Memuat data nilai...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="alert alert-danger d-inline-block">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="mt-3">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setError(null);
                fetchNilaiData();
              }}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-2">
        <Col>
          <h4 className="text-primary mb-2">📊 Nilai Santri</h4>
        </Col>
      </Row>
      
      {santriInfo && (
        <>
          <Row className="mb-2">
            {/* Profil Santri */}
            <Col md={8} className="mb-2">
              <Card className="shadow-sm nilai-card h-100">
                <Card.Body className="py-2">
                  <Row>
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-user-graduate"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0" style={{fontSize: '0.75rem'}}>Nama Santri</h6>
                          <p className="fw-bold mb-0 text-primary" style={{fontSize: '0.9rem'}}>{santriInfo.nama}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-id-card"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0" style={{fontSize: '0.75rem'}}>NIS</h6>
                          <p className="fw-bold mb-0 text-success" style={{fontSize: '0.9rem'}}>{santriInfo.nis}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-users"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0" style={{fontSize: '0.75rem'}}>Kelas</h6>
                          <p className="fw-bold mb-0 text-info" style={{fontSize: '0.9rem'}}>{santriInfo.kelas}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      {/* <div className="d-flex align-items-center mb-2">
                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0" style={{fontSize: '0.75rem'}}>Wali Kelas</h6>
                          <p className="fw-bold mb-0 text-warning" style={{fontSize: '0.9rem'}}>{santriInfo.wali_kelas || 'Belum ditetapkan'}</p>
                        </div>
                      </div> */}
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0" style={{fontSize: '0.75rem'}}>Tahun Ajaran</h6>
                          <p className="fw-bold mb-0 text-danger" style={{fontSize: '0.9rem'}}>2023/2024</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3 profile-icon" style={{width: '40px', height: '40px'}}>
                          <i className="fas fa-clock"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0" style={{fontSize: '0.75rem'}}>Semester</h6>
                          <p className="fw-bold mb-0 text-dark" style={{fontSize: '0.9rem'}}>Ganjil</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Statistik Nilai */}
            <Col md={4} className="mb-2">
              <Row>
                <Col xs={6} className="mb-1">
                  <Card className="h-100 border-0 shadow-sm stats-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <Card.Body className="text-white text-center py-2">
                      <i className="fas fa-book mb-1"></i>
                      <h6 className="fw-bold mb-0">{stats.totalMapel}</h6>
                      <small style={{fontSize: '0.65rem'}}>Total Mapel</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="mb-1">
                  <Card className="h-100 border-0 shadow-sm stats-card" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                    <Card.Body className="text-white text-center py-2">
                      <i className="fas fa-chart-line mb-1"></i>
                      <h6 className="fw-bold mb-0">{stats.rataRata}</h6>
                      <small style={{fontSize: '0.65rem'}}>Rata-rata</small>
                    </Card.Body>
                  </Card>
                </Col>
        
              </Row>
            </Col>
          </Row>
        </>
      )}

      {nilaiData.length > 0 ? (
        <Card className="shadow-sm nilai-card">
          <Card.Header className="bg-gradient-primary text-white py-2">
            <h6 className="mb-0">
              <i className="fas fa-chart-bar me-2"></i>
              Daftar Nilai Mata Pelajaran
            </h6>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="nilai-table">
              <Table className="mb-0" hover>
                <thead>
                  <tr>
                    <th style={{width: '40%'}}>
                      <i className="fas fa-book me-1"></i>Mata Pelajaran
                    </th>
                    <th style={{width: '15%'}}>
                      <i className="fas fa-pencil-alt me-1"></i>UTS
                    </th>
                    <th style={{width: '15%'}}>
                      <i className="fas fa-graduation-cap me-1"></i>UAS
                    </th>
                    <th style={{width: '15%'}}>
                      <i className="fas fa-calculator me-1"></i>Rata-rata
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nilaiData.map((nilai, index) => {
                    const rata = calculateAverage(nilai);
                    const grade = getGrade(rata);
                    return (
                      <tr key={index}>
                        <td className="fw-semibold">{nilai.nama_mapel}</td>
                        <td className="text-center">
                          <Badge bg={nilai.uts ? 'success' : 'secondary'} className="px-2">
                            {nilai.uts || '-'}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg={nilai.uas ? 'success' : 'secondary'} className="px-2">
                            {nilai.uas || '-'}
                          </Badge>
                        </td>
                        <td className="text-center fw-bold">
                          {rata}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm nilai-card">
          <Card.Body className="text-center py-5">
            <i className="fas fa-info-circle fa-3x text-info mb-3"></i>
            <h5 className="text-info">Informasi</h5>
            <p className="text-muted">Belum ada data nilai untuk santri ini.</p>
            <small className="text-muted">Santri ID: {santriId}</small>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Nilai;
