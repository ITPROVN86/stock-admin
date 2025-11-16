
import { BannerEvent } from "../../../apis/banners.api";

export interface BannerEventProps {
    banners: {
        items: BannerEvent[];
        total: number;
    };
}

