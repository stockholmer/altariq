'use client';

interface Props {
  heading: number | null;
  qiblaBearing: number;
}

export default function CompassRing({ heading, qiblaBearing }: Props) {
  const rotation = heading != null ? -heading : 0;
  const qiblaAngle = qiblaBearing;

  return (
    <div className="relative mx-auto h-72 w-72">
      {/* Compass ring - rotates with device */}
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Outer ring */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="var(--text-2)" strokeWidth="1" opacity="0.2" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="var(--text-2)" strokeWidth="0.5" opacity="0.1" />

        {/* Cardinal directions */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="10"
            x2="100"
            y2="20"
            stroke="var(--text-2)"
            strokeWidth="1.5"
            opacity="0.4"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}

        {/* Tick marks every 30 degrees */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="8"
            x2="100"
            y2="15"
            stroke="var(--text-2)"
            strokeWidth="0.5"
            opacity="0.3"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}

        {/* N E S W labels */}
        <text x="100" y="30" textAnchor="middle" fill="var(--accent)" fontSize="12" fontWeight="bold">N</text>
        <text x="175" y="104" textAnchor="middle" fill="var(--text-2)" fontSize="10">E</text>
        <text x="100" y="178" textAnchor="middle" fill="var(--text-2)" fontSize="10">S</text>
        <text x="25" y="104" textAnchor="middle" fill="var(--text-2)" fontSize="10">W</text>

        {/* Qibla arrow */}
        <g transform={`rotate(${qiblaAngle} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="25" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="100,18 95,30 105,30" fill="var(--accent)" />
          {/* Kaaba icon at tip */}
          <rect x="95" y="10" width="10" height="10" rx="1" fill="var(--accent)" opacity="0.8" />
        </g>

        {/* Center dot */}
        <circle cx="100" cy="100" r="4" fill="var(--accent)" />
        <circle cx="100" cy="100" r="2" fill="var(--bg)" />
      </svg>

      {/* "Point top" indicator */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1">
        <div className="h-3 w-3 rotate-45 border-l-2 border-t-2 border-[var(--accent)]" />
      </div>
    </div>
  );
}
