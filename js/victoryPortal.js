import {
  CANVAS_WIDTH
} from "./config.js";

export class VictoryPortal {
  constructor() {
    this.x = CANVAS_WIDTH / 2;
    this.y = 65;

    this.radius = 0;
    this.maxRadius = 42;

    this.rotation = 0;
    this.active = true;
    this.opened = false;

    this.particles = [];

    for (let i = 0; i < 28; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 30 + Math.random() * 25,
        size: 1 + Math.random() * 2,
        speed: 0.4 + Math.random() * 0.8
      });
    }
  }

  update() {
    this.rotation += 0.035;

    if (this.radius < this.maxRadius) {
      this.radius += 0.8;
    } else {
      this.radius = this.maxRadius;
      this.opened = true;
    }
  }

  draw(ctx) {
    if (this.radius <= 0) {
      return;
    }

    const progress = this.radius / this.maxRadius;

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.globalAlpha = progress;

    // Same outer glow and purple ring as the introduction portal.
    ctx.shadowColor = "#8844ff";
    ctx.shadowBlur = 25;

    ctx.strokeStyle = "#8844ff";
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Cyan inner ring.
    ctx.shadowColor = "#00e5ff";
    ctx.shadowBlur = 18;

    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // Portal interior.
    const gradient = ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      this.radius * 0.8
    );

    gradient.addColorStop(0, "#02030c");
    gradient.addColorStop(0.6, "#251052");
    gradient.addColorStop(1, "#0088cc");

    ctx.shadowBlur = 0;
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.78, 0, Math.PI * 2);
    ctx.fill();

    // Energy rings.
    ctx.strokeStyle = "rgba(200, 120, 255, 0.7)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      const ringRadius = this.radius * (0.35 + i * 0.17);

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        ringRadius,
        ringRadius * 0.55,
        this.rotation * 2 + i,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    // Orbiting particles.
    for (const particle of this.particles) {
      const angle =
        particle.angle +
        this.rotation * particle.speed;

      const distance = particle.distance * progress;
      const px = Math.cos(angle) * distance;
      const py = Math.sin(angle) * distance;

      ctx.fillStyle =
        particle.speed > 0.8 ? "#00e5ff" : "#bb44ff";

      ctx.beginPath();
      ctx.arc(px, py, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
