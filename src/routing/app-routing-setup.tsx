import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo6Layout } from '@/layouts/demo6/layout.tsx';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<Demo6Layout />}>
                    <Route path="/" element={<div />} />
                </Route>
            </Route>
            <Route path="error/*" element={<ErrorRouting />} />
            <Route path="auth/*" element={<AuthRouting />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
