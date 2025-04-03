
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { toast } from 'sonner';

// Add global error handler to catch any unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  toast.error('An unexpected error occurred');
});

console.log('🚀 Application starting...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
