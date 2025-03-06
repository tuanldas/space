import { ReactElement, useEffect, useState } from 'react';
import { AppRoutingSetup } from '.';
import { useAuthContext } from '@/auth';
import { useLoaders } from '@/providers';
import { useLocation } from 'react-router-dom';

const AppRouting = (): ReactElement => {
  const { setProgressBarLoader } = useLoaders();
  const { setLoading, isAuthenticated } = useAuthContext();
  const [previousLocation, setPreviousLocation] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const location = useLocation();
  const path = location.pathname.trim();

  useEffect(() => {
    if (firstLoad) {
      setLoading(false);
      setFirstLoad(false);
    }
  }, [firstLoad, setLoading]);

  useEffect(() => {
    if (!firstLoad) {
      setProgressBarLoader(true);
      setPreviousLocation(path);
      setProgressBarLoader(false);
      if (path === previousLocation) {
        setPreviousLocation('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (!CSS.escape(window.location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [previousLocation]);

  return <AppRoutingSetup />;
};

export { AppRouting };
