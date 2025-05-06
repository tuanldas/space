import { WalletBalance } from '@/pages/WalletDetail/WalletBalance.tsx';

const WalletDetailContent = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
          <WalletBalance className="h-full" />
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">

        </div>
      </div>
    </div>
  );
};

export { WalletDetailContent };
