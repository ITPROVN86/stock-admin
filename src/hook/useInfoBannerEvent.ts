import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    BannersQueryParams,
    createBannerEvent,
    deleteBannerEvent,
    getAllBannerEvents,
    toggleBannerEventActive,
    updateBannerEvent,
} from "../apis/banners.api";

const BANNER_EVENTS = "bannerEvents";

export const useInfoBannerEvents = (params: BannersQueryParams) => {
    return useQuery({
        queryKey: [BANNER_EVENTS, params],
        queryFn: () => getAllBannerEvents(params)
    });
};

export const useCreateBannerEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBannerEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BANNER_EVENTS] });
        },
    });
};

export const useUpdateBannerEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
            updateBannerEvent(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BANNER_EVENTS] });
        },
    });
};

export const useDeleteBannerEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBannerEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BANNER_EVENTS] });
        },
    });
};

export function useBannerEventToggle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, active }: { id: number; active: boolean }) =>
            toggleBannerEventActive(id, active),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BANNER_EVENTS] });
        },
    });
}
