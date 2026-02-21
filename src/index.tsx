import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './App.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const shouldUpdate = window.confirm(
      'Доступна новая версия приложения. Нажмите ОК для обновления.'
    );
    if (shouldUpdate) {
      window.location.reload();
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  },
  onSuccess: (registration) => {
    console.log('PWA приложение успешно установлено');
  }
});