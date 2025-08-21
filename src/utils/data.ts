import { toAbsoluteUrl } from "@/lib/helpers.ts";

export const addDefaultImg = (ev: any) => {
    if (!ev.target.dataset.defaultLoaded && ev.target.src !== toAbsoluteUrl("/media/image.png")) {
        ev.target.src = toAbsoluteUrl("/media/image.png");
        ev.target.dataset.defaultLoaded = "true";
        ev.target.style.display = "none";
    }
};
