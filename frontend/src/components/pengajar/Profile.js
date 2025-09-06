import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { FaBook, FaCalendarAlt, FaEdit, FaMapMarkerAlt, FaPhone, FaTrash, FaUser } from 'react-icons/fa';
import { useAuth } from '../../utils/auth';

// Backend endpoints for pengajar (ustadz)
const API_BASE = 'https://teralab.my.id/backend/api/ustadz';

const Profile = () => {
	const { ustadzId, currentUser } = useAuth();

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [editData, setEditData] = useState({
		id: null,
		foto: '',
		nama: '',
		nip: '', // save endpoint expects nik
		jenis_kelamin: '',
		tempat_lahir: '',
		tanggal_lahir: '',
		mata_pelajaran: '',
		alamat: '',
		no_hp: '', // save accepts telepon/nomor_hp
		pendidikan_terakhir: '',
		status: 'Aktif'
	});

	const qs = (params) => new URLSearchParams(params).toString();

	const fetchProfile = async () => {
		const userId = currentUser?.id;
		if (!ustadzId && !userId) {
			setError('Data pengguna tidak ditemukan. Silakan login ulang.');
			return;
		}

		setLoading(true);
		setError('');
		try {
			const url = `${API_BASE}/getProfile.php?${qs(ustadzId ? { ustadz_id: ustadzId } : { user_id: userId })}`;
			const res = await fetch(url);
			const json = await res.json();
			if (json.success && json.data) {
				const d = json.data;
				setProfile(d);
				setEditData({
					id: d.id ?? null,
					foto: d.foto ?? '',
					nama: d.nama ?? '',
					nip: d.nip ?? '',
					jenis_kelamin: d.jenis_kelamin ?? '',
					tempat_lahir: d.tempat_lahir ?? '',
					tanggal_lahir: d.tanggal_lahir ?? '',
					mata_pelajaran: d.mata_pelajaran ?? '',
					alamat: d.alamat ?? '',
					no_hp: d.no_hp ?? d.nomor_hp ?? '',
					pendidikan_terakhir: d.pendidikan_terakhir ?? '',
					status: d.status ?? 'Aktif'
				});
			} else {
				setError(json.message || 'Gagal mengambil data profil pengajar');
			}
		} catch (e) {
			setError('Terjadi kesalahan saat mengambil data profil: ' + e.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleUpdate = async () => {
		if (!editData.nama) {
			setError('Nama wajib diisi');
			return;
		}
		setLoading(true);
		setError('');
		try {
			const payload = {
				id: editData.id,
				nik: editData.nip || '', // maps to nip in DB
				nama: editData.nama,
				tempat_lahir: editData.tempat_lahir || '',
				tanggal_lahir: editData.tanggal_lahir || null,
				jenis_kelamin: editData.jenis_kelamin || '',
				alamat: editData.alamat || '',
				telepon: editData.no_hp || '',
				pendidikan_terakhir: editData.pendidikan_terakhir || '',
				mata_pelajaran: editData.mata_pelajaran || '',
				status: editData.status || 'Aktif'
			};
			const res = await fetch(`${API_BASE}/saveUstadz.php`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const json = await res.json();
			if (json.success) {
				setSuccess('Profil berhasil diperbarui');
				setShowEditModal(false);
				fetchProfile();
				setTimeout(() => setSuccess(''), 2000);
			} else {
				setError(json.message || 'Gagal memperbarui profil');
			}
		} catch (e) {
			setError('Error update profil: ' + e.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!profile?.id) {
			setError('ID profil tidak ditemukan');
			return;
		}
		setLoading(true);
		setError('');
		try {
			const res = await fetch(`${API_BASE}/deleteUstadz.php`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: profile.id })
			});
			const json = await res.json();
			if (json.success) {
				setSuccess('Akun berhasil dihapus');
				setShowDeleteModal(false);
				setTimeout(() => {
					localStorage.removeItem('currentUser');
					localStorage.removeItem('authToken');
					window.location.href = '/';
				}, 1200);
			} else {
				setError(json.message || 'Gagal menghapus akun');
			}
		} catch (e) {
			setError('Error hapus akun: ' + e.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading && !profile) {
		return (
			<Container className="mt-4">
				<div className="text-center py-5">
					<Spinner animation="border" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</div>
			</Container>
		);
	}

	return (
		<Container fluid>
			<Row>
				<Col>
					<Card className="shadow-sm">
						<Card.Header className="bg-primary text-white">
							<h5 className="mb-0"><FaUser className="me-2" /> Profil Pengajar</h5>
						</Card.Header>
						<Card.Body>
							{error && (
								<Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>
							)}
							{success && (
								<Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>
							)}

							{profile ? (
								<>
									<Row className="mb-4">
										<Col md={3}>
											<div className="text-center">
												{profile.foto ? (
													<img
														src={`https://teralab.my.id/backend/api/ustadz/${profile.foto}`}
														alt={profile.nama}
														className="rounded-circle img-fluid mb-3"
														style={{ width: '120px', height: '120px', objectFit: 'cover' }}
													/>
												) : (
													<div className="bg-secondary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
														<FaUser className="text-white" size={50} />
													</div>
												)}
												<h5 className="mb-2">{profile.nama}</h5>
												<Badge bg={profile.status === 'Aktif' ? 'success' : 'secondary'} className="mb-3">{profile.status || 'Aktif'}</Badge>
											</div>
										</Col>
										<Col md={9}>
											<div className="row g-3">
												<div className="col-md-6">
													<div className="border rounded p-3 h-100">
														<h6 className="text-muted mb-2">Informasi Pribadi</h6>
														<div className="mb-2">
															<small className="text-muted">NIP</small>
															<div className="fw-bold">{profile.nip || '-'}</div>
														</div>
														<div className="mb-2">
															<small className="text-muted">Jenis Kelamin</small>
															<div>{profile.jenis_kelamin || '-'}</div>
														</div>
														<div className="mb-2">
															<small className="text-muted"><FaCalendarAlt className="me-1" />Tanggal Lahir</small>
															<div>{profile.tanggal_lahir ? new Date(profile.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</div>
														</div>
														<div>
															<small className="text-muted">Tempat Lahir</small>
															<div>{profile.tempat_lahir || '-'}</div>
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<div className="border rounded p-3 h-100">
														<h6 className="text-muted mb-2">Informasi Kontak & Pelajaran</h6>
														<div className="mb-2">
															<small className="text-muted"><FaBook className="me-1" />Mata Pelajaran</small>
															<div className="fw-bold">{profile.mata_pelajaran || '-'}</div>
														</div>
														<div className="mb-2">
															<small className="text-muted"><FaPhone className="me-1" />No. HP</small>
															<div>{profile.no_hp || profile.nomor_hp || '-'}</div>
														</div>
														<div>
															<small className="text-muted"><FaMapMarkerAlt className="me-1" />Alamat</small>
															<div>{profile.alamat || '-'}</div>
														</div>
													</div>
												</div>
											</div>
										</Col>
									</Row>

									<div className="d-flex justify-content-end gap-2">
										<Button variant="warning" onClick={() => { setShowEditModal(true); setError(''); setSuccess(''); }}>
											<FaEdit className="me-1" /> Edit Profil
										</Button>
										<Button variant="danger" onClick={() => { setShowDeleteModal(true); setError(''); setSuccess(''); }}>
											<FaTrash className="me-1" /> Hapus Akun
										</Button>
									</div>
								</>
							) : (
								<div className="text-center py-5">
									<p>Data profil pengajar tidak ditemukan atau Anda belum login.</p>
								</div>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Edit Modal */}
			<Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Edit Profil</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Nama <span className="text-danger">*</span></Form.Label>
									<Form.Control type="text" value={editData.nama} onChange={(e) => setEditData({ ...editData, nama: e.target.value })} required />
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>NIP</Form.Label>
									<Form.Control type="text" value={editData.nip} onChange={(e) => setEditData({ ...editData, nip: e.target.value })} />
								</Form.Group>
							</Col>
						</Row>

						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Jenis Kelamin</Form.Label>
									<Form.Select value={editData.jenis_kelamin} onChange={(e) => setEditData({ ...editData, jenis_kelamin: e.target.value })}>
										<option value="">Pilih Jenis Kelamin</option>
										<option value="Laki-laki">Laki-laki</option>
										<option value="Perempuan">Perempuan</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Tempat Lahir</Form.Label>
									<Form.Control type="text" value={editData.tempat_lahir} onChange={(e) => setEditData({ ...editData, tempat_lahir: e.target.value })} />
								</Form.Group>
							</Col>
						</Row>

						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Tanggal Lahir</Form.Label>
									<Form.Control type="date" value={editData.tanggal_lahir || ''} onChange={(e) => setEditData({ ...editData, tanggal_lahir: e.target.value })} />
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Mata Pelajaran</Form.Label>
									<Form.Control type="text" value={editData.mata_pelajaran} onChange={(e) => setEditData({ ...editData, mata_pelajaran: e.target.value })} />
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className="mb-3">
							<Form.Label>Alamat</Form.Label>
							<Form.Control as="textarea" rows={3} value={editData.alamat} onChange={(e) => setEditData({ ...editData, alamat: e.target.value })} />
						</Form.Group>

						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>No. HP</Form.Label>
									<Form.Control type="text" value={editData.no_hp} onChange={(e) => setEditData({ ...editData, no_hp: e.target.value })} />
								</Form.Group>
							</Col>
							{/* Field email dihilangkan */}
						</Row>

						<Form.Group className="mb-3">
							<Form.Label>Status</Form.Label>
							<Form.Select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
								<option value="Aktif">Aktif</option>
								<option value="Tidak Aktif">Tidak Aktif</option>
							</Form.Select>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowEditModal(false)}>Batal</Button>
					<Button variant="primary" onClick={handleUpdate} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : 'Simpan'}</Button>
				</Modal.Footer>
			</Modal>

			{/* Delete Modal */}
			<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Konfirmasi Hapus</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Apakah Anda yakin ingin menghapus akun ini?</p>
					<p className="text-danger"><small>Akun yang dihapus tidak dapat dikembalikan.</small></p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Batal</Button>
					<Button variant="danger" onClick={handleDelete} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : 'Hapus Akun'}</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default Profile;

