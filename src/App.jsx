import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext'; // Proveedor de multiidioma
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import './App.css';

function App() {
  // Inicializamos darkMode desde localStorage (por defecto true/dark)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('byteforge_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Sincronizamos con localStorage y la clase "dark" del HTML
  useEffect(() => {
    localStorage.setItem('byteforge_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          
          {/* Ruta para el restablecimiento de contraseña con el token dinámico */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route 
            path="/app" 
            element={
              isAuthenticated ? (
                <Layout darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;