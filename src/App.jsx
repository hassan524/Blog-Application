import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './data/context/AuthContext';
import Layout from './layout/Layout'; 
import Log from './pages/log';
import Sign from './pages/sign';

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* the main layout route */}
        <Route path="/" element={<Layout />}>
        
          <Route path="/log" element={<Log />} />
          <Route path="/Sign" element={<Sign />} />

        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
