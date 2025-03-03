import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// landign page routes
import LandingPage from './pages/LandingPage';
import TentangKami from './pages/Landing/TentangKami';
import DataSantri from './pages/Landing/DataSantri';
import DataUstadz from './pages/Landing/DataUstadz';
import Asrama from './pages/Landing/Asrama';
import Psb from './pages/Landing/Psb';
import Kontak from './pages/Landing/Kontak';

// admin routes
import AdminMain from './pages/admin/Main';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* landing page router */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/data-santri" element={<DataSantri/>} />
          <Route path="/data-ustadz" element={<DataUstadz/>} />
          <Route path="/asrama" element={<Asrama/>} />
          <Route path="/psb" element={<Psb/>} />
          <Route path="/kontak" element={<Kontak/>} />

          {/* admin router */}
          <Route path="/admin/*" element={<AdminMain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;