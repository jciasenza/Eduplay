import { Scene } from 'phaser';
import { EventBus, GameEvents } from '../EventBus';

export class MainMenu extends Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.text(width / 2, height / 2, 'Menú Principal', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '48px',
      color: '#6C3CE1',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 60, 'Esperando configuración del nivel...', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Escuchar evento desde React para iniciar un nivel
    const handleStartLevel = (levelData: any) => {
      this.scene.start('MemoGame', { levelData });
    };

    EventBus.on(GameEvents.START_LEVEL, handleStartLevel);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off(GameEvents.START_LEVEL, handleStartLevel);
    });

    // Notificar a React que el juego está en el menú y listo
    EventBus.emit(GameEvents.GAME_READY);
  }
}
