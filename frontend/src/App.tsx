import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SoilReport from './pages/SoilReport.tsx';
import MainLayout from './components/MainLayout.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/soil" element={<MainLayout><SoilReport /></MainLayout>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;