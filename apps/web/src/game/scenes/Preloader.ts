import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    // Aquí cargaremos todos los assets del juego (imágenes, sonidos)
    // Por ahora pondremos un texto de carga
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Cargando...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // TODO: Load real assets here
    // this.load.image('card-back', 'assets/card-back.png');
  }

  create() {
    this.scene.start('MainMenu');
  }
}
