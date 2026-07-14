import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { TypingEngine, WpmCalculator } from '@fightype/game-engine';
export const TypingArea = ({ targetText, onStatsUpdate, onAttackTrigger }) => {
    const [typedIndex, setTypedIndex] = useState(0);
    const [errorsCount, setErrorsCount] = useState(0);
    const [combo, setCombo] = useState(0);
    const [startTime, setStartTime] = useState(null);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey)
                return;
            e.preventDefault();
            if (startTime === null) {
                setStartTime(Date.now());
            }
            const result = TypingEngine.evaluateChar(targetText, typedIndex, e.key, combo);
            if (result.isOk()) {
                const evalData = result.value;
                if (evalData.isCorrect) {
                    setTypedIndex(evalData.charIndex);
                    setCombo(evalData.newCombo);
                    if (evalData.newCombo > 0 && evalData.newCombo % 25 === 0) {
                        onAttackTrigger(15);
                    }
                }
                else {
                    setErrorsCount((prev) => prev + 1);
                    setCombo(0);
                }
                const elapsedSec = Math.max(1, (Date.now() - (startTime || Date.now())) / 1000);
                const statsRes = WpmCalculator.calculate(typedIndex + 1, typedIndex + (evalData.isCorrect ? 1 : 0), elapsedSec);
                if (statsRes.isOk()) {
                    const stats = statsRes.value;
                    onStatsUpdate(stats.netWpm, stats.accuracy, evalData.newCombo, evalData.progressPercent);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [targetText, typedIndex, combo, startTime, errorsCount, onStatsUpdate, onAttackTrigger]);
    const renderedChars = targetText.split('').map((char, index) => {
        let color = '#8899aa'; // unread
        if (index < typedIndex) {
            color = '#00ff88'; // typed correct
        }
        else if (index === typedIndex) {
            color = '#ffffff'; // current cursor
        }
        return (_jsx("span", { style: { color, textDecoration: index === typedIndex ? 'underline' : 'none', fontWeight: index === typedIndex ? 'bold' : 'normal' }, children: char }, index));
    });
    return (_jsx("div", { style: {
            background: 'rgba(26, 32, 53, 0.85)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            lineHeight: '1.6',
            letterSpacing: '2px',
            textAlign: 'left'
        }, children: renderedChars }));
};
