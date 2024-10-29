import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import resources from './locales';
import i18next from 'i18next';

const lng = localStorage.getItem('lng') || 'en';
const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: lng,
  interpolation: {
    escapeValue: false,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
);
