import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ResumeProvider } from './contexts/ResumeContext';

// Lazy load pages
const Layout = lazy(() => import('./Layout'));

// Loading component
const Loading = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <CircularProgress />
  </Box>
);

const App = () => {
  return (
    <ResumeProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </Suspense>
    </ResumeProvider>
  );
};

export default App;
