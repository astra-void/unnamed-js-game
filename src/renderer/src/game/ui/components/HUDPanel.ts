import { EventBus } from '../../EventBus';
import { UIComponent } from '../../types/ui';
import { UIConfig, UIScale } from '../UIConfig';

export interface HUDData {
  health?: number;
  maxHealth?: number;
  experience?: number;
  maxExperience?: number;
  level?: number;
  score?: number;
  time?: number;
}

export class HUDPanel
  extends Phaser.GameObjects.Container
  implements UIComponent
{
  id = 'hud-panel';
  object: Phaser.GameObjects.GameObject;

  private healthBarBg: Phaser.GameObjects.Rectangle;
  private healthBarFill: Phaser.GameObjects.Rectangle;
  private healthText: Phaser.GameObjects.Text;

  private expBarBg: Phaser.GameObjects.Rectangle;
  private expBarFill: Phaser.GameObjects.Rectangle;
  private levelText: Phaser.GameObjects.Text;

  private scoreText?: Phaser.GameObjects.Text;
  private timeText?: Phaser.GameObjects.Text;

  private barWidth: number;
  private barHeight: number;
  private padding: number;
  private uiScale: UIScale;

  private currentHealth: number = 100;
  private currentMaxHealth: number = 100;
  private currentExp: number = 0;
  private currentMaxExp: number = 50;
  private currentLevel: number = 1;
  private currentScore: number = 0;
  private currentTime: number = 0;

  private playerId?: string;

  constructor(scene: Phaser.Scene, x: number, y: number, playerId?: string) {
    super(scene, x, y);

    this.playerId = playerId;
    this.object = this;

    this.uiScale = UIConfig.getScale(scene.scale.width, scene.scale.height);
    this.padding = this.uiScale.spacing.md;

    this.barWidth = Math.min(400, scene.scale.width * 0.3);
    this.barHeight = 24;

    this.setDepth(100);

    this.createHealthBar();
    this.createExpBar();
    this.createScoreAndTime();
    this.setupEventListeners();

    scene.add.existing(this);
  }

  private setupEventListeners(): void {
    EventBus.on(
      `player:${this.playerId}:healthChanged`,
      ({ hp }: { hp: number }) => {
        this.updateData({ health: hp });
      }
    );

    EventBus.on(
      `player:${this.playerId}:maxHealthChanged`,
      ({ maxHp }: { maxHp: number }) => {
        this.updateData({ maxHealth: maxHp });
      }
    );

    EventBus.on(
      `player:${this.playerId}:expChanged`,
      ({ exp, maxExp }: { exp: number; maxExp: number }) => {
        this.updateData({ experience: exp, maxExperience: maxExp });
      }
    );

    EventBus.on(
      `player:${this.playerId}:levelChanged`,
      ({ level }: { level: number }) => {
        this.updateData({ level });
      }
    );

    EventBus.on('game:scoreChanged', ({ score }: { score: number }) => {
      this.updateData({ score });
    });

    EventBus.on('game:timeChanged', ({ time }: { time: number }) => {
      this.updateData({ time });
    });
  }

  private createHealthBar(): void {
    const yPos = 0;

    this.healthBarBg = this.scene.add.rectangle(
      0,
      yPos,
      this.barWidth,
      this.barHeight,
      0x330000,
      0.8
    );
    this.healthBarBg.setOrigin(0, 0.5);
    this.healthBarBg.setStrokeStyle(2, 0xff0000, 0.5);

    this.healthBarFill = this.scene.add.rectangle(
      0,
      yPos,
      this.barWidth,
      this.barHeight,
      0xff0000,
      0.9
    );
    this.healthBarFill.setOrigin(0, 0.5);

    this.healthText = this.scene.add.text(
      this.barWidth / 2,
      yPos,
      '100 / 100',
      {
        fontSize: `${this.uiScale.fontSize.sm}px`,
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    this.healthText.setOrigin(0.5);

    const hpLabel = this.scene.add.text(-this.padding, yPos, '❤', {
      fontSize: `${this.uiScale.fontSize.md}px`,
      color: '#ff0000'
    });
    hpLabel.setOrigin(1, 0.5);

    this.add([this.healthBarBg, this.healthBarFill, this.healthText, hpLabel]);
  }

  private createExpBar(): void {
    const yPos = this.barHeight + this.uiScale.spacing.sm;

    this.expBarBg = this.scene.add.rectangle(
      0,
      yPos,
      this.barWidth,
      this.barHeight * 0.7,
      0x003300,
      0.8
    );
    this.expBarBg.setOrigin(0, 0.5);
    this.expBarBg.setStrokeStyle(2, 0x00ff00, 0.5);

    this.expBarFill = this.scene.add.rectangle(
      0,
      yPos,
      0,
      this.barHeight * 0.7,
      0x00ff00,
      0.9
    );
    this.expBarFill.setOrigin(0, 0.5);

    this.levelText = this.scene.add.text(-this.padding, yPos, 'Lv.1', {
      fontSize: `${this.uiScale.fontSize.md}px`,
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.levelText.setOrigin(1, 0.5);

    this.add([this.expBarBg, this.expBarFill, this.levelText]);
  }

  private createScoreAndTime(): void {
    const rightX = this.scene.scale.width - this.padding - this.x;
    const topY = -this.barHeight;

    this.scoreText = this.scene.add.text(rightX, topY, 'Score: 0', {
      fontSize: `${this.uiScale.fontSize.lg}px`,
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.scoreText.setOrigin(1, 0);

    this.timeText = this.scene.add.text(
      rightX,
      topY + this.scoreText.height + this.uiScale.spacing.xs,
      'Time: 00:00',
      {
        fontSize: `${this.uiScale.fontSize.md}px`,
        fontFamily: 'sans-serif',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    this.timeText.setOrigin(1, 0);

    this.add([this.scoreText, this.timeText]);
  }

  updateData(data: HUDData): void {
    if (data.health !== undefined) {
      this.currentHealth = data.health;
    }
    if (data.maxHealth !== undefined) {
      this.currentMaxHealth = data.maxHealth;
    }

    if (data.health !== undefined || data.maxHealth !== undefined) {
      const healthPercent = this.currentHealth / this.currentMaxHealth;
      this.healthBarFill.width = this.barWidth * healthPercent;
      this.healthText.setText(
        `${Math.ceil(this.currentHealth)} / ${this.currentMaxHealth}`
      );

      if (healthPercent > 0.5) {
        this.healthBarFill.setFillStyle(0xff0000);
      } else if (healthPercent > 0.25) {
        this.healthBarFill.setFillStyle(0xff6600);
      } else {
        this.healthBarFill.setFillStyle(0xff0000);
        if (healthPercent < 0.25) {
          this.scene.tweens.add({
            targets: this.healthBarFill,
            alpha: 0.5,
            duration: 300,
            yoyo: true,
            repeat: 0
          });
        }
      }
    }

    if (data.experience !== undefined) {
      this.currentExp = data.experience;
    }
    if (data.maxExperience !== undefined) {
      this.currentMaxExp = data.maxExperience;
    }

    if (data.experience !== undefined || data.maxExperience !== undefined) {
      const expPercent = this.currentExp / this.currentMaxExp;
      const targetWidth = this.barWidth * expPercent;

      this.scene.tweens.add({
        targets: this.expBarFill,
        width: targetWidth,
        duration: 300,
        ease: 'Quad.easeOut'
      });

      if (expPercent >= 1) {
        this.playLevelUpEffect();
      }
    }

    if (data.level !== undefined) {
      this.currentLevel = data.level;
      this.levelText.setText(`Lv.${this.currentLevel}`);
    }

    if (data.score !== undefined) {
      this.currentScore = data.score;
      if (this.scoreText) {
        this.scoreText.setText(`Score: ${this.currentScore.toLocaleString()}`);
      }
    }

    if (data.time !== undefined) {
      this.currentTime = data.time;
      if (this.timeText) {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        this.timeText.setText(
          `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }
  }

  private playLevelUpEffect(): void {
    this.scene.tweens.add({
      targets: [this.expBarFill, this.expBarBg],
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 3
    });

    this.scene.tweens.add({
      targets: this.levelText,
      scale: 1.5,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    if (this.scene.textures.exists('projectile')) {
      const particles = this.scene.add.particles(
        this.levelText.x + this.x,
        this.levelText.y + this.y,
        'projectile',
        {
          speed: { min: 50, max: 100 },
          scale: { start: 0.5, end: 0 },
          lifespan: 500,
          quantity: 10,
          blendMode: 'ADD'
        }
      );

      this.scene.time.delayedCall(500, () => {
        particles.destroy();
      });
    }
  }

  flashDamage(): void {
    this.scene.tweens.add({
      targets: this.healthBarFill,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1
    });
  }

  update(_time: number, _delta: number): void {}

  onResize(width: number, height: number): void {
    this.uiScale = UIConfig.getScale(width, height);

    this.barWidth = Math.min(400, width * 0.3);

    this.healthBarBg.width = this.barWidth;
    this.healthText.x = this.barWidth / 2;
    this.healthText.setFontSize(this.uiScale.fontSize.sm);

    this.expBarBg.width = this.barWidth;
    this.levelText.setFontSize(this.uiScale.fontSize.md);

    if (this.scoreText && this.timeText) {
      const rightX = width - this.padding - this.x;
      this.scoreText.x = rightX;
      this.timeText.x = rightX;
      this.scoreText.setFontSize(this.uiScale.fontSize.lg);
      this.timeText.setFontSize(this.uiScale.fontSize.md);
    }
  }

  destroy(fromScene?: boolean): void {
    EventBus.off(`player:${this.playerId}:healthChanged`);
    EventBus.off(`player:${this.playerId}:maxHealthChanged`);
    EventBus.off(`player:${this.playerId}:expChanged`);
    EventBus.off(`player:${this.playerId}:levelChanged`);
    EventBus.off('game:scoreChanged');
    EventBus.off('game:timeChanged');

    super.destroy(fromScene);
  }
}
