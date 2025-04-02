
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider';
import { QueryProvider } from './providers/QueryProvider';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './providers/AuthProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryProvider>
          <AuthProvider>
            <LocationProvider>
              <App />
            </LocationProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
