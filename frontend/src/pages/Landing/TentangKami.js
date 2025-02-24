import React from 'react';
import LP_TentangKami from '../../components/profil/LP_TentangKami';
import CustomNavbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TentangKami = () => {
  return (
    <div>
        <CustomNavbar />
        <LP_TentangKami />
        <Footer />
      {/* Konten lain dari TentangKami */}
    </div>
  );
}

export default TentangKami;