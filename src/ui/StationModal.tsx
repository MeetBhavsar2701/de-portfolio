import React, { useState, useEffect } from 'react';
import { useStore, StationName } from '../lib/store';
import { PROFILE } from '../content/profile';
import { sound } from '../audio/SoundController';

export function StationModal() {
  const activeStation = useStore((state) => state.activeStation);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedStation, setDismissedStation] = useState<StationName | null>(null);

  // Auto show on entering a new station
  useEffect(() => {
    if (activeStation) {
      if (dismissedStation !== activeStation) {
        setIsOpen(true);
        sound.playStationEntry();
      }
    } else {
      setIsOpen(false);
      setDismissedStation(null);
    }
  }, [activeStation, dismissedStation]);

  // Keyboard shortcut listener: Esc to close, E to reopen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (activeStation) setDismissedStation(activeStation);
      } else if ((e.key === 'e' || e.key === 'E') && activeStation && !isOpen) {
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeStation]);

  if (!activeStation || !isOpen) {
    if (activeStation && !isOpen) {
      return (
        <div
          style={{
            position: 'fixed',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid #0284c7',
            padding: '6px 16px',
            borderRadius: '999px',
            color: '#38bdf8',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 900,
          }}
          onClick={() => setIsOpen(true)}
        >
          Press <strong style={{ color: '#f8fafc' }}>E</strong> to view station details
        </div>
      );
    }
    return null;
  }

  const renderContent = () => {
    switch (activeStation) {
      case 'Source':
        return (
          <div>
            <h3 style={{ color: '#38bdf8', marginBottom: '8px' }}>About Me & Education</h3>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>{PROFILE.about}</p>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>EDUCATION</div>
              <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '4px' }}>{PROFILE.education}</div>
            </div>
          </div>
        );
      case 'Ingest':
        return (
          <div>
            <h3 style={{ color: '#38bdf8', marginBottom: '8px' }}>Ingestion & Core Skills</h3>
            <p style={{ color: '#cbd5e1', marginBottom: '12px' }}>
              Technologies utilized across distributed streaming and pipeline engineering:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PROFILE.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      case 'Transform':
        return (
          <div>
            <h3 style={{ color: '#38bdf8', marginBottom: '8px' }}>Transformation Projects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PROFILE.projects.map((p) => (
                <div
                  key={p.name}
                  style={{
                    background: '#1e293b',
                    padding: '12px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #0284c7',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f8fafc', fontWeight: 700 }}>{p.name}</span>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#38bdf8', fontSize: '12px', textDecoration: 'none' }}
                    >
                      View Source ↗
                    </a>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px' }}>{p.description}</div>
                  <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '6px' }}>{p.stack}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Warehouse':
        return (
          <div>
            <h3 style={{ color: '#38bdf8', marginBottom: '8px' }}>Experience & Internship</h3>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>
                {PROFILE.experience.role} • {PROFILE.experience.org}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>
                {PROFILE.experience.dates}
              </div>
              <ul style={{ paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.6 }}>
                {PROFILE.experience.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'Dashboard':
        return (
          <div>
            <h3 style={{ color: '#38bdf8', marginBottom: '8px' }}>Certificates & Achievements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PROFILE.achievements.map((ach, i) => (
                <div
                  key={i}
                  style={{
                    background: '#1e293b',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>🏆</span>
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Output':
        return (
          <div>
            <h3 style={{ color: '#38bdf8', marginBottom: '8px' }}>Connect & Resume</h3>
            <p style={{ color: '#cbd5e1', marginBottom: '8px', lineHeight: 1.5 }}>
              Thank you for exploring my interactive data pipeline world! Let's connect and build reliable data platforms together.
            </p>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '14px' }}>
              Email: <span style={{ color: '#f8fafc' }}>{PROFILE.email}</span> • Location: <span style={{ color: '#f8fafc' }}>{PROFILE.cityCountry}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #38bdf8',
                }}
              >
                GitHub Profile ↗
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #38bdf8',
                }}
              >
                LinkedIn ↗
              </a>
              <a
                href={`${import.meta.env.BASE_URL || '/'}resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                Download Resume (PDF) ↓
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      data-testid="station-modal"
      style={{
        position: 'fixed',
        top: '120px',
        left: '24px',
        width: '420px',
        maxWidth: 'calc(100vw - 48px)',
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #0284c7',
        borderRadius: '12px',
        boxShadow: '0 0 25px rgba(56, 189, 248, 0.35)',
        zIndex: 9900,
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          borderBottom: '1px solid #334155',
          paddingBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: '#38bdf8',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Station Node: {activeStation}
        </span>
        <button
          onClick={() => {
            setIsOpen(false);
            if (activeStation) setDismissedStation(activeStation);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✕ (Esc)
        </button>
      </div>
      {renderContent()}
    </div>
  );
}

