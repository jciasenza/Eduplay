import type { WorldAccent } from '../../data/worlds';

interface CharacterAvatarProps {
  accent: WorldAccent;
  label: string;
  image?: string;
  name?: string;
}

export const CharacterAvatar = ({ accent, label, image, name }: CharacterAvatarProps) => {
  if (image) {
    return (
      <div className={`character character--image character--${accent}`}>
        <img src={image} alt={name ? `Personaje ${name}` : ''} />
      </div>
    );
  }

  return (
    <div className={`character character--${accent}`} aria-hidden="true">
      <span className="character__spark character__spark--left" />
      <span className="character__spark character__spark--right" />
      <span className="character__face">
        <span className="character__eye character__eye--left" />
        <span className="character__eye character__eye--right" />
        <span className="character__smile" />
      </span>
      <span className="character__label">{label.slice(0, 2)}</span>
    </div>
  );
};
