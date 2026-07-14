import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateRoomRequest, CreateRoomResponse, CheckRoomResponse } from '@fightype/shared';
import { ApiClient } from '../../services/api.client';

export const ROOM_QUERY_KEYS = {
  detail: (roomCode: string) => ['rooms', roomCode] as const,
};

export function useCreateRoomMutation() {
  return useMutation<CreateRoomResponse['data'], Error, CreateRoomRequest>({
    mutationFn: (payload) => ApiClient.createRoom(payload),
  });
}

export function useCheckRoomQuery(roomCode: string, enabled = true) {
  return useQuery<CheckRoomResponse['data'], Error>({
    queryKey: ROOM_QUERY_KEYS.detail(roomCode),
    queryFn: () => ApiClient.checkRoom(roomCode),
    enabled: Boolean(roomCode) && enabled,
    retry: false,
  });
}
