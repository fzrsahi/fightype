import React from 'react';

interface StatsHUDProps {
  wpm: number;
  accuracy: number;
  combo: number;
  hp: number;
}

export const StatsHUD: React.FC<StatsHUDProps> = ({ wpm, accuracy, combo, hp }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '20px'
    }}>
      <div style={{ background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid #00ff88' }}>
        <div style={{ fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }}>WPM</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }} className="mono">{wpm}</div>
      </div>
      <div style={{ background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid #00eafe' }}>
        <div style={{ fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }}>Accuracy</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00eafe' }} className="mono">{accuracy}%</div>
      </div>
      <div style={{ background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: `1px solid ${combo >= 25 ? '#ffb700' : '#4a5568'}` }}>
        <div style={{ fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }}>Combo Streak</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: combo >= 25 ? '#ffb700' : '#f0f4f8' }} className="mono">{combo}x</div>
      </div>
      <div style={{ background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: `1px solid ${hp > 30 ? '#00ff88' : '#ff0055'}` }}>
        <div style={{ fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }}>Health (HP)</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: hp > 30 ? '#00ff88' : '#ff0055' }} className="mono">{hp}</div>
      </div>
    </div>
  );
};
