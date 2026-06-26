import { Events } from 'phaser';

export const EventBus = new Events.EventEmitter();

// Definimos los nombres de los eventos para evitar typos
export const GameEvents = {
  // Emitidos por Phaser hacia React
  GAME_READY: 'game-ready',
  LEVEL_COMPLETE: 'level-complete',
  GAME_OVER: 'game-over',
  NEXT_LEVEL: 'next-level',
  EXIT_GAME: 'exit-game',
  UPDATE_SCORE: 'update-score',
  UPDATE_MOVES: 'update-moves',
  UPDATE_TIME: 'update-time',

  // Emitidos por React hacia Phaser
  START_LEVEL: 'start-level',
  PAUSE_GAME: 'pause-game',
  RESUME_GAME: 'resume-game',
  RESTART_LEVEL: 'restart-level',
} as const;
