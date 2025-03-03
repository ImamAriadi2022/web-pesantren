import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFilePdf, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaKeuangan = () => {
  const [keuangan, setKeuangan] = useState([
    // Contoh data keuangan
    { id: 1, kodeTransaksi: 'TRX001', jenisTransaksi: 'Pemasukan', jumlah: 1000000, kategori: 'SPP', tanggalTransaksi: '2023-01-01', metodePembayaran: 'Transfer', keterangan: 'Pembayaran SPP', buktiTransaksi: 'path/to/bukti1.jpg' },
    { id: 2, kodeTransaksi: 'TRX002', jenisTransaksi: 'Pengeluaran', jumlah: 500000, kategori: 'Gaji', tanggalTransaksi: '2023-01-10', metodePembayaran: 'Cash', keterangan: 'Pembayaran Gaji', buktiTransaksi: 'path/to/bukti2.jpg' },
    // Tambahkan data keuangan lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalKeuangan, setModalKeuangan] = useState({ id: null, kodeTransaksi: '', jenisTransaksi: '', jumlah: '', kategori: '', tanggalTransaksi: '', metodePembayaran: '', keterangan: '', buktiTransaksi: '' });

  const handleAddKeuangan = () => {
    setModalKeuangan({ id: null, kodeTransaksi: '', jenisTransaksi: '', jumlah: '', kategori: '', tanggalTransaksi: '', metodePembayaran: '', keterangan: '', buktiTransaksi: '' });
    setShowModal(true);
  };

  const handleEditKeuangan = (id) => {
    const keuanganData = keuangan.find(k => k.id === id);
    setModalKeuangan(keuanganData);
    setShowModal(true);
  };

  const handleDeleteKeuangan = (id) => {
    setKeuangan(keuangan.filter(k => k.id !== id));
  };

  const handleDetailKeuangan = (id) => {
    const keuanganData = keuangan.find(k => k.id === id);
    setModalKeuangan(keuanganData);
    setShowDetailModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveKeuangan = () => {
    if (modalKeuangan.id) {
      setKeuangan(keuangan.map(k => (k.id === modalKeuangan.id ? modalKeuangan : k)));
    } else {
      setKeuangan([...keuangan, { ...modalKeuangan, id: keuangan.length + 1 }]);
    }
    setShowModal(false);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setModalKeuangan({ ...modalKeuangan, buktiTransaksi: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const filteredKeuangan = keuangan.filter(k =>
    k.kodeTransaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.jenisTransaksi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKeuangan.length / itemsPerPage);
  const displayedKeuangan = filteredKeuangan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Keuangan</h2>
      <Button variant="primary" onClick={handleAddKeuangan} className="mb-3">Tambahkan Transaksi Baru</Button>
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-25">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl type="text" placeholder="Cari..." value={searchTerm} onChange={handleSearch} />
        </InputGroup>
      </div>
      <Table striped bordered hover id="printableTable">
        <thead>
          <tr>
            <th>Kode Transaksi</th>
            <th>Jenis Transaksi</th>
            <th>Jumlah</th>
            <th>Kategori</th>
            <th>Tanggal Transaksi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedKeuangan.map(k => (
            <tr key={k.id}>
              <td>{k.kodeTransaksi}</td>
              <td>{k.jenisTransaksi}</td>
              <td>{k.jumlah}</td>
              <td>{k.kategori}</td>
              <td>{k.tanggalTransaksi}</td>
              <td>
                <Button variant="info" className="me-2" onClick={() => handleDetailKeuangan(k.id)}><FaInfoCircle /></Button>
                <Button variant="warning" className="me-2" onClick={() => handleEditKeuangan(k.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteKeuangan(k.id)}><FaTrash /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between">
        <Form.Select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{ width: '100px' }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Select>
        <div>
          <Button variant="outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
          <span className="mx-2">{currentPage} / {totalPages}</span>
          <Button variant="outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalKeuangan.id ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Transaksi</Form.Label>
              <Form.Control as="select" value={modalKeuangan.jenisTransaksi} onChange={(e) => setModalKeuangan({ ...modalKeuangan, jenisTransaksi: e.target.value })}>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Transaksi</Form.Label>
              <Form.Control type="date" value={modalKeuangan.tanggalTransaksi} onChange={(e) => setModalKeuangan({ ...modalKeuangan, tanggalTransaksi: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control type="number" placeholder="Jumlah" value={modalKeuangan.jumlah} onChange={(e) => setModalKeuangan({ ...modalKeuangan, jumlah: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Control type="text" placeholder="Kategori" value={modalKeuangan.kategori} onChange={(e) => setModalKeuangan({ ...modalKeuangan, kategori: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Metode Pembayaran</Form.Label>
              <Form.Control type="text" placeholder="Metode Pembayaran" value={modalKeuangan.metodePembayaran} onChange={(e) => setModalKeuangan({ ...modalKeuangan, metodePembayaran: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan Transaksi</Form.Label>
              <Form.Control type="text" placeholder="Keterangan Transaksi" value={modalKeuangan.keterangan} onChange={(e) => setModalKeuangan({ ...modalKeuangan, keterangan: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bukti Transaksi</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handlePdfUpload} />
              {modalKeuangan.buktiTransaksi && <p className="mt-2">Bukti transaksi telah diunggah</p>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveKeuangan}>Simpan</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kode Transaksi</Form.Label>
              <Form.Control type="text" value={modalKeuangan.kodeTransaksi} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Transaksi</Form.Label>
              <Form.Control type="text" value={modalKeuangan.jenisTransaksi} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Transaksi</Form.Label>
              <Form.Control type="text" value={modalKeuangan.tanggalTransaksi} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control type="text" value={modalKeuangan.jumlah} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Control type="text" value={modalKeuangan.kategori} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Metode Pembayaran</Form.Label>
              <Form.Control type="text" value={modalKeuangan.metodePembayaran} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan Transaksi</Form.Label>
              <Form.Control type="text" value={modalKeuangan.keterangan} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bukti Transaksi</Form.Label>
              {modalKeuangan.buktiTransaksi && (
                <img src={modalKeuangan.buktiTransaksi} alt="Bukti Transaksi" style={{ width: '100%' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaKeuangan;