import React, { useState, useRef, useEffect } from 'react';
import { useRoomStore } from '../stores/room.store';
import { StatsHUD } from '../components/hud/StatsHUD';
import { TypingArea } from '../components/typing/TypingArea';
import { CanvasController } from '../presentation/CanvasController';

const TARGET_TEXT = 'Pedang cahaya menebas gelap malam dengan kecepatan kilat, ksatria naga bersiap melancarkan serangan combo mematikan untuk merebut kemenangan mutlak!';

export const ArenaPage: React.FC = () => {
  const { roomCode, hostNickname, setView } = useRoomStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<CanvasController | null>(null);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [hp, setHp] = useState(100);

  useEffect(() => {
    if (canvasRef.current && !controllerRef.current) {
      const controller = new CanvasController();
      controller.attach(canvasRef.current);
      controller.updatePlayers([
        { id: 'player1', hp: 100, combo: 0, progress: 0 },
        { id: 'player2', hp: 100, combo: 0, progress: 0 }
      ]);
      controllerRef.current = controller;
    }

    return () => {
      controllerRef.current?.detach();
      controllerRef.current = null;
    };
  }, []);

  const handleStatsUpdate = (newWpm: number, newAccuracy: number, newCombo: number, progress: number) => {
    setWpm(newWpm);
    setAccuracy(newAccuracy);
    setCombo(newCombo);
    if (newAccuracy < 90 && newAccuracy < accuracy) {
      setHp((prev) => Math.max(10, prev - 2));
    }
    if (controllerRef.current) {
      controllerRef.current.updatePlayers([
        { id: 'player1', hp, combo: newCombo, progress },
        { id: 'player2', hp: Math.max(0, 100 - progress * 0.8), combo: 0, progress: progress * 0.7 }
      ]);
    }
  };

  const handleAttackTrigger = (power: number) => {
    setHp((prev) => Math.min(100, prev + 5));
    if (controllerRef.current) {
      controllerRef.current.triggerAttack('player1', 'player2', power);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ color: '#8899aa', fontSize: '14px' }}>ROOM CODE: </span>
          <span style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '18px' }} className="mono">{roomCode || 'LOCAL-DEV'}</span>
        </div>
        <div style={{ color: '#8899aa' }}>
          Host: <strong style={{ color: '#ffffff' }}>{hostNickname || 'TerrariaFighter'}</strong>
        </div>
        <button
          onClick={() => setView('LOBBY')}
          style={{
            background: 'transparent',
            border: '1px solid #ff0055',
            color: '#ff0055',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          LEAVE ARENA
        </button>
      </div>

      <StatsHUD wpm={wpm} accuracy={accuracy} combo={combo} hp={hp} />

      <div style={{
        position: 'relative',
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(0, 255, 136, 0.4)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
      }}>
        <canvas
          ref={canvasRef}
          width={1032}
          height={320}
          style={{ width: '100%', height: '320px', display: 'block', background: '#0c0f1d' }}
        />
      </div>

      <TypingArea
        targetText={TARGET_TEXT}
        onStatsUpdate={handleStatsUpdate}
        onAttackTrigger={handleAttackTrigger}
      />
    </div>
  );
};
