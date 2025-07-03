import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// landign page routes
import Asrama from './pages/Landing/Asrama';
import DataSantri from './pages/Landing/DataSantri';
import DataUstadz from './pages/Landing/DataUstadz';
import Kontak from './pages/Landing/Kontak';
import Psb from './pages/Landing/Psb';
import TentangKami from './pages/Landing/TentangKami';
import LandingPage from './pages/LandingPage';

// admin routes
import AdminMain from './pages/admin/Main';

// pengajar route
import PengajarMain from './pages/pengajar/Pengajar';

// santri route
import SantriMain from './pages/santri/Santri';

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

          {/* pengajar router */}
          <Route path="/pengajar/*" element={<PengajarMain />} />

          {/* santri router */}
          <Route path="/santri/*" element={<SantriMain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;