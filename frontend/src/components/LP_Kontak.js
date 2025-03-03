import React from 'react';
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const contactInfo = {
  email: 'example@example.com',
  whatsapp: '+1234567890',
  address: 'Jl. Contoh Alamat No. 123, Kota Contoh, Indonesia',
  mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.9200000000005!2d-122.08400000000001!3d37.42199999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5e0d0000000%3A0x0000000000000000!2sGoogleplex!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus'
};

const LP_Kontak = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Kontak Kami</h2>
      <p>Untuk bertanya terkait kendala apapun itu, dapat menghubungi pada Pusat bantuan dibawah ini</p>
      <div style={{ margin: '20px 0' }}>
        <FaEnvelope size={40} style={{ margin: '0 10px' }} />
        <FaWhatsapp size={40} style={{ margin: '0 10px' }} />
      </div>
      <div style={{ margin: '20px 0' }}>
        <hr />
        <p>{contactInfo.address}</p>
        <hr />
      </div>
      <iframe
        src={contactInfo.mapSrc}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        title="Google Maps"
      ></iframe>
    </div>
  );
};

export default LP_Kontak;