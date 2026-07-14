import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const StatsHUD = ({ wpm, accuracy, combo, hp }) => {
    return (_jsxs("div", { style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '20px'
        }, children: [_jsxs("div", { style: { background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid #00ff88' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }, children: "WPM" }), _jsx("div", { style: { fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }, className: "mono", children: wpm })] }), _jsxs("div", { style: { background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid #00eafe' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }, children: "Accuracy" }), _jsxs("div", { style: { fontSize: '32px', fontWeight: 'bold', color: '#00eafe' }, className: "mono", children: [accuracy, "%"] })] }), _jsxs("div", { style: { background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: `1px solid ${combo >= 25 ? '#ffb700' : '#4a5568'}` }, children: [_jsx("div", { style: { fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }, children: "Combo Streak" }), _jsxs("div", { style: { fontSize: '32px', fontWeight: 'bold', color: combo >= 25 ? '#ffb700' : '#f0f4f8' }, className: "mono", children: [combo, "x"] })] }), _jsxs("div", { style: { background: 'rgba(26, 32, 53, 0.8)', padding: '16px', borderRadius: '8px', border: `1px solid ${hp > 30 ? '#00ff88' : '#ff0055'}` }, children: [_jsx("div", { style: { fontSize: '12px', color: '#8899aa', textTransform: 'uppercase' }, children: "Health (HP)" }), _jsx("div", { style: { fontSize: '32px', fontWeight: 'bold', color: hp > 30 ? '#00ff88' : '#ff0055' }, className: "mono", children: hp })] })] }));
};
