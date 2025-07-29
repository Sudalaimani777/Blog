import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { Box, CircularProgress } from '@mui/material';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home'));
const About = lazy(() => import('./Pages/About'));
const Contact = lazy(() => import('./Pages/Contact'));
const Resume = lazy(() => import('./Pages/Resume'));

// Loading component
const Loading = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh' 
  }}>
    <CircularProgress />
  </Box>
);

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Layout;