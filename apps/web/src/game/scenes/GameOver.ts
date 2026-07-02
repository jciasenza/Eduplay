import { Scene } from 'phaser';
import { EventBus, GameEvents } from '../EventBus';

export class GameOver extends Scene {
  private audioContext: AudioContext | null = null;

  constructor() {
    super('GameOver');
  }

  init() {
    // Inicializar data
  }

  create(data: { win: boolean, stars: number, hasNextLevel?: boolean }) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.cameras.main.setBackgroundColor('#0f0b1a');

    if (data.win) {
      this.createConfetti();
      void this.playSound('win');
    } else {
      void this.playSound('lose');
    }

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

    EventBus.emit(GameEvents.GAME_OVER);
  }

  private ensureAudioContext() {
    if (this.audioContext) {
      return this.audioContext;
    }

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    this.audioContext = new AudioContextCtor();
    return this.audioContext;
  }

  private async playSound(kind: 'win' | 'lose') {
    const context = this.ensureAudioContext();
    if (!context) return;

    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch {
        return;
      }
    }

    const patterns: Record<'win' | 'lose', Array<{ frequency: number; duration: number; type?: OscillatorType }>> = {
      win: [
        { frequency: 523.25, duration: 0.08, type: 'sine' },
        { frequency: 659.25, duration: 0.08, type: 'sine' },
        { frequency: 783.99, duration: 0.08, type: 'sine' },
        { frequency: 1046.5, duration: 0.18, type: 'sine' },
      ],
      lose: [
        { frequency: 220, duration: 0.1, type: 'triangle' },
        { frequency: 196, duration: 0.12, type: 'triangle' },
        { frequency: 174.61, duration: 0.16, type: 'triangle' },
      ],
    };

    const sequence = patterns[kind];
    let startAt = context.currentTime;

    for (const step of sequence) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = step.type ?? 'sine';
      oscillator.frequency.value = step.frequency;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + step.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + step.duration + 0.02);

      startAt += step.duration + 0.04;
    }
  }

  private createConfetti() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const palette = [0xff4d6d, 0xffc857, 0x4dd4ac, 0x4dabf7, 0xb197fc];

    const pieces = 42;
    for (let i = 0; i < pieces; i++) {
      const size = Phaser.Math.Between(8, 16);
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(-120, -20),
        size,
        Phaser.Math.Between(size, size + 8),
        Phaser.Utils.Array.GetRandom(palette)
      );

      confetti.setAlpha(0.95);
      confetti.setRotation(Phaser.Math.FloatBetween(0, Math.PI));

      this.tweens.add({
        targets: confetti,
        y: height + 140,
        x: confetti.x + Phaser.Math.Between(-120, 120),
        rotation: confetti.rotation + Phaser.Math.FloatBetween(2, 7),
        duration: Phaser.Math.Between(2200, 3600),
        ease: 'Cubic.easeIn',
        delay: Phaser.Math.Between(0, 700),
        onComplete: () => confetti.destroy(),
      });
    }
  }
}
