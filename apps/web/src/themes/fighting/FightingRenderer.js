export class FightingRenderer {
    ctx = null;
    width = 0;
    height = 0;
    attackParticles = [];
    init(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }
    renderFrame(deltaTime, players) {
        if (!this.ctx)
            return;
        // Clear background with Terraria-style dark night gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0c0f1d');
        gradient.addColorStop(1, '#1d243b');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Draw arena floor (Terraria stone block pattern)
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(0, this.height - 40, this.width, 40);
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 2;
        for (let x = 0; x < this.width; x += 40) {
            this.ctx.strokeRect(x, this.height - 40, 40, 40);
        }
        // Draw characters
        const spacing = this.width / (players.length + 1);
        players.forEach((player, index) => {
            const cx = spacing * (index + 1);
            const cy = this.height - 80;
            // Draw shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + 35, 20, 8, 0, 0, Math.PI * 2);
            this.ctx.fill();
            // Draw Pixel Character Sprite Placeholder (Terraria warrior)
            this.ctx.fillStyle = index === 0 ? '#00ff88' : '#ff0055';
            this.ctx.fillRect(cx - 15, cy - 20, 30, 50);
            // Draw Weapon Sword
            this.ctx.fillStyle = '#cbd5e0';
            this.ctx.fillRect(index === 0 ? cx + 15 : cx - 25, cy - 10, 10, 35);
            // HP Bar above character
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(cx - 30, cy - 40, 60, 8);
            this.ctx.fillStyle = player.hp > 50 ? '#00ff88' : '#ff0055';
            this.ctx.fillRect(cx - 30, cy - 40, Math.max(0, (player.hp / 100) * 60), 8);
        });
        // Update & draw particles
        this.ctx.fillStyle = '#00ff88';
        for (let i = this.attackParticles.length - 1; i >= 0; i--) {
            const p = this.attackParticles[i];
            p.x += p.vx * deltaTime * 60;
            p.y += p.vy * deltaTime * 60;
            p.alpha -= deltaTime * 2;
            if (p.alpha <= 0) {
                this.attackParticles.splice(i, 1);
            }
            else {
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.fillRect(p.x, p.y, 4, 4);
            }
        }
        this.ctx.globalAlpha = 1.0;
    }
    onAttack(sourceId, _targetId, _power) {
        // Generate slash particles
        for (let i = 0; i < 15; i++) {
            this.attackParticles.push({
                x: sourceId ? 150 : 300,
                y: 180,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                alpha: 1.0,
            });
        }
    }
    onDamage(_targetId, _amount) {
        // Trigger hit effect
    }
    destroy() {
        this.ctx = null;
        this.attackParticles = [];
    }
}
