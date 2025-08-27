import React from 'react';
import CustomNavbar from '../components/Navbar';
import LPHero from '../components/LP_Hero';
import LPData from '../components/LP_Data';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
        <CustomNavbar />
        <LPHero />
        <LPData />
        <Footer />
      {/* Konten lain dari LandingPage */}
    </div>
  );
}

export default LandingPage;
