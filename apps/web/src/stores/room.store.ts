import { create } from 'zustand';

export interface Player {
  userId: string;
  nickname: string;
  isReady: boolean;
  progress: number;
  wpm: number;
  accuracy: number;
  combo: number;
  hp: number;
}

export interface RoomState {
  roomCode: string | null;
  hostNickname: string | null;
  gameMode: string | null;
  status: 'LOBBY' | 'IN_PROGRESS' | 'FINISHED' | null;
  players: Player[];
  activeView: 'LOBBY' | 'ARENA';
  setRoomInfo: (code: string, host: string, mode: string) => void;
  setStatus: (status: 'LOBBY' | 'IN_PROGRESS' | 'FINISHED') => void;
  setView: (view: 'LOBBY' | 'ARENA') => void;
  setPlayers: (players: Player[]) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomCode: null,
  hostNickname: null,
  gameMode: '1v1',
  status: null,
  players: [],
  activeView: 'LOBBY',
  setRoomInfo: (code, host, mode) => set({ roomCode: code, hostNickname: host, gameMode: mode }),
  setStatus: (status) => set({ status }),
  setView: (view) => set({ activeView: view }),
  setPlayers: (players) => set({ players }),
}));
