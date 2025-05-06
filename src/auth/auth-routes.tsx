import {RouteObject} from 'react-router-dom';
import {ClassicLayout} from './layouts/classic';
import {CallbackPage} from './pages/callback-page';
import Login from '@/pages/Auth/login.tsx';

// Define the auth routes
export const authRoutes: RouteObject[] = [
  {
    path: '',
    element: <ClassicLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      }
    ],
  },
  {
    path: 'callback',
    element: <CallbackPage />,
  },
];
