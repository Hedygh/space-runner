import {
  CANVAS_WIDTH
} from "./config.js";

export class DragonMirror {
  constructor() {
    this.side = "left";
    this.x = 72;
    this.y = 112;

    this.radiusX = 34;
    this.radiusY = 12;
    this.angle = -Math.PI / 4;

    this.state = "appearing";
    this.stateTimer = 0;
    this.scale = 0;
    this.alpha = 1;

    this.appearDuration = 30;
    this.activeDuration = 480;
    this.warningDuration = 60;
    this.disappearDuration = 30;

    this.particles = Array.from(
      { length: 14 },
      (_, index) => ({
        angle: (index / 14) * Math.PI * 2,
        distance: 28 + Math.random() * 9,
        size: 0.8 + Math.random() * 1.3,
        speed: 0.012 + Math.random() * 0.014
      })
    );
  }

  update() {
    this.stateTimer++;

    for (const particle of this.particles) {
      particle.angle += particle.speed;
    }

    if (this.state === "appearing") {
      const progress = Math.min(
        1,
        this.stateTimer / this.appearDuration
      );

      this.scale = this.easeOutBack(progress);
      this.alpha = progress;

      if (progress >= 1) {
        this.setState("active");
      }

      return;
    }

    if (this.state === "active") {
      this.scale = 1;
      this.alpha = 1;

      if (this.stateTimer >= this.activeDuration) {
        this.setState("warning");
      }

      return;
    }

    if (this.state === "warning") {
      this.scale = 1;
      this.alpha =
        Math.floor(this.stateTimer / 6) % 2 === 0
          ? 1
          : 0.45;

      if (this.stateTimer >= this.warningDuration) {
        this.setState("disappearing");
      }

      return;
    }

    const progress = Math.min(
      1,
      this.stateTimer / this.disappearDuration
    );

    this.scale = 1 - this.easeInCubic(progress);
    this.alpha = 1 - progress;

    if (progress >= 1) {
      this.swapSide();
      this.setState("appearing");
    }
  }

  setState(state) {
    this.state = state;
    this.stateTimer = 0;
  }

  swapSide() {
    this.side = this.side === "left" ? "right" : "left";
    this.x = this.side === "left" ? 72 : CANVAS_WIDTH - 72;
    this.angle = this.side === "left"
      ? -Math.PI / 4
      : Math.PI / 4;
  }

  canReflect() {
    return this.state === "active" || this.state === "warning";
  }

  containsBullet(bullet) {
    if (!this.canReflect() || bullet.reflected) {
      return false;
    }

    const dx = bullet.x - this.x;
    const dy = bullet.y + bullet.height / 2 - this.y;
    const cos = Math.cos(-this.angle);
    const sin = Math.sin(-this.angle);
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;

    const hitRadiusX = this.radiusX + bullet.width;
    const hitRadiusY = this.radiusY + bullet.height / 2;

    return (
      (localX * localX) / (hitRadiusX * hitRadiusX) +
      (localY * localY) / (hitRadiusY * hitRadiusY)
    ) <= 1;
  }

  reflectBullet(bullet, targetX, targetY) {
    const dx = targetX - bullet.x;
    const dy = targetY - bullet.y;
    const distance = Math.hypot(dx, dy) || 1;

    bullet.vx = (dx / distance) * bullet.speed;
    bullet.vy = (dy / distance) * bullet.speed;
    bullet.reflected = true;
  }

  draw(ctx) {
    if (this.scale <= 0 || this.alpha <= 0) {
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.alpha;

    ctx.shadowColor = "#8844ff";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "rgba(38, 8, 76, 0.88)";
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const gradient = ctx.createLinearGradient(
      0,
      -this.radiusY,
      0,
      this.radiusY
    );
    gradient.addColorStop(0, "#153b67");
    gradient.addColorStop(0.45, "#00e5ff");
    gradient.addColorStop(1, "#d9fbff");

    ctx.shadowColor = "#00e5ff";
    ctx.shadowBlur = 14;
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#58efff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(
      0,
      1,
      this.radiusX * 0.72,
      this.radiusY * 0.58,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Brighter lower rim makes the downward-facing entry readable.
    ctx.strokeStyle = "rgba(225, 255, 255, 0.9)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(
      0,
      2,
      this.radiusX * 0.82,
      this.radiusY * 0.75,
      0,
      0.05 * Math.PI,
      0.95 * Math.PI
    );
    ctx.stroke();

    ctx.shadowBlur = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const px = Math.cos(particle.angle) * particle.distance;
      const py = Math.sin(particle.angle) * particle.distance * 0.48;

      ctx.fillStyle = i % 2 === 0 ? "#00e5ff" : "#bb44ff";
      ctx.beginPath();
      ctx.arc(px, py, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  easeInCubic(value) {
    return value * value * value;
  }

  easeOutBack(value) {
    const overshoot = 1.25;
    const shifted = value - 1;

    return 1 +
      (overshoot + 1) * shifted * shifted * shifted +
      overshoot * shifted * shifted;
  }
}
