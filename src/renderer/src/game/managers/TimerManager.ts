import { EventBus } from '../EventBus';

export class TimerManager {
  private elapsedTime = 0;
  private isRunning = false;
  private lastEmittedSeconds = -1;

  getElapsedSeconds(): number {
    return Math.floor(this.elapsedTime);
  }

  start(): void {
    this.reset();
    this.isRunning = true;
  }

  pause(): void {
    this.isRunning = false;
  }

  resume(): void {
    this.isRunning = true;
  }

  reset(): void {
    this.elapsedTime = 0;
    this.lastEmittedSeconds = -1;
    EventBus.emit('game:timeChanged', { time: 0 });
  }

  update(_time: number, delta: number): void {
    if (!this.isRunning) return;

    this.elapsedTime += delta / 1000;
    const currentSeconds = Math.floor(this.elapsedTime);

    if (currentSeconds !== this.lastEmittedSeconds) {
      this.lastEmittedSeconds = currentSeconds;
      EventBus.emit('game:timeChanged', { time: currentSeconds });
    }
  }
}
