import {toAbsoluteUrl} from '@/lib/helpers.ts';

export const renderCurrency = (amount: number, currency: string): string => {
    return (
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) +
        ' ' +
        currency
    );
};

export const addDefaultImg = (ev: any) => {
    if (!ev.target.dataset.defaultLoaded && ev.target.src !== toAbsoluteUrl('/media/image.png')) {
        ev.target.src = toAbsoluteUrl('/media/image.png');
        ev.target.dataset.defaultLoaded = 'true';
        ev.target.style.display = 'none';
    }
};
