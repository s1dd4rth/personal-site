import React from 'react';

export default function CaseFileSticky({ experience, onClick }) {
  const { title, company, year, summary, color } = experience;
  return (
    <div
      onClick={onClick}
      style={{
        background: color === 'yellow' ? '#FFE066' : color === 'green' ? '#B6E2A1' : color === 'blue' ? '#A7C7E7' : '#FFD6E0',
        borderRadius: 8,
        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.13), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
        minWidth: 200,
        maxWidth: 320,
        minHeight: 120,
        padding: '1.2rem 1.2rem 1.5rem 1.2rem',
        fontFamily: 'var(--font-marker)',
        fontWeight: 700,
        color: '#222',
        cursor: 'pointer',
        margin: '0.5rem',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: 'rotate(-2deg)',
        zIndex: 10,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 900 }}>{title}</div>
      <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{company}</div>
      <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>{year}</div>
      <div style={{ fontSize: '1.05rem' }}>{summary}</div>
    </div>
  );
} 