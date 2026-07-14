import type { ThemeRenderer } from '../themes/ThemeInterface';
import { FightingRenderer } from '../themes/fighting/FightingRenderer';

export class CanvasController {
  private canvas: HTMLCanvasElement | null = null;
  private renderer: ThemeRenderer = new FightingRenderer();
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private players: { id: string; hp: number; combo: number; progress: number }[] = [];

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer.init(canvas);
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  }

  updatePlayers(players: { id: string; hp: number; combo: number; progress: number }[]) {
    this.players = players;
  }

  private loop = (currentTime: number) => {
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    if (this.canvas) {
      this.renderer.renderFrame(deltaTime, this.players);
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  triggerAttack(sourceId: string, targetId: string, power: number) {
    this.renderer.onAttack(sourceId, targetId, power);
  }

  detach() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.destroy();
    this.canvas = null;
  }
}
