import { Scene } from 'phaser';
import { EventBus, GameEvents } from '../EventBus';

export class MemoGame extends Scene {
  private levelData: any;
  private cards: Phaser.GameObjects.Sprite[] = [];
  private selectedCards: Phaser.GameObjects.Sprite[] = [];
  private matches: number = 0;
  private moves: number = 0;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private timeRemaining: number = 0;
  private canSelect: boolean = true;

  constructor() {
    super('MemoGame');
  }

  init(data: { levelData: any }) {
    this.levelData = data.levelData;
    this.matches = 0;
    this.moves = 0;
    this.timeRemaining = this.levelData.timeLimit || 60;
    this.selectedCards = [];
    this.canSelect = true;
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
    // Esto es un placeholder. Aquí implementaríamos la lógica de mezclar cartas
    // y renderizar los sprites en grilla.
    const cols = this.levelData.gridSize?.cols || 3;
    const rows = this.levelData.gridSize?.rows || 2;
    
    // Simular grilla con rectángulos por ahora
    const startX = 200;
    const startY = 150;
    const spacingX = 120;
    const spacingY = 150;

    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        
        // Placeholder card
        const card = this.add.rectangle(x, y, 100, 130, 0x6C3CE1).setInteractive();
        
        card.on('pointerdown', () => this.handleCardClick(card, index));
        this.cards.push(card as any);
        index++;
      }
    }
  }

  handleCardClick(card: any, index: number) {
    if (!this.canSelect || this.selectedCards.includes(card) || card.getData('matched')) {
      return;
    }

    // Flip animation placeholder
    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      yoyo: true,
      onYoyo: () => {
        card.setFillStyle(0xFF8C42); // Change color to simulate showing face
      }
    });

    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      this.moves++;
      EventBus.emit(GameEvents.UPDATE_MOVES, this.moves);
      this.checkMatch();
    }
  }

  checkMatch() {
    this.canSelect = false;
    const [card1, card2] = this.selectedCards;

    // Simulate match logic (always true for this placeholder)
    const isMatch = Math.random() > 0.5; 

    if (isMatch) {
      // Match successful
      card1.setData('matched', true);
      card2.setData('matched', true);
      this.matches++;
      
      // Flash green
      card1.setFillStyle(0x10B981);
      card2.setFillStyle(0x10B981);

      this.selectedCards = [];
      this.canSelect = true;

      // Check win condition
      const totalPairs = (this.levelData.gridSize.cols * this.levelData.gridSize.rows) / 2;
      if (this.matches === totalPairs) {
        this.time.delayedCall(500, () => this.gameOver(true));
      }
    } else {
      // Not a match, flip back
      this.time.delayedCall(1000, () => {
        this.tweens.add({
          targets: [card1, card2],
          scaleX: 0,
          duration: 150,
          yoyo: true,
          onYoyo: () => {
            card1.setFillStyle(0x6C3CE1);
            card2.setFillStyle(0x6C3CE1);
          },
          onComplete: () => {
            this.selectedCards = [];
            this.canSelect = true;
          }
        });
      });
    }
  }

  gameOver(win: boolean) {
    if (this.timerEvent) this.timerEvent.remove();
    
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

    this.scene.start('GameOver', { win, stars });
  }
}
