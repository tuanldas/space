// Exaxmples of usage:
//* 1. In a background image: <div style={{backgroundImage: `url('${toAbsoluteUrl('/media/misc/pattern-1.jpg')}')`}}>...
//* 2. In img tag: <img src={toAbsoluteUrl('/media/avatars/300-2.jpg')} />
const toAbsoluteUrl = (pathname: string): string => {
  const baseUrl = import.meta.env.BASE_URL;

  if (baseUrl && baseUrl !== '/') {
    return import.meta.env.BASE_URL + pathname;
  } else {
    return pathname;
  }
};

const toBackendImageUrl = (iamgeId: string): string => {
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  if (backendUrl && backendUrl !== '/') {
    return import.meta.env.VITE_APP_BACKEND_URL + '/api/images/' + iamgeId;
  } else {
    return iamgeId;
  }
};

export { toAbsoluteUrl, toBackendImageUrl };
