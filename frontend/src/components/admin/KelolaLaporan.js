import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FaFilePdf, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const KelolaLaporan = () => {
  const [jenisLaporan, setJenisLaporan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [laporan, setLaporan] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const dataKeuangan = [
    { id: 1, kodeTransaksi: 'TRX001', jenisTransaksi: 'Pemasukan', jumlah: 1000000, kategori: 'SPP', tanggalTransaksi: '2023-01-01', metodePembayaran: 'Transfer', keterangan: 'Pembayaran SPP', buktiTransaksi: 'path/to/bukti1.jpg' },
    { id: 2, kodeTransaksi: 'TRX002', jenisTransaksi: 'Pengeluaran', jumlah: 500000, kategori: 'Gaji', tanggalTransaksi: '2023-01-10', metodePembayaran: 'Cash', keterangan: 'Pembayaran Gaji', buktiTransaksi: 'path/to/bukti2.jpg' },
  ];

  const dataAsrama = [
    { id: 1, namaAsrama: 'Asrama A', kapasitas: 50, lokasi: 'Blok A', jenis: 'Putra', penanggungJawab: 'Ustadz 1', fasilitas: 'AC, WiFi', status: 'Aktif' },
    { id: 2, namaAsrama: 'Asrama B', kapasitas: 40, lokasi: 'Blok B', jenis: 'Putri', penanggungJawab: 'Ustadzah 2', fasilitas: 'AC, WiFi', status: 'Aktif' },
  ];

  const handleGenerateLaporan = () => {
    let filteredLaporan = [];
    if (jenisLaporan === 'keuangan') {
      filteredLaporan = dataKeuangan.filter(d => d.tanggalTransaksi >= tanggalMulai && d.tanggalTransaksi <= tanggalSelesai);
    } else if (jenisLaporan === 'asrama') {
      filteredLaporan = dataAsrama; // Asrama data does not have date filtering
    }
    setLaporan(filteredLaporan);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    if (jenisLaporan === 'keuangan') {
      doc.autoTable({
        head: [['Kode Transaksi', 'Jenis Transaksi', 'Jumlah', 'Kategori', 'Tanggal Transaksi', 'Metode Pembayaran', 'Keterangan']],
        body: laporan.map(l => [l.kodeTransaksi, l.jenisTransaksi, l.jumlah, l.kategori, l.tanggalTransaksi, l.metodePembayaran, l.keterangan]),
      });
    } else if (jenisLaporan === 'asrama') {
      doc.autoTable({
        head: [['Nama Asrama', 'Kapasitas', 'Lokasi', 'Jenis', 'Penanggung Jawab', 'Fasilitas', 'Status']],
        body: laporan.map(l => [l.namaAsrama, l.kapasitas, l.lokasi, l.jenis, l.penanggungJawab, l.fasilitas, l.status]),
      });
    }
    doc.save('laporan.pdf');
  };

  const filteredLaporan = laporan.filter(l => {
    if (jenisLaporan === 'keuangan') {
      return l.kodeTransaksi.toLowerCase().includes(searchTerm.toLowerCase()) || l.jenisTransaksi.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (jenisLaporan === 'asrama') {
      return l.namaAsrama.toLowerCase().includes(searchTerm.toLowerCase()) || l.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <div>
      <h2>Kelola Laporan</h2>
      <div className="d-flex mb-3">
        <Form.Select className="me-2" value={jenisLaporan} onChange={(e) => setJenisLaporan(e.target.value)}>
          <option value="">Pilih Jenis Laporan</option>
          <option value="keuangan">Laporan Keuangan</option>
          <option value="asrama">Laporan Asrama</option>
          {/* Tambahkan jenis laporan lainnya di sini */}
        </Form.Select>
        <Form.Control type="date" className="me-2" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} />
        <Form.Control type="date" className="me-2" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} />
        <Button variant="primary" onClick={handleGenerateLaporan}>Generate Laporan</Button>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-25">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl type="text" placeholder="Cari..." value={searchTerm} onChange={handleSearch} />
        </InputGroup>
        <Button variant="outline-danger" onClick={handleExportPDF}><FaFilePdf /> Cetak PDF</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {jenisLaporan === 'keuangan' && (
              <>
                <th>Kode Transaksi</th>
                <th>Jenis Transaksi</th>
                <th>Jumlah</th>
                <th>Kategori</th>
                <th>Tanggal Transaksi</th>
                <th>Metode Pembayaran</th>
                <th>Keterangan</th>
              </>
            )}
            {jenisLaporan === 'asrama' && (
              <>
                <th>Nama Asrama</th>
                <th>Kapasitas</th>
                <th>Lokasi</th>
                <th>Jenis</th>
                <th>Penanggung Jawab</th>
                <th>Fasilitas</th>
                <th>Status</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredLaporan.map(l => (
            <tr key={l.id}>
              {jenisLaporan === 'keuangan' && (
                <>
                  <td>{l.kodeTransaksi}</td>
                  <td>{l.jenisTransaksi}</td>
                  <td>{l.jumlah}</td>
                  <td>{l.kategori}</td>
                  <td>{l.tanggalTransaksi}</td>
                  <td>{l.metodePembayaran}</td>
                  <td>{l.keterangan}</td>
                </>
              )}
              {jenisLaporan === 'asrama' && (
                <>
                  <td>{l.namaAsrama}</td>
                  <td>{l.kapasitas}</td>
                  <td>{l.lokasi}</td>
                  <td>{l.jenis}</td>
                  <td>{l.penanggungJawab}</td>
                  <td>{l.fasilitas}</td>
                  <td>{l.status}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default KelolaLaporan;