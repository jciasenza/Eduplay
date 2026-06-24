import React, { useLayoutEffect } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';
import { learningWorlds } from '../data/worlds';
import { EventBus, GameEvents } from '../game/EventBus';

const GameLoader = React.lazy(() =>
  import('../game/PhaserGame').then((module) => ({ default: module.PhaserGame })),
);

export const GamePlay = () => {
  const navigate = useNavigate();
  const { worldId, gameId, levelId } = useParams<{ worldId?: string; gameId?: string; levelId?: string }>();
  const [, setGame] = React.useState<Phaser.Game | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<number>(0);
  const [moves, setMoves] = React.useState<number>(0);
  const [score, setScore] = React.useState<number>(0);
  const [isPhaserReady, setIsPhaserReady] = React.useState(false);

  const activeWorld = React.useMemo(() => {
    if (worldId) {
      return learningWorlds.find((world) => world.id === worldId);
    }
    return levelId ? learningWorlds.find((world) => world.id === levelId) : undefined;
  }, [worldId, levelId]);

  const activeGame = React.useMemo(() => {
    if (!activeWorld) return null;
    if (!gameId) return activeWorld.games[0] ?? null;
    return activeWorld.games.find((game) => game.id === gameId) ?? activeWorld.games[0] ?? null;
  }, [activeWorld, gameId]);

  const gameData = React.useMemo(() => {
    if (!activeGame) return null;
    if (worldId && gameId && levelId) {
      return activeGame.levels.find((level) => level.id === levelId) ?? activeGame.levels[0] ?? null;
    }
    return activeGame.levels[0] ?? null;
  }, [activeGame, worldId, gameId, levelId]);

  const handleGameReady = React.useCallback((game: Phaser.Game) => {
    setGame(game);
  }, []);

  useLayoutEffect(() => {
    if (!gameData) return;

    const handleGameReadyEvent = () => setIsPhaserReady(true);
    const handleUpdateTime = (time: number) => setTimeRemaining(time);
    const handleUpdateMoves = (movesValue: number) => setMoves(movesValue);
    const handleUpdateScore = (scoreValue: number) => setScore(scoreValue);

    EventBus.on(GameEvents.GAME_READY, handleGameReadyEvent);
    EventBus.on(GameEvents.UPDATE_TIME, handleUpdateTime);
    EventBus.on(GameEvents.UPDATE_MOVES, handleUpdateMoves);
    EventBus.on(GameEvents.UPDATE_SCORE, handleUpdateScore);

    return () => {
      EventBus.off(GameEvents.GAME_READY, handleGameReadyEvent);
      EventBus.off(GameEvents.UPDATE_TIME, handleUpdateTime);
      EventBus.off(GameEvents.UPDATE_MOVES, handleUpdateMoves);
      EventBus.off(GameEvents.UPDATE_SCORE, handleUpdateScore);
    };
  }, [gameData]);

  React.useEffect(() => {
    if (!gameData) return;

    setTimeRemaining(gameData.timeLimit);
    setMoves(0);
    setScore(0);
    setIsPhaserReady(false);
  }, [gameData]);

  React.useEffect(() => {
    if (!isPhaserReady || !gameData) return;

    EventBus.emit(GameEvents.START_LEVEL, gameData);
  }, [isPhaserReady, gameData]);

  if (!activeWorld || !gameData) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-header">
            <div>
              <span className="eyebrow">Nivel no disponible</span>
              <h1>Demo no encontrada</h1>
              <p>Selecciona una experiencia disponible desde la landing o el dashboard.</p>
            </div>
          </div>
          <div className="game-shell game-shell--empty">
            <button className="btn btn-primary" type="button" onClick={() => navigate('/')}>Volver al inicio</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="game-page">
      <div className="container game-page__inner">
        <div className="game-header">
          <div>
            <span className="eyebrow">Mundo {activeWorld.title}</span>
            <h1>{gameData.title}</h1>
          </div>
          <div className="game-stats">
            <span>⭐ {score}</span>
            <span>⏱ {timeRemaining}s</span>
            <span>Movimientos: {moves}</span>
          </div>
        </div>

        <div className="game-shell">
          <React.Suspense fallback={<div className="game-loading">Cargando motor del juego...</div>}>
            <GameLoader onGameReady={handleGameReady} />
          </React.Suspense>
        </div>
      </div>
    </section>
  );
};
