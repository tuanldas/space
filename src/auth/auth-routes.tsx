import { RouteObject } from 'react-router-dom';
import { ClassicLayout } from './layouts/classic';
import { SignInPage } from './pages/signin-page';

// Define the auth routes
export const authRoutes: RouteObject[] = [
    {
        path: '',
        element: <ClassicLayout />,
        children: [
            {
                path: 'signin',
                element: <SignInPage />,
            },
        ],
    },
];
