import React from 'react';

interface Props {
  label: string;
  value: number;
  max: number;
  color?: string;
}

const ProgressTracker: React.FC<Props> = ({ label, value, max, color = '#3f51b5' }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: '140px', textAlign: 'center', margin: '10px' }}>
      <svg width="120" height="120">
        <circle cx="60" cy="60" r="54" stroke="#eee" strokeWidth="12" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${pct * 339 / 100} 339`}
          strokeDashoffset="85"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>{label}</div>
      <div>{value} / {max}</div>
    </div>
  );
};

export default ProgressTracker;
