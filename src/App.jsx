import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './data/context/AuthContext';
import Layout from './layout/Layout';
import Log from './pages/log';
import Sign from './pages/sign';
import Blogs from './main/Blogs';
import MyBlogs from './main/MyBlogs';
import Profile from './pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* the main layout route */}
        <Route path="/" element={<Layout />}>

          <Route path="/log" element={<Log />} />
          <Route path="/Sign" element={<Sign />} />
          <Route path="/UploadBlogs" element={<Blogs />} />

        </Route>

        <Route path="/MyBlogs" element={<MyBlogs/>} />
        <Route path="/Profile" element={<Profile />} />


      </Routes>
    </AuthProvider>
  );
};

export default App;
