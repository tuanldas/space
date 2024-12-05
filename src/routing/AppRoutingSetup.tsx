import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RequireAuth } from '@/auth';
import { Demo1Layout } from '@/layouts/demo1';
import { DefaultPage } from '@/pages/dashboards';
import { ErrorsRouting } from '@/errors';


const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />

        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
