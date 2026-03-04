/**
 * HeraldryDivider — decorative SVG ornament used between sections.
 * Uses classic English heraldic motifs: fleur-de-lis, Tudor rose, and pointed arches.
 */
export default function HeraldryDivider({ className = '', gold = '#c9a84c' }) {
  return (
    <div className={`flex items-center justify-center py-2 ${className}`} aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 24"
        width="320"
        height="24"
        fill="none"
      >
        {/* Left rule */}
        <line x1="0" y1="12" x2="108" y2="12" stroke={gold} strokeWidth="0.75" strokeOpacity="0.5" />

        {/* Left small diamond */}
        <polygon points="112,12 116,8 120,12 116,16" fill={gold} fillOpacity="0.6" />

        {/* Central fleur-de-lis */}
        <g transform="translate(160,12)">
          {/* stem */}
          <rect x="-1" y="0" width="2" height="6" fill={gold} />
          {/* centre bloom */}
          <ellipse cx="0" cy="-3" rx="3" ry="5" fill={gold} />
          {/* left petal */}
          <ellipse cx="-5" cy="-1" rx="3" ry="4.5" transform="rotate(-20,-5,-1)" fill={gold} fillOpacity="0.85" />
          {/* right petal */}
          <ellipse cx="5" cy="-1" rx="3" ry="4.5" transform="rotate(20,5,-1)" fill={gold} fillOpacity="0.85" />
          {/* crossbar */}
          <rect x="-6" y="1" width="12" height="1.5" rx="0.75" fill={gold} />
        </g>

        {/* Right small diamond */}
        <polygon points="200,12 204,8 208,12 204,16" fill={gold} fillOpacity="0.6" />

        {/* Right rule */}
        <line x1="212" y1="12" x2="320" y2="12" stroke={gold} strokeWidth="0.75" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}
