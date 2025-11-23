import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { WatchPage } from './pages/WatchPage';
import './App.css';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('auth-email');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/watch"
          element={isAuthenticated() ? <WatchPage /> : <Navigate to="/auth" replace />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated() ? '/watch' : '/auth'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
