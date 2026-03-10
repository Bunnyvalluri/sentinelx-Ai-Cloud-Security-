import { Link } from 'react-router-dom';

/**
 * Premium Logo component for SentinelX
 * @param {Object} props
 * @param {'horizontal' | 'vertical' | 'icon-only'} props.layout - Layout of the logo
 * @param {number} props.size - Size of the icon
 * @param {boolean} props.glow - Whether to show a glow effect
 * @param {string} props.className - Additional class names
 */
export const Logo = ({ layout = 'horizontal', size = 32, glow = true, className = '' }) => {
  const isVertical = layout === 'vertical';
  const isIconOnly = layout === 'icon-only';

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: isVertical ? 'column' : 'row',
      alignItems: 'center',
      gap: isVertical ? 14 : 10,
      textDecoration: 'none',
      cursor: 'pointer'
    }} className={className}>
      {/* Logo Icon */}
      <div style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: glow ? `0 0 ${size * 0.6}px rgba(139,92,246,0.45)` : 'none',
        flexShrink: 0,
        transition: 'all 0.3s ease'
      }}>
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 10l6 4" />
          <path d="M15 10l-6 4" />
        </svg>
      </div>

      {/* Text Logo */}
      {!isIconOnly && (
        <span style={{
          background: 'linear-gradient(90deg, #a78bfa, #818cf8, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 900,
          fontSize: isVertical ? size * 0.75 : size * 0.6,
          letterSpacing: isVertical ? '-1px' : '-0.3px',
          transition: 'all 0.3s ease'
        }}>
          SentinelX
        </span>
      )}
    </div>
  );
};

export default Logo;
