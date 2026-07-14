import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useRoomStore } from './stores/room.store';
import { LobbyPage } from './pages/LobbyPage';
import { ArenaPage } from './pages/ArenaPage';
export const App = () => {
    const { activeView } = useRoomStore();
    return (_jsx("div", { style: { width: '100%', minHeight: '100vh', background: '#0f111a' }, children: activeView === 'LOBBY' ? _jsx(LobbyPage, {}) : _jsx(ArenaPage, {}) }));
};
