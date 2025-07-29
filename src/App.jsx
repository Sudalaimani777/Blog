import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

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
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Suspense>
  );
};

export default App;
