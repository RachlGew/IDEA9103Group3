let particles = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  frameRate(30);

  // Create particles
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(0); // Black background

  for (let particle of particles) {
    let percent = frameCount / 500.0;
    particle.update(percent);
    particle.display();
  }

  // Add a chance to create new particles
  if (random(1) < 0.01) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Remove old particles to manage complexity
  if (particles.length > 200) {
    particles.splice(0, 1);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.hue = random(360);
    this.size = random(10, 50);
    this.growth = random(1, 3);
  }

  update(percent) {
    let angle = noise(this.pos.x * 0.005, this.pos.y * 0.005, percent) * TWO_PI * 5;
    let force = p5.Vector.fromAngle(angle);
    this.acc.add(force);

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Make particles grow and then retract
    if (frameCount % 100 === 0) {
      this.growth *= -1;
    }
    this.size += this.growth;
  }

  display() {
    fill(this.hue, 80, 100, 50);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}