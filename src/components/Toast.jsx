import { useState, useEffect, useCallback } from 'react';

export default function Toast({ message, subMessage, visible, id, onClose }) {
  const [phase, setPhase] = useState('hidden'); // hidden | entering | holding | leaving

  useEffect(() => {
    if (visible) {
      setPhase('entering');

      // After entrance animation (0.3s), start hold timer
      const holdTimer = setTimeout(() => {
        setPhase('holding');

        // After 2s hold, start fade-out
        const leaveTimer = setTimeout(() => {
          setPhase('leaving');

          // After fade-out (0.2s), call onClose
          const closeTimer = setTimeout(() => {
            setPhase('hidden');
            onClose?.();
          }, 200);

          return () => clearTimeout(closeTimer);
        }, 2000);

        return () => clearTimeout(leaveTimer);
      }, 300);

      return () => clearTimeout(holdTimer);
    } else {
      setPhase('hidden');
    }
  }, [visible, id, onClose]);

  if (phase === 'hidden') return null;

  const animationClass = phase === 'entering' ? 'toast-enter' : phase === 'leaving' ? 'toast-leave' : '';

  return (
    <div
      className={animationClass}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
        maxWidth: 320,
        width: 'auto',
      }}
    >
      <span style={{
        fontSize: 20,
        lineHeight: 1,
        color: '#28a745',
        flexShrink: 0,
        marginTop: 2,
        fontWeight: 700,
      }}>
        ✓
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#333',
          lineHeight: 1.3,
        }}>
          {message}
        </span>
        {subMessage && (
          <span style={{
            fontSize: 12,
            color: '#666',
            lineHeight: 1.3,
          }}>
            {subMessage}
          </span>
        )}
      </div>
    </div>
  );
}
