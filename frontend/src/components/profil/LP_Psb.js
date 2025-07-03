import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const pdfSrc = "/sample.pdf"; // Pastikan file PDF berada di direktori public
const whatsappContact = "+62 812-3456-7890";
const emailContact = "info@pesantrenwalisongo.com";

const LP_Psb = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <div className="mb-5 text-start">
          <h2>Penerimaan Santri Baru</h2>
          <p>Berikut adalah informasi mengenai penerimaan santri baru di Pondok Pesantren Walisongo Lampung Utara</p>
        </div>
        <Row>
          <Col md={8}>
            <div style={{ height: '500px' }}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfSrc} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Informasi</Card.Title>
                <Card.Text>
                  Jika ada informasi yang kurang jelas dapat menghubungi panitia pendaftaran melalui kontak dibawah ini:
                </Card.Text>
                <div className="d-flex align-items-center">
                  <FaWhatsapp style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                  <span>{whatsappContact}</span>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <FaEnvelope style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                  <span>{emailContact}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LP_Psb;