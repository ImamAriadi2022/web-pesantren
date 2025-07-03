import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useState } from 'react';
import { Button, Form, FormControl, InputGroup, Table } from 'react-bootstrap';
import { FaFilePdf, FaSearch } from 'react-icons/fa';

const KelolaLaporan = () => {
  const [jenisLaporan, setJenisLaporan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [laporan, setLaporan] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const dataSantri = [
    { id: 1, nama: 'Ahmad Fauzi', nis: '001', kelas: '10A', asalSekolah: 'SMP Negeri 1', jenisKelamin: 'Laki-laki', alamat: 'Jl. Mawar No. 1' },
    { id: 2, nama: 'Siti Aminah', nis: '002', kelas: '10B', asalSekolah: 'SMP Negeri 2', jenisKelamin: 'Perempuan', alamat: 'Jl. Melati No. 2' },
    { id: 3, nama: 'Muhammad Rizki', nis: '003', kelas: '11A', asalSekolah: 'SMP Negeri 3', jenisKelamin: 'Laki-laki', alamat: 'Jl. Anggrek No. 3' },
  ];

  const dataAsrama = [
    { id: 1, namaAsrama: 'Asrama A', kapasitas: 50, lokasi: 'Blok A', jenis: 'Putra', penanggungJawab: 'Ustadz 1', fasilitas: 'AC, WiFi', status: 'Aktif' },
    { id: 2, namaAsrama: 'Asrama B', kapasitas: 40, lokasi: 'Blok B', jenis: 'Putri', penanggungJawab: 'Ustadzah 2', fasilitas: 'AC, WiFi', status: 'Aktif' },
  ];

  const handleGenerateLaporan = () => {
    let filteredLaporan = [];
    if (jenisLaporan === 'santri') {
      filteredLaporan = dataSantri;
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
    if (jenisLaporan === 'santri') {
      doc.autoTable({
        head: [['Nama', 'NIS', 'Kelas', 'Asal Sekolah', 'Jenis Kelamin', 'Alamat']],
        body: laporan.map(l => [l.nama, l.nis, l.kelas, l.asalSekolah, l.jenisKelamin, l.alamat]),
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
    if (jenisLaporan === 'santri') {
      return l.nama.toLowerCase().includes(searchTerm.toLowerCase()) || l.nis.toLowerCase().includes(searchTerm.toLowerCase());
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
          <option value="santri">Laporan Data Santri</option>
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
            {jenisLaporan === 'santri' && (
              <>
                <th>Nama</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Asal Sekolah</th>
                <th>Jenis Kelamin</th>
                <th>Alamat</th>
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
              {jenisLaporan === 'santri' && (
                <>
                  <td>{l.nama}</td>
                  <td>{l.nis}</td>
                  <td>{l.kelas}</td>
                  <td>{l.asalSekolah}</td>
                  <td>{l.jenisKelamin}</td>
                  <td>{l.alamat}</td>
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