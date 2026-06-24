import { type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WorldCard } from '../components/ui/WorldCard';
import { learningWorlds } from '../data/worlds';
import { useScrollReveal } from '../hooks/useScrollReveal';

const [featuredWorld, ...extraWorlds] = learningWorlds;


export const Landing = () => {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <section className="landing-page">
    <div className="hero-section">
      <div className="container hero-section__grid">
        <div className="hero-section__content reveal fade-up" data-reveal>
          <span className="eyebrow">Juegos educativos para aprender mejor</span>
          <h1>
            <span className="brand-word" aria-label="EduPlay">
              <span>Edu</span>
              <span>Play</span>
            </span>{' '}
            convierte cada leccion en una aventura.
          </h1>
          <p>
            Practica memoria, matematicas y palabras con mundos coloridos, niveles cortos y
            recompensas pensadas para chicos curiosos.
          </p>
          <div className="hero-section__actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Empezar gratis
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
          <div className="hero-metrics" aria-label="Resumen de la experiencia">
            <span>
              <strong>10</strong>
              niveles gratis
            </span>
            <span>
              <strong>3</strong>
              mundos iniciales
            </span>
            <span>
              <strong>5 min</strong>
              por partida
            </span>
          </div>
        </div>
        <div className="hero-preview reveal fade-left" data-reveal aria-hidden="true">
          <img src="/eduplay.png" alt="" className="hero-preview__logo" />
          <div className="floating-character floating-character--pink">Aa</div>
          <div className="floating-character floating-character--green">Ci</div>
          <div className="floating-character floating-character--orange">Hi</div>
          <div className="hero-preview__panel">
            <div className="hero-preview__hud">
              <span>Nivel 04</span>
              <span>⭐⭐⭐</span>
            </div>
            <div className="memory-grid">
              {['7', '+', '7', '=', '14', '14'].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="challenge-band reveal fade-up" data-reveal>
      <div className="container challenge-band__inner">
        <div className="challenge-item">
          <span>01</span>
          <strong>Colecciona personajes</strong>
          <p>Cada tema tiene un guia visual y recompensas propias.</p>
        </div>
        <div className="challenge-item">
          <span>02</span>
          <strong>Sube de nivel</strong>
          <p>Partidas cortas para practicar sin perder el ritmo.</p>
        </div>
        <div className="challenge-item">
          <span>03</span>
          <strong>Explora mundos</strong>
          <p>Matematicas, palabras, ciencias naturales e historia.</p>
        </div>
      </div>
    </div>

    <div className="worlds-section reveal fade-up" data-reveal>
      <div className="container section-block">
        <div className="section-heading section-heading--center">
          <span className="eyebrow">Elige un mundo</span>
          <h2>Aprendizaje con ritmo de juego</h2>
        </div>
        <div className="world-grid">
          {[featuredWorld, ...extraWorlds].map((world, index) => (
            <div key={world.id} className="reveal fade-up" data-reveal style={{ '--reveal-delay': `${index * 0.08}s` } as CSSProperties}>
              <WorldCard
                {...world}
                actionLabel={world.actionLabel}
                onAction={() => navigate(`/world/${world.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="modes-section reveal fade-up" data-reveal>
      <div className="container modes-section__grid">
        <div>
          <span className="eyebrow">Mas formas de jugar</span>
          <h2>Desafios para cada momento</h2>
        </div>
        <div className="mode-card">
          <strong>Modo memoria</strong>
          <span>Encuentra pares y gana estrellas.</span>
        </div>
        <div className="mode-card">
          <strong>Desafio diario</strong>
          <span>Una partida nueva para practicar.</span>
        </div>
        <div className="mode-card">
          <strong>Ruta por temas</strong>
          <span>Avanza por mundos y desbloquea guias.</span>
        </div>
      </div>
    </div>
  </section>
  );
};
