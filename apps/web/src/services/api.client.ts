import type { CreateRoomRequest, CreateRoomResponse, CheckRoomResponse } from '@fightype/shared';

export class ApiClient {
  static async createRoom(payload: CreateRoomRequest): Promise<CreateRoomResponse['data']> {
    const res = await fetch('/api/v1/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to create room.');
    }
    return json.data;
  }

  static async checkRoom(roomCode: string): Promise<CheckRoomResponse['data']> {
    const res = await fetch(`/api/v1/rooms/${roomCode}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || `Room '${roomCode}' not found or inaccessible.`);
    }
    return json.data;
  }
}
