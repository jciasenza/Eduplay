import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameConfig } from './config';
import { EventBus, GameEvents } from './EventBus';

interface PhaserGameProps {
  onGameReady?: (game: Phaser.Game) => void;
  onLevelComplete?: (stats: { stars: number; time: number; moves: number }) => void;
  onGameOver?: () => void;
  onUpdateScore?: (score: number) => void;
  onUpdateTime?: (time: number) => void;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({
  onGameReady,
  onLevelComplete,
  onGameOver,
  onUpdateScore,
  onUpdateTime,
}) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // 1. Inicializar el juego si no existe
    if (!gameRef.current && gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        ...GameConfig,
        parent: gameContainerRef.current,
      };
      
      gameRef.current = new Phaser.Game(config);

      // Notificar que el juego está listo
      if (onGameReady) {
        onGameReady(gameRef.current);
      }
    }

    // 2. Suscribirse a eventos del EventBus (Phaser -> React)
    const handleLevelComplete = (stats: any) => onLevelComplete?.(stats);
    const handleGameOver = () => onGameOver?.();
    const handleUpdateScore = (score: number) => onUpdateScore?.(score);
    const handleUpdateTime = (time: number) => onUpdateTime?.(time);
    const handleStartLevel = (levelData: any) => {
      if (!gameRef.current) return;
      const sceneManager = gameRef.current.scene;
      if (sceneManager.isActive('GameOver') || sceneManager.isPaused('GameOver') || sceneManager.isSleeping('GameOver')) {
        sceneManager.stop('GameOver');
      }
      if (sceneManager.isActive('MemoGame')) {
        sceneManager.stop('MemoGame');
      }
      sceneManager.start('MemoGame', { levelData });
    };

    EventBus.on(GameEvents.LEVEL_COMPLETE, handleLevelComplete);
    EventBus.on(GameEvents.GAME_OVER, handleGameOver);
    EventBus.on(GameEvents.UPDATE_SCORE, handleUpdateScore);
    EventBus.on(GameEvents.UPDATE_TIME, handleUpdateTime);
    EventBus.on(GameEvents.START_LEVEL, handleStartLevel);

    // 3. Cleanup al desmontar
    return () => {
      EventBus.off(GameEvents.LEVEL_COMPLETE, handleLevelComplete);
      EventBus.off(GameEvents.GAME_OVER, handleGameOver);
      EventBus.off(GameEvents.UPDATE_SCORE, handleUpdateScore);
      EventBus.off(GameEvents.UPDATE_TIME, handleUpdateTime);
      EventBus.off(GameEvents.START_LEVEL, handleStartLevel);
      
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onGameReady, onLevelComplete, onGameOver, onUpdateScore, onUpdateTime]);

  return (
    <div 
      ref={gameContainerRef} 
      className="phaser-container"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)'
      }}
    />
  );
};
