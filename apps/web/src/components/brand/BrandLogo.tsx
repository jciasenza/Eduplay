import { Link } from 'react-router-dom';

interface BrandLogoProps {
  compact?: boolean;
}

export const BrandLogo = ({ compact = false }: BrandLogoProps) => (
  <Link className="brand-logo" to="/" aria-label="EduPlay inicio">
    <img src="/eduplay.png" alt="" className="brand-logo__mark" />
    {!compact && (
      <span className="brand-logo__text">
        <span>Edu</span>
        <span>Play</span>
      </span>
    )}
  </Link>
);
