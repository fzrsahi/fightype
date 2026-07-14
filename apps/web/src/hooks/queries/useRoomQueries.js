import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiClient } from '../../services/api.client';
export const ROOM_QUERY_KEYS = {
    detail: (roomCode) => ['rooms', roomCode],
};
export function useCreateRoomMutation() {
    return useMutation({
        mutationFn: (payload) => ApiClient.createRoom(payload),
    });
}
export function useCheckRoomQuery(roomCode, enabled = true) {
    return useQuery({
        queryKey: ROOM_QUERY_KEYS.detail(roomCode),
        queryFn: () => ApiClient.checkRoom(roomCode),
        enabled: Boolean(roomCode) && enabled,
        retry: false,
    });
}
