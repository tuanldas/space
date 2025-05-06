import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import axios from 'axios';
import { setupAxios } from './auth/_helpers';

setupAxios(axios);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
);
