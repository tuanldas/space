import { Activity } from "./components/activity";
import { Assets } from "./components/assets";
import {useToolbar} from '@/layouts/demo6/layout.tsx';
import {useEffect} from 'react';

const WalletDetailContent = () => {
    const {setToolbarTitle} = useToolbar();

    useEffect(() => {
        setToolbarTitle("WalletDetail");
    }, [setToolbarTitle]);

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          <div className="col-span-1">
              <div className="grid gap-5 lg:gap-7.5">
                  <Assets />
              </div>
          </div>
          <div className="col-span-1 lg:col-span-2">
              <div className="flex flex-col gap-5 lg:gap-7.5">
                  <div className="flex flex-col gap-5 lg:gap-7.5">
                      <Activity />
                  </div>
              </div>
          </div>
      </div>
  );
};

export { WalletDetailContent };
