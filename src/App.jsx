import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Loads from './components/Loads';

function App() {

  const auth = useSelector((state) => {
    console.log('Redux State:', state); // Debug state
    return state.auth || {};
  });
  const { token } = auth;

  return(
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/loads" element={token ? <Loads /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
    </Routes>
  )

}

export default App
