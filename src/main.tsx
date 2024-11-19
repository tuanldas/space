import '@/components/keenicons/assets/duotone/style.css';
import '@/components/keenicons/assets/outline/style.css';
import '@/components/keenicons/assets/filled/style.css';
import '@/components/keenicons/assets/solid/style.css';
import './css/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupAxios } from '@/auth/_helpers.ts';
import axios from 'axios';
import { ProvidersWrapper } from '@/providers';
import { App } from '@/App.tsx';

setupAxios(axios);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProvidersWrapper>
      <App />
    </ProvidersWrapper>
  </StrictMode>
);
