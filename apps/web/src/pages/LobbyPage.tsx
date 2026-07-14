import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRoomStore } from '../stores/room.store';
import { useCreateRoomMutation, ROOM_QUERY_KEYS } from '../hooks/queries/useRoomQueries';
import { ApiClient } from '../services/api.client';

export const LobbyPage: React.FC = () => {
  const { setRoomInfo, setView } = useRoomStore();
  const queryClient = useQueryClient();
  const createRoomMutation = useCreateRoomMutation();

  const [nickname, setNickname] = useState('TerrariaFighter');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = createRoomMutation.isPending || isJoining;

  const handleCreateRoom = async () => {
    if (!nickname || nickname.length < 2) {
      setError('Nickname must be at least 2 characters long.');
      return;
    }
    setError(null);
    try {
      const res = await createRoomMutation.mutateAsync({
        hostNickname: nickname,
        gameMode: '1v1',
        settings: { timeLimit: 60, wordSource: 'id_standard', difficulty: 'normal', theme: 'fighting', skillSystem: true },
      });
      setRoomInfo(res.roomCode, nickname, '1v1');
      setView('ARENA');
    } catch (err: any) {
      setError(err.message || 'Failed to create room.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCodeInput || roomCodeInput.length < 3) {
      setError('Please enter a valid room code.');
      return;
    }
    setIsJoining(true);
    setError(null);
    const code = roomCodeInput.toUpperCase();
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ROOM_QUERY_KEYS.detail(code),
        queryFn: () => ApiClient.checkRoom(code),
      });
      setRoomInfo(data.roomCode, data.hostNickname, data.gameMode);
      setView('ARENA');
    } catch (err: any) {
      setError(err.message || 'Failed to join room.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <h1 className="pixel-font" style={{ fontSize: '36px', color: '#00ff88', marginBottom: '12px', textShadow: '0 0 20px rgba(0, 255, 136, 0.5)' }}>
        FighType ⚔️
      </h1>
      <p style={{ color: '#8899aa', marginBottom: '40px', fontSize: '18px' }}>
        "Typing is the core mechanic. Gaming is the experience."
      </p>

      {error && (
        <div style={{ background: 'rgba(255, 0, 85, 0.2)', border: '1px solid #ff0055', color: '#ff0055', padding: '12px 24px', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <div style={{
        background: 'rgba(26, 32, 53, 0.85)',
        padding: '36px',
        borderRadius: '16px',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '480px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#8899aa', fontSize: '14px' }}>YOUR NICKNAME</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #4a5568',
              background: '#0f111a',
              color: '#ffffff',
              fontSize: '16px'
            }}
          />
        </div>

        <button
          onClick={handleCreateRoom}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            background: '#00ff88',
            color: '#0f111a',
            fontWeight: 'bold',
            fontSize: '18px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '24px',
            transition: 'transform 0.1s'
          }}
        >
          {loading ? 'Processing...' : 'CREATE BATTLE ROOM'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#8899aa' }}>
          <div style={{ flex: 1, height: '1px', background: '#4a5568' }} />
          <span style={{ padding: '0 16px', fontSize: '14px' }}>OR JOIN EXISTING</span>
          <div style={{ flex: 1, height: '1px', background: '#4a5568' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="ROOM CODE (e.g. FT-9823)"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #4a5568',
              background: '#0f111a',
              color: '#ffffff',
              fontSize: '16px',
              textTransform: 'uppercase'
            }}
          />
          <button
            onClick={handleJoinRoom}
            disabled={loading}
            style={{
              padding: '14px 24px',
              borderRadius: '8px',
              border: '1px solid #00eafe',
              background: 'transparent',
              color: '#00eafe',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            JOIN
          </button>
        </div>
      </div>
    </div>
  );
};
