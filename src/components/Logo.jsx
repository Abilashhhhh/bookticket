export default function Logo({ variant = 'dark', showWordmark = true, size = 34 }) {
  const inkColor = variant === 'light' ? '#ffffff' : '#0d1b2e';

  return (
    <span className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* open book strokes */}
        <path d="M20 14 C13 14 10 17 10 17 L10 44 C10 44 13 41 20 41" stroke="#f5821f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M26 18 C21 18 18 20.5 18 20.5 L18 44 C18 44 21 41.5 26 41.5" stroke="#f5821f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* ticket outline with notch teeth on right edge, dashed perforation, letter B */}
        <path
          d="M27 10 H50 C52.2 10 54 11.8 54 14 V17.4 C51.8 17.4 50 19.2 50 21.4 C50 23.6 51.8 25.4 54 25.4 V29.4 C51.8 29.4 50 31.2 50 33.4 C50 35.6 51.8 37.4 54 37.4 V41.6 C51.8 41.6 50 43.4 50 45.6 C50 47.8 51.8 49.6 54 49.6 V50 C54 52.2 52.2 54 50 54 H27 V10 Z"
          stroke={inkColor}
          strokeWidth="3.2"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="27" y1="14" x2="27" y2="50" stroke={inkColor} strokeWidth="2.4" strokeDasharray="3 3.4" />
        <text x="40" y="38" textAnchor="middle" fontFamily="Sora, Arial, sans-serif" fontWeight="800" fontSize="20" fill={inkColor}>B</text>
      </svg>
      {showWordmark && (
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 21, letterSpacing: '-0.01em', lineHeight: 1 }}>
          <span style={{ color: inkColor }}>Book</span>
          <span style={{ color: '#f5821f' }}>Tix</span>
        </span>
      )}
    </span>
  );
}
