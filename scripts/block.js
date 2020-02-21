class Block {
  constructor(x, size, mass, velocity, xBound) {
    this.x = x;
    this.size = size;
    this.mass = mass;
    this.vel = velocity;
    this.xb = xBound;
  }

  hitsWall() {
    return this.x <= wallX;
  }

  reverse() {
    this.vel *= -1;
  }

  collidesWith(otherBlock) {
    return this.x + this.size > otherBlock.x;
  }

  bounceOff(otherBlock) {
    const massSum = this.mass + otherBlock.mass;
    const newVelocity =
      ((this.mass - otherBlock.mass) / massSum) * this.vel +
      ((2 * otherBlock.mass) / massSum) * otherBlock.vel;
    return newVelocity;
  }

  update() {
    this.x += this.vel;
  }

  show() {
    stroke(255);
    noStroke();
    const x = constrain(this.x, this.xb, width + this.size);
    fill(map(this.size, blockASize, 8 * blockASize, 255, 50));
    rect(x, height - this.size, this.size, this.size);

    fill(255);
    textAlign(CENTER);
    textSize(20);
    text(`${this.mass} kg`, this.x + this.size / 2, height - this.size - 10);
  }
}
