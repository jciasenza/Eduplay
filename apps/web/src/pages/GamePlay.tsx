import React, { useLayoutEffect } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';
import { EventBus, GameEvents } from '../game/EventBus';
import { useLearningWorlds } from '../hooks/useLearningWorlds';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../hooks/useAuth';

const GameLoader = React.lazy(() =>
  import('../game/PhaserGame').then((module) => ({ default: module.PhaserGame })),
);

const LEVEL_STARS_STORAGE_KEY = 'eduplay-level-stars';

export const GamePlay = () => {
  const navigate = useNavigate();
  const { worldId, gameId, levelId } = useParams<{ worldId?: string; gameId?: string; levelId?: string }>();
  const [, setGame] = React.useState<Phaser.Game | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<number>(0);
  const [moves, setMoves] = React.useState<number>(0);
  const [score, setScore] = React.useState<number>(0);
  const [gameReadySignal, setGameReadySignal] = React.useState(0);
  const [levelResult, setLevelResult] = React.useState<{
    stars: number;
    time: number;
    moves: number;
  } | null>(null);
  const [levelStars, setLevelStars] = React.useState<Record<string, number>>(() => {
    try {
      const savedStars = window.localStorage.getItem(LEVEL_STARS_STORAGE_KEY);
      return savedStars ? JSON.parse(savedStars) as Record<string, number> : {};
    } catch {
      return {};
    }
  });
  const { worlds, isLoading } = useLearningWorlds();
  const { session } = useAuth();
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';
  const accessToken = session?.access_token;

  const activeWorld = React.useMemo(() => {
    if (worldId) {
      return worlds.find((world) => world.id === worldId);
    }
    return levelId ? worlds.find((world) => world.id === levelId) : undefined;
  }, [worlds, worldId, levelId]);

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

  const activeLevelIndex = React.useMemo(() => {
    if (!activeGame || !gameData) return -1;
    return activeGame.levels.findIndex((level) => level.id === gameData.id);
  }, [activeGame, gameData]);

  const nextLevel = React.useMemo(() => {
    if (!activeGame || activeLevelIndex < 0) return null;
    return activeGame.levels[activeLevelIndex + 1] ?? null;
  }, [activeGame, activeLevelIndex]);

  const levelLabel = activeLevelIndex >= 0 ? `Nivel ${activeLevelIndex + 1}` : 'Nivel';
  const totalStars = React.useMemo(
    () => Object.values(levelStars).reduce((total, stars) => total + stars, 0),
    [levelStars],
  );

  useScrollReveal([activeWorld?.id, activeGame?.id, gameData?.id]);

  const handleGameReady = React.useCallback((game: Phaser.Game) => {
    setGame(game);
  }, []);

  const goToNextLevel = React.useCallback(() => {
    setLevelResult(null);
    if (activeWorld && activeGame && nextLevel) {
      navigate(`/world/${activeWorld.id}/game/${activeGame.id}/level/${nextLevel.id}`);
      return;
    }

    if (activeWorld) {
      navigate(`/world/${activeWorld.id}`);
    }
  }, [activeGame, activeWorld, navigate, nextLevel]);

  const retryLevel = React.useCallback(() => {
    if (!gameData) return;
    setLevelResult(null);
    setTimeRemaining(gameData.timeLimit);
    setMoves(0);
    setScore(0);
    EventBus.emit(GameEvents.START_LEVEL, {
      ...gameData,
      hasNextLevel: Boolean(nextLevel),
    });
  }, [gameData, nextLevel]);

  const exitGame = React.useCallback(() => {
    navigate(activeWorld ? `/world/${activeWorld.id}` : '/dashboard');
  }, [activeWorld, navigate]);

  const getOrCreateActiveChildId = React.useCallback(async () => {
    if (!accessToken) return null;

    const savedChildId = window.localStorage.getItem('eduplay-active-child-id');
    const headers = { Authorization: `Bearer ${accessToken}` };

    await fetch(`${apiBaseUrl}/api/users/me`, { headers });
    const response = await fetch(`${apiBaseUrl}/api/users/me/children`, { headers });

    if (!response.ok) return null;

    const children = (await response.json()) as Array<{ id: string }>;
    const savedChild = children.find((child) => child.id === savedChildId);
    if (savedChild) return savedChild.id;
    if (children[0]) {
      window.localStorage.setItem('eduplay-active-child-id', children[0].id);
      return children[0].id;
    }

    const createResponse = await fetch(`${apiBaseUrl}/api/users/me/children`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Primer jugador',
        age: 7,
        avatarId: 'numi',
      }),
    });

    if (!createResponse.ok) return null;

    const child = (await createResponse.json()) as { id: string };
    window.localStorage.setItem('eduplay-active-child-id', child.id);
    return child.id;
  }, [accessToken, apiBaseUrl]);

  const saveProgress = React.useCallback(
    async (stats: { stars: number; time: number; moves: number }) => {
      if (!gameData?.sourceId) return;

      const childId = await getOrCreateActiveChildId();
      if (!childId) return;

      await fetch(`${apiBaseUrl}/api/games/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId,
          levelId: gameData.sourceId,
          stars: stats.stars,
          time: stats.time,
          moves: stats.moves,
          completed: stats.stars > 0,
        }),
      });
    },
    [apiBaseUrl, gameData, getOrCreateActiveChildId],
  );

  const rememberLevelStars = React.useCallback((stats: { stars: number }) => {
    if (!gameData || stats.stars <= 0) return;

    const levelKey = gameData.sourceId ?? gameData.id;
    setLevelStars((currentStars) => {
      const bestStars = Math.max(currentStars[levelKey] ?? 0, stats.stars);
      if (bestStars === currentStars[levelKey]) return currentStars;

      const nextStars = {
        ...currentStars,
        [levelKey]: bestStars,
      };

      window.localStorage.setItem(LEVEL_STARS_STORAGE_KEY, JSON.stringify(nextStars));
      return nextStars;
    });
  }, [gameData]);

  useLayoutEffect(() => {
    if (!gameData) return;

    const handleGameReadyEvent = () => setGameReadySignal((signal) => signal + 1);
    const handleUpdateTime = (time: number) => setTimeRemaining(time);
    const handleUpdateMoves = (movesValue: number) => setMoves(movesValue);
    const handleUpdateScore = (scoreValue: number) => setScore(scoreValue);
    const handleLevelComplete = (stats: { stars: number; time: number; moves: number }) => {
      setLevelResult(stats);
      rememberLevelStars(stats);
      void saveProgress(stats);
    };

    EventBus.on(GameEvents.GAME_READY, handleGameReadyEvent);
    EventBus.on(GameEvents.UPDATE_TIME, handleUpdateTime);
    EventBus.on(GameEvents.UPDATE_MOVES, handleUpdateMoves);
    EventBus.on(GameEvents.UPDATE_SCORE, handleUpdateScore);
    EventBus.on(GameEvents.LEVEL_COMPLETE, handleLevelComplete);

    return () => {
      EventBus.off(GameEvents.GAME_READY, handleGameReadyEvent);
      EventBus.off(GameEvents.UPDATE_TIME, handleUpdateTime);
      EventBus.off(GameEvents.UPDATE_MOVES, handleUpdateMoves);
      EventBus.off(GameEvents.UPDATE_SCORE, handleUpdateScore);
      EventBus.off(GameEvents.LEVEL_COMPLETE, handleLevelComplete);
    };
  }, [gameData, rememberLevelStars, saveProgress]);

  React.useEffect(() => {
    if (!gameData) return;

    setTimeRemaining(gameData.timeLimit);
    setMoves(0);
    setScore(0);
    setLevelResult(null);
  }, [gameData]);

  React.useEffect(() => {
    if (!gameReadySignal || !gameData) return;

    EventBus.emit(GameEvents.START_LEVEL, {
      ...gameData,
      hasNextLevel: Boolean(nextLevel),
    });
  }, [gameReadySignal, gameData, nextLevel]);

  if (isLoading) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-loading">Cargando nivel...</div>
        </div>
      </section>
    );
  }

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
            <p className="game-header__subtitle">{levelLabel}</p>
          </div>
          <div className="game-stats">
            <span>⭐ {totalStars}</span>
            <span>Puntos: {score}</span>
            <span>⏱ {timeRemaining}s</span>
            <span>Movimientos: {moves}</span>
          </div>
        </div>

        <div className="game-shell">
          <React.Suspense fallback={<div className="game-loading">Cargando motor del juego...</div>}>
            <GameLoader onGameReady={handleGameReady} />
          </React.Suspense>
          {levelResult && (
            <div className="game-result">
              <div className="game-result__panel">
                <h2>{levelResult.stars > 0 ? 'Nivel completado' : 'Tiempo agotado'}</h2>
                {levelResult.stars > 0 ? (
                  <p>{'⭐'.repeat(levelResult.stars)} · {levelResult.moves} movimientos</p>
                ) : (
                  <p>Probalo otra vez para completar el nivel.</p>
                )}
                <div className="game-result__actions">
                  {levelResult.stars > 0 ? (
                    <button className="btn btn-primary" onClick={goToNextLevel}>
                      {nextLevel ? 'Siguiente nivel' : 'Finalizar mundo'}
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={retryLevel}>
                      Volver a intentar
                    </button>
                  )}
                  <button className="btn btn-outline" onClick={exitGame}>
                    Salir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
