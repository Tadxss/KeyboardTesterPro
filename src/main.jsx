import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import KeyboardTester from './components/KeyboardTester.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <KeyboardTester />
    </ErrorBoundary>
  </StrictMode>
);
