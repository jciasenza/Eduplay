import { Scene } from 'phaser';
import { EventBus, GameEvents } from '../EventBus';

export class GameOver extends Scene {
  constructor() {
    super('GameOver');
  }

  init() {
    // Inicializar data
  }

  create(data: { win: boolean, stars: number }) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.cameras.main.setBackgroundColor('rgba(15, 11, 26, 0.9)');

    this.add.text(width / 2, height / 2 - 50, data.win ? '¡Nivel Completado!' : '¡Tiempo Agotado!', {
      fontFamily: 'Nunito',
      fontSize: '48px',
      color: data.win ? '#10B981' : '#EF4444',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    if (data.win) {
      this.add.text(width / 2, height / 2 + 20, `Estrellas: ${'⭐'.repeat(data.stars)}`, {
        fontFamily: 'Outfit',
        fontSize: '32px'
      }).setOrigin(0.5);
    }

    const btn = this.add.rectangle(width / 2, height / 2 + 100, 200, 50, 0x6C3CE1).setInteractive();
    this.add.text(width / 2, height / 2 + 100, 'Volver al Menú', { fontFamily: 'Outfit', fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    btn.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });

    EventBus.emit(GameEvents.GAME_OVER);
  }
}
