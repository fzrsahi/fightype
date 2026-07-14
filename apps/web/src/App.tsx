import React from 'react';
import { useRoomStore } from './stores/room.store';
import { LobbyPage } from './pages/LobbyPage';
import { ArenaPage } from './pages/ArenaPage';

export const App: React.FC = () => {
  const { activeView } = useRoomStore();

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0f111a' }}>
      {activeView === 'LOBBY' ? <LobbyPage /> : <ArenaPage />}
    </div>
  );
};
