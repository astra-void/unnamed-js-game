import { Scene } from 'phaser';

import { TextButton } from '../ui/components/TextButton';
import { UIConfig, UIScale } from '../ui/UIConfig';

type SavedSettings = {
  musicVolume: number;
  sfxVolume: number;
  fullscreen: boolean;
};

export class Settings extends Scene {
  private uiScale!: UIScale;
  private panel!: Phaser.GameObjects.Rectangle;
  private fullscreenButton!: TextButton;

  private settings: SavedSettings = {
    musicVolume: 0.7,
    sfxVolume: 0.7,
    fullscreen: false
  };

  constructor() {
    super('Settings');
  }

  create() {
    this.uiScale = UIConfig.getScale(this.scale.width, this.scale.height);
    this.settings = this.loadSettings();

    this.createBackground();
    this.createTitle();
    this.createVolumeControls();
    this.createFullscreenToggle();
    this.createBackButton();
  }

  private createBackground() {
    const panelWidth = Math.min(this.scale.width * 0.75, 720);
    const panelHeight = Math.min(this.scale.height * 0.75, 520);

    this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.65
      )
      .setOrigin(0.5);

    this.panel = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      panelWidth,
      panelHeight,
      0x1a1a1a,
      0.9
    );
    this.panel.setStrokeStyle(3, 0xffffff, 0.3);
    this.panel.setOrigin(0.5);
  }

  private createTitle() {
    const title = this.add.text(
      this.scale.width / 2,
      this.panel.y - this.panel.height / 2 + this.uiScale.spacing.lg,
      'Settings',
      {
        fontFamily: 'Arial Black',
        fontSize: `${this.uiScale.fontSize.xl}px`,
        color: '#ffffff'
      }
    );
    title.setOrigin(0.5, 0);
  }

  private createVolumeControls() {
    const startY =
      this.panel.y - this.panel.height / 2 + this.uiScale.spacing.xl * 2;
    const rowGap = this.uiScale.spacing.xl * 1.5;

    this.addVolumeRow(
      'Music Volume',
      startY,
      this.settings.musicVolume,
      (value) => {
        this.settings.musicVolume = value;
        this.sound.volume = value;
      }
    );

    this.addVolumeRow(
      'SFX Volume',
      startY + rowGap,
      this.settings.sfxVolume,
      (value) => {
        this.settings.sfxVolume = value;
      }
    );
  }

  private addVolumeRow(
    label: string,
    y: number,
    value: number,
    onChange: (value: number) => void
  ): Phaser.GameObjects.Text {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: `${this.uiScale.fontSize.lg}px`,
      color: '#ffffff'
    };

    const valueText = this.add
      .text(
        this.scale.width / 2,
        y,
        this.formatVolumeLabel(label, value),
        textStyle
      )
      .setOrigin(0.5);

    const buttonOffset = 180;
    const buttonY = y + this.uiScale.spacing.sm + this.uiScale.spacing.xs;

    new TextButton(
      this,
      this.scale.width / 2 - buttonOffset,
      buttonY,
      '- 5%',
      { ...textStyle, fontSize: `${this.uiScale.fontSize.md}px` },
      {
        onClick: () => {
          const next = Phaser.Math.Clamp(value - 0.05, 0, 1);
          value = next;
          valueText.setText(this.formatVolumeLabel(label, value));
          onChange(next);
          this.saveSettings();
        },
        responsive: false
      }
    );

    new TextButton(
      this,
      this.scale.width / 2 + buttonOffset,
      buttonY,
      '+ 5%',
      { ...textStyle, fontSize: `${this.uiScale.fontSize.md}px` },
      {
        onClick: () => {
          const next = Phaser.Math.Clamp(value + 0.05, 0, 1);
          value = next;
          valueText.setText(this.formatVolumeLabel(label, value));
          onChange(next);
          this.saveSettings();
        },
        responsive: false
      }
    );

    return valueText;
  }

  private formatVolumeLabel(label: string, value: number): string {
    return `${label}: ${Math.round(value * 100)}%`;
  }

  private createFullscreenToggle() {
    const yPos = this.panel.y + this.uiScale.spacing.xl;

    this.fullscreenButton = new TextButton(
      this,
      this.scale.width / 2,
      yPos,
      this.getFullscreenLabel(),
      {
        fontFamily: 'Arial',
        fontSize: `${this.uiScale.fontSize.lg}px`,
        color: '#ffffff'
      },
      {
        onClick: () => {
          this.settings.fullscreen = !this.settings.fullscreen;
          if (this.settings.fullscreen) {
            this.scale.startFullscreen();
          } else {
            this.scale.stopFullscreen();
          }
          this.fullscreenButton.updateTextContent(this.getFullscreenLabel());
          this.saveSettings();
        },
        responsive: false,
        padding: { x: this.uiScale.spacing.lg, y: this.uiScale.spacing.sm }
      }
    );
  }

  private getFullscreenLabel(): string {
    return `Fullscreen: ${this.settings.fullscreen ? 'On' : 'Off'}`;
  }

  private createBackButton() {
    const yPos = this.panel.y + this.panel.height / 2 - this.uiScale.spacing.lg;

    new TextButton(
      this,
      this.scale.width / 2,
      yPos,
      'Back',
      {
        fontFamily: 'Arial',
        fontSize: `${this.uiScale.fontSize.lg}px`,
        color: '#ffffff'
      },
      {
        onClick: () => {
          this.saveSettings();
          this.scene.start('MainMenu');
        },
        responsive: false,
        padding: { x: this.uiScale.spacing.xl, y: this.uiScale.spacing.sm }
      }
    );
  }

  private loadSettings(): SavedSettings {
    const saved = localStorage.getItem('gameSettings');
    if (!saved) return this.settings;

    try {
      const parsed = JSON.parse(saved) as Partial<SavedSettings>;
      return {
        musicVolume: Phaser.Math.Clamp(
          parsed.musicVolume ?? this.settings.musicVolume,
          0,
          1
        ),
        sfxVolume: Phaser.Math.Clamp(
          parsed.sfxVolume ?? this.settings.sfxVolume,
          0,
          1
        ),
        fullscreen: parsed.fullscreen ?? this.settings.fullscreen
      };
    } catch (error) {
      console.warn('Failed to load settings', error);
      return this.settings;
    }
  }

  private saveSettings() {
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
  }
}
