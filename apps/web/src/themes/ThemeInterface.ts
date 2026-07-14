export interface ThemeRenderer {
  init(canvas: HTMLCanvasElement): void;
  renderFrame(deltaTime: number, players: { id: string; hp: number; combo: number; progress: number }[]): void;
  onAttack(sourceId: string, targetId: string, power: number): void;
  onDamage(targetId: string, amount: number): void;
  destroy(): void;
}
