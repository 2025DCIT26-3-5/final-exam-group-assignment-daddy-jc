import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserSignUp } from './components/user/UserSignUp';
import { UserLogin } from './components/user/UserLogin';
import { UserDashboard } from './components/user/UserDashboard';
import { ResponderLogin } from './components/responder/ResponderLogin';
import { ResponderDashboard } from './components/responder/ResponderDashboard';
import { useEffect, useState } from 'react';

export default function App() {
  const [userAuth, setUserAuth] = useState<string | null>(null);
  const [responderAuth, setResponderAuth] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth tokens
    const userToken = localStorage.getItem('userToken');
    const responderToken = localStorage.getItem('responderToken');
    
    if (userToken) setUserAuth(userToken);
    if (responderToken) setResponderAuth(responderToken);
  }, []);

  const handleUserLogin = (token: string) => {
    localStorage.setItem('userToken', token);
    setUserAuth(token);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    setUserAuth(null);
  };

  const handleResponderLogin = (token: string) => {
    localStorage.setItem('responderToken', token);
    setResponderAuth(token);
  };

  const handleResponderLogout = () => {
    localStorage.removeItem('responderToken');
    setResponderAuth(null);
  };

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route 
          path="/" 
          element={
            userAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            userAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <UserSignUp onSignUp={handleUserLogin} />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            userAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <UserLogin onLogin={handleUserLogin} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            userAuth ? (
              <UserDashboard onLogout={handleUserLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Responder Routes */}
        <Route 
          path="/responder" 
          element={
            responderAuth ? (
              <Navigate to="/responder/dashboard" replace />
            ) : (
              <Navigate to="/responder/login" replace />
            )
          } 
        />
        <Route 
          path="/responder/login" 
          element={
            responderAuth ? (
              <Navigate to="/responder/dashboard" replace />
            ) : (
              <ResponderLogin onLogin={handleResponderLogin} />
            )
          } 
        />
        <Route 
          path="/responder/dashboard" 
          element={
            responderAuth ? (
              <ResponderDashboard onLogout={handleResponderLogout} />
            ) : (
              <Navigate to="/responder/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}
