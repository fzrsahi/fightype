import { FightingRenderer } from '../themes/fighting/FightingRenderer';
export class CanvasController {
    canvas = null;
    renderer = new FightingRenderer();
    animationFrameId = null;
    lastFrameTime = 0;
    players = [];
    attach(canvas) {
        this.canvas = canvas;
        this.renderer.init(canvas);
        this.lastFrameTime = performance.now();
        this.loop(this.lastFrameTime);
    }
    updatePlayers(players) {
        this.players = players;
    }
    loop = (currentTime) => {
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        if (this.canvas) {
            this.renderer.renderFrame(deltaTime, this.players);
        }
        this.animationFrameId = requestAnimationFrame(this.loop);
    };
    triggerAttack(sourceId, targetId, power) {
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
