import api from "./axiosCustom";
import { appUrls } from "./contants";



export interface BannerEvent {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    active: boolean;
    startTime: Date;
    endTime: Date;
}

export interface BannersQueryParams {
    title?: string;
    active?: "true" | "false";
    page?: number;
    pageSize?: number;
}

export const getAllBannerEvents = async (params: BannersQueryParams): Promise<{items: BannerEvent[], total: number}> => {
    const response = await api.get(`${appUrls.tradeURL}/admin/banners`, { params });
    return response.data.data;
};

export const getBannerEventById = async (id: number): Promise<BannerEvent> => {
    const response = await api.get(`${appUrls.tradeURL}/admin/banners/${id}`);
    return response.data.data;
};

export const createBannerEvent = async (
    contest: FormData
): Promise<BannerEvent> => {
    const response = await api.post(
        `${appUrls.tradeURL}/admin/banners`,
        contest,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data.data;
};

export const updateBannerEvent = async (
    id: number,
    formData: FormData
): Promise<BannerEvent> => {
    const res = await api.put(
        `${appUrls.tradeURL}/admin/banners/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data.data;
};

export const deleteBannerEvent = async (id: number): Promise<boolean> => {
    const response = await api.delete(`${appUrls.tradeURL}/admin/banners/${id}`);
    return response.data.data;
};

export async function toggleBannerEventActive(id: number, active: boolean) {
    const response = await api.put(`${appUrls.tradeURL}/admin/banners/${id}/${active ? "activate" : "deactivate"}`);
    return response.data.data;
}
