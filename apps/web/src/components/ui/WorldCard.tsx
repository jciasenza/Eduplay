import { CharacterAvatar } from './CharacterAvatar';
import type { WorldAccent } from '../../data/worlds';

interface WorldCardProps {
  title: string;
  description: string;
  icon: string;
  accent: WorldAccent;
  badge: string;
  actionLabel: string;
  progress?: number;
  characterName: string;
  characterRole: string;
  characterImage?: string;
  locked?: boolean;
  onAction?: () => void;
}

export const WorldCard = ({
  title,
  description,
  icon,
  accent,
  badge,
  actionLabel,
  progress = 0,
  characterName,
  characterRole,
  characterImage,
  locked = false,
  onAction,
}: WorldCardProps) => (
  <article className={`world-card world-card--${accent}${locked ? ' world-card--locked' : ''}`}>
    <div className="world-card__top">
      <CharacterAvatar accent={accent} label={icon} image={characterImage} name={characterName} />
      <span className="badge">{badge}</span>
    </div>
    <div className="world-card__character">
      <strong>{characterName}</strong>
      <span>{characterRole}</span>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="progress-track" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
    </div>
    <button className={locked ? 'btn btn-outline' : 'btn btn-primary'} onClick={onAction}>
      {actionLabel}
    </button>
  </article>
);
