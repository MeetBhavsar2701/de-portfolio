import React, { useState, useEffect } from 'react';
import { executeSQL } from '../lib/sql';

interface SQLConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SQLConsole({ isOpen, onClose }: SQLConsoleProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Array<{ query: string; output: string }>>([
    {
      query: 'SHOW TABLES',
      output: executeSQL('SHOW TABLES'),
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Backquote' || e.key === '`' || e.key === '~') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const out = executeSQL(inputVal);
    setHistory((prev) => [...prev, { query: inputVal, output: out }]);
    setInputVal('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '800px',
          maxWidth: '100%',
          height: '520px',
          backgroundColor: '#090d16',
          border: '1px solid #0284c7',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
          fontFamily: 'monospace',
          overflow: 'hidden',
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#0f172a',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#38bdf8',
            fontSize: '13px',
          }}
        >
          <span>SQL Query Console (Press ` or Esc to close)</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        {/* Console History Output */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            color: '#e2e8f0',
            fontSize: '12px',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
          }}
        >
          <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
            Data Pipeline SQL Engine v1.0. Type <span style={{ color: '#38bdf8' }}>HELP</span> for sample queries.
          </div>
          {history.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div style={{ color: '#38bdf8', fontWeight: 600 }}>&gt; {item.query}</div>
              <div style={{ color: '#cbd5e1', marginTop: '4px' }}>{item.output}</div>
            </div>
          ))}
        </div>

        {/* Input prompt */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            borderTop: '1px solid #1e293b',
            padding: '8px 12px',
            backgroundColor: '#0f172a',
          }}
        >
          <span style={{ color: '#38bdf8', marginRight: '8px', lineHeight: '28px' }}>&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. SELECT * FROM skills"
            autoFocus
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '13px',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}

