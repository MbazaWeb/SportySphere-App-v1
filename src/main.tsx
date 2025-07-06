import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent pull-to-refresh on iOS
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);