import { create } from 'zustand';
export const useRoomStore = create((set) => ({
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
