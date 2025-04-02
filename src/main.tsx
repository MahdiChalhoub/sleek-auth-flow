
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider';
import { QueryProvider } from './providers/QueryProvider';
import { LocationProvider } from './contexts/LocationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
