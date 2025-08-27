import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const LP_TentangKami = () => {
  const [settings, setSettings] = useState({});

  // Fetch website settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/get_settings.php');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data || {});
      } else {
        // Set default settings if API returns error
        setSettings({
          tentang_web: 'Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
          nama_pimpinan: 'KH. Ahmad Dahlan',
          nama_instansi: 'Pondok Pesantren Walisongo Lampung Utara',
          judul_web: 'Pondok Pesantren Walisongo',
          caption_web: '',
          logo_web: ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings if API fails
      setSettings({
        tentang_web: 'Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
        nama_pimpinan: 'KH. Ahmad Dahlan',
        nama_instansi: 'Pondok Pesantren Walisongo Lampung Utara',
        judul_web: 'Pondok Pesantren Walisongo',
        caption_web: '',
        logo_web: ''
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <div className="mb-5 text-start">
          <h2>{settings.judul_web || 'Tentang Kami'}</h2>
          <p>{settings.caption_web || 'Berikut adalah sejarah tentang kami'}</p>
        </div>
        <div>
          <Row className="mb-5">
            <Col md={4}>
              {settings.logo_web ? (
                <img
                  src={settings.logo_web}
                  alt="Logo Pesantren"
                  className="img-fluid mb-3"
                  style={{ width: '100%', height: 'auto', borderRadius: '10px', maxHeight: '300px', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src="/landing/masjid1.jpg"
                  alt="Foto Pimpinan"
                  className="img-fluid mb-3"
                  style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                />
              )}
            </Col>
            <Col md={8} className="text-start">
              <h3>Sambutan Pimpinan</h3>
              <h5 style={{ color: '#006400', marginBottom: '1rem' }}>
                {settings.nama_pimpinan || 'KH. Ahmad Dahlan'}
              </h5>
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Assalamu'alaikum warahmatullahi wabarakatuh,
              </p>
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Selamat datang di {settings.nama_instansi || 'Pondok Pesantren Walisongo Lampung Utara'}. 
                {settings.tentang_web ? (
                  settings.tentang_web
                ) : (
                  'Kami berkomitmen untuk mendidik generasi muda dengan landasan agama yang kuat dan pengetahuan yang luas, sehingga mereka dapat menjadi pemimpin yang berakhlak mulia dan bermanfaat bagi masyarakat.'
                )}
              </p>
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Wassalamu'alaikum warahmatullahi wabarakatuh.
              </p>
            </Col>
          </Row>
          <div className="text-start">
            <h3>Sejarah {settings.nama_instansi || 'Pesantren'}</h3>
            <div style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              {settings.tentang_web ? (
                <div>
                  <p>{settings.tentang_web}</p>
                  {settings.caption_web && (
                    <p>{settings.caption_web}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p>
                    Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur'ani yang berakhlak mulia dan berprestasi.
                  </p>
                  <p>
                    Pesantren ini didirikan dengan visi untuk menciptakan generasi muslim yang tidak hanya 
                    menguasai ilmu agama, tetapi juga mampu menghadapi tantangan zaman modern dengan tetap 
                    berpegang teguh pada nilai-nilai Islam. Dengan fasilitas yang memadai dan tenaga pengajar 
                    yang kompeten, kami berusaha memberikan pendidikan terbaik bagi para santri.
                  </p>
                  <p>
                    Kurikulum yang kami terapkan menggabungkan pendidikan agama dan umum, sehingga para santri 
                    dapat berkembang secara holistik. Kami juga mengembangkan berbagai kegiatan ekstrakurikuler 
                    untuk mengasah bakat dan minat santri dalam berbagai bidang.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default LP_TentangKami;
