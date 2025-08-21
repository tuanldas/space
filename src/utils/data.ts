import { toAbsoluteUrl } from '@/lib/helpers.ts';

export const addDefaultImg = (ev: { target: HTMLImageElement }) => {
    const target = ev.target;
    if (!target.dataset.defaultLoaded && target.src !== toAbsoluteUrl('/media/image.png')) {
        target.src = toAbsoluteUrl('/media/image.png');
        target.dataset.defaultLoaded = 'true';
        target.style.display = 'none';
    }
};
