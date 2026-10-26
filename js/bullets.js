export class Bullet {
  constructor(x, y, weaponLevel = 1) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 14;
    this.speed = 8;
    this.vx = 0;
    this.vy = -this.speed;
    this.active = true;
    this.hitCounted = false;
    this.reflected = false;

    this.weaponLevel = weaponLevel;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    const margin = 40;

    if (
      this.y + this.height < -margin ||
      this.y > 500 + margin ||
      this.x < -margin ||
      this.x > 800 + margin
    ) {
      this.active = false;
    }
  }

  draw(ctx) {
    const triple = this.weaponLevel >= 3;

    ctx.save();

    const angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
    ctx.translate(this.x, this.y + this.height / 2);
    ctx.rotate(angle);

    ctx.fillStyle = triple ? "#bb44ff" : "#00ff66";

    if (triple) {
      ctx.shadowColor = "#bb44ff";
      ctx.shadowBlur = 8;
    }

    ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();
  }
}
