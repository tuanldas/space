import { useLocation } from 'react-router-dom';

const WalletDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Lấy giá trị của một query param cụ thể
  const paramValue = queryParams.get('walletId');
  console.log(paramValue);
  return (
    <>
    </>
  );
};

export default WalletDetail;