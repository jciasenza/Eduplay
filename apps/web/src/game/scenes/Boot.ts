import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Cargar assets mínimos para la pantalla de carga (logo, barra)
    // this.load.image('logo', 'assets/logo.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
