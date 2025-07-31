import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import 'date-fns/locale/en-US' // Import the locale you want to use
import './index.css'

// Lazy load the main App component
const App = lazy(() => import('./App'))

// Loading component
const Loading = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <CircularProgress />
  </Box>
)

// Create the root element
const root = createRoot(document.getElementById('root'));

// Render the app
root.render(
  <StrictMode>
    <BrowserRouter>
      <LocalizationProvider 
        dateAdapter={AdapterDateFns}
        adapterLocale="en-US"
      >
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </LocalizationProvider>
    </BrowserRouter>
  </StrictMode>
);
