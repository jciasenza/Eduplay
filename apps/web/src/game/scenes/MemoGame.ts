import { Scene } from 'phaser';
import { EventBus, GameEvents } from '../EventBus';

export class MemoGame extends Scene {
  private levelData: any;
  private cards: Phaser.GameObjects.Container[] = [];
  private selectedCards: Phaser.GameObjects.Container[] = [];
  private score: number = 0;
  private matches: number = 0;
  private moves: number = 0;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private timeRemaining: number = 0;
  private canSelect: boolean = true;
  private isLevelComplete: boolean = false;

  constructor() {
    super('MemoGame');
  }

  init(data: { levelData: any }) {
    this.levelData = data.levelData;
    this.cards = [];
    this.matches = 0;
    this.moves = 0;
    this.score = 0;
    this.timeRemaining = this.levelData.timeLimit || 60;
    this.selectedCards = [];
    this.canSelect = true;
    this.isLevelComplete = false;
    this.input.enabled = true;
  }

  create() {
    // 1. Setup UI (Background, etc)
    this.cameras.main.setBackgroundColor('#241D36');
    
    const width = this.cameras.main.width;
    
    this.add.text(width / 2, 40, this.levelData.title || 'Nivel', {
      fontFamily: 'Nunito',
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.score = 0;
    EventBus.emit(GameEvents.UPDATE_SCORE, this.score);
    EventBus.emit(GameEvents.UPDATE_MOVES, this.moves);
    EventBus.emit(GameEvents.UPDATE_TIME, this.timeRemaining);

    // 2. Start Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining--;
        EventBus.emit(GameEvents.UPDATE_TIME, this.timeRemaining);
        if (this.timeRemaining <= 0) {
          this.gameOver(false);
        }
      },
      loop: true
    });

    // 3. Generate Grid
    this.createGrid();
  }

  createGrid() {
    // Grid based on level configuration with real pairing and shuffling
    const cols = this.levelData.gridSize?.cols || 3;
    const rows = this.levelData.gridSize?.rows || 2;

    const total = cols * rows;
    const totalPairs = Math.floor(total / 2);

    // Build pair values and shuffle
    const values: number[] = [];
    for (let i = 0; i < totalPairs; i++) {
      values.push(i, i);
    }
    // If odd, add one more dummy pair value
    if (values.length < total) values.push(totalPairs);

    // Fisher-Yates shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    // Layout calculations responsive to camera
    const camW = this.cameras.main.width;
    const camH = this.cameras.main.height;
    const padding = Math.min(48, camW * 0.06);
    const gap = Math.min(24, camW * 0.02);

    // compute available area for grid
    const availableW = camW - padding * 2;
    const availableH = camH - 160; // leave space for header/timer

    // approximate card size
    const cardW = Math.min(120, Math.floor((availableW - gap * (cols - 1)) / cols));
    const cardH = Math.min(160, Math.floor((availableH - gap * (rows - 1)) / rows));

    const gridW = cols * cardW + (cols - 1) * gap;
    const gridH = rows * cardH + (rows - 1) * gap;

    const startX = camW / 2 - gridW / 2 + cardW / 2;
    const startY = camH / 2 - gridH / 2 + cardH / 2 + 20;

    // color palette for faces
    const palette = [0xFF8C42, 0x6C3CE1, 0x10B981, 0xF59E0B, 0xEF4444, 0x3B82F6, 0xA78BFA];

    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cardW + gap);
        const y = startY + r * (cardH + gap);

        const value = values[index] ?? index;
        const sourceCards = this.levelData.data?.cards ?? this.levelData.cards ?? [];
        const cardDefinition = sourceCards[value] ?? null;
        const cardLabel = cardDefinition?.label ?? String(value + 1);
        const faceColor = palette[value % palette.length];

        const rect = this.add.rectangle(0, 0, cardW, cardH, 0x6C3CE1).setStrokeStyle(4, 0xffffff);
        const label = this.add.text(0, 0, cardLabel, {
          fontFamily: 'Nunito',
          fontSize: `${Math.max(18, Math.floor(cardH * 0.2))}px`,
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: cardW - 14 },
        }).setOrigin(0.5).setVisible(false);

        const card = this.add.container(x, y, [rect, label]);
        card.setSize(cardW, cardH);
        rect.setInteractive({ useHandCursor: true });
        card.setData('value', value);
        card.setData('faceColor', faceColor);
        card.setData('matched', false);
        card.setData('rect', rect);
        card.setData('label', label);

        rect.on('pointerdown', () => this.handleCardClick(card));

        this.cards.push(card);
        index++;
      }
    }
  }

  handleCardClick(card: Phaser.GameObjects.Container) {
    if (this.isLevelComplete || !this.canSelect || this.selectedCards.includes(card) || card.getData('matched')) return;

    this.canSelect = false;
    const rect = card.getData('rect') as Phaser.GameObjects.Rectangle;
    rect.disableInteractive();

    const label = card.getData('label') as Phaser.GameObjects.Text;
    const face = card.getData('faceColor') ?? 0xFF8C42;

    // Reveal card (scaleX flip)
    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 140,
      onComplete: () => {
        rect.setFillStyle(face);
        label.setVisible(true);
        this.tweens.add({
          targets: card,
          scaleX: 1,
          duration: 140,
          onComplete: () => {
            this.selectedCards.push(card);
            if (this.selectedCards.length === 2) {
              this.moves++;
              EventBus.emit(GameEvents.UPDATE_MOVES, this.moves);
              this.checkMatch();
            } else {
              this.canSelect = true;
            }
          }
        });
      }
    });
  }

  checkMatch() {
    this.canSelect = false;
    const [card1, card2] = this.selectedCards;

    const val1 = card1.getData('value');
    const val2 = card2.getData('value');
    const isMatch = val1 === val2;

    if (isMatch) {
      card1.setData('matched', true);
      card2.setData('matched', true);
      this.matches++;
      this.score += 20;
      EventBus.emit(GameEvents.UPDATE_SCORE, this.score);

      // small highlight then disappear
      this.tweens.add({
        targets: [card1, card2],
        scale: 1.05,
        yoyo: true,
        duration: 120,
        onComplete: () => {
          this.tweens.add({
            targets: [card1, card2],
            alpha: 0,
            duration: 300,
            onComplete: () => {
              const rect1 = card1.getData('rect') as Phaser.GameObjects.Rectangle;
              const rect2 = card2.getData('rect') as Phaser.GameObjects.Rectangle;
              rect1.disableInteractive();
              rect2.disableInteractive();
            }
          });
        }
      });

      this.selectedCards = [];
      this.canSelect = true;

      const totalPairsCfg = Math.floor((this.levelData.gridSize.cols * this.levelData.gridSize.rows) / 2);
      if (this.matches === totalPairsCfg) {
        this.time.delayedCall(500, () => this.gameOver(true));
      }
    } else {
      // Not a match, flip back after a short delay
      this.score = Math.max(0, this.score - 4);
      EventBus.emit(GameEvents.UPDATE_SCORE, this.score);

      this.time.delayedCall(700, () => {
        this.tweens.add({
          targets: [card1, card2],
          scaleX: 0,
          duration: 140,
          onComplete: () => {
            const rect1 = card1.getData('rect') as Phaser.GameObjects.Rectangle;
            const rect2 = card2.getData('rect') as Phaser.GameObjects.Rectangle;
            const label1 = card1.getData('label') as Phaser.GameObjects.Text;
            const label2 = card2.getData('label') as Phaser.GameObjects.Text;

            rect1.setFillStyle(0x6C3CE1);
            rect2.setFillStyle(0x6C3CE1);
            label1.setVisible(false);
            label2.setVisible(false);

            rect1.setInteractive({ useHandCursor: true });
            rect2.setInteractive({ useHandCursor: true });

            this.tweens.add({ targets: [card1, card2], scaleX: 1, duration: 140, onComplete: () => {
              this.selectedCards = [];
              this.canSelect = true;
            }});
          }
        });
      });
    }
  }

  gameOver(win: boolean) {
    if (this.isLevelComplete) return;
    this.isLevelComplete = true;

    if (this.timerEvent) {
      this.timerEvent.remove();
      this.timerEvent = null;
    }

    this.time.removeAllEvents();
    this.tweens.killAll();
    this.canSelect = false;
    this.selectedCards = [];
    this.input.enabled = false;

    // Calculate stars
    let stars = 0;
    if (win) {
      stars = 3; // Lógica real dependerá de this.timeRemaining y this.moves
    }

    EventBus.emit(GameEvents.LEVEL_COMPLETE, {
      stars,
      time: this.levelData.timeLimit - this.timeRemaining,
      moves: this.moves
    });

    if (!win) {
      EventBus.emit(GameEvents.GAME_OVER);
    }
  }
}
