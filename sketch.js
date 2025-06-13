/**
 * Generative Life Artwork - Scales with window size
 * 
 * This artwork simulates the metaphorical passage of life using four key visual components:
 * - NoiseBlob: Floating fog-like glowing masses representing the flow of time and breath.
 * - Radiant: Rotating energy rays symbolizing vitality or moments of clarity.
 * - Hole: Black voids that suggest memory loss, absence, or emotional gaps.
 * - Spark: Flickering particles that drift and vanish, symbolizing fleeting memories or events.
 * 
 * All components are animated independently using Perlin noise, sine waves, and random behavior.
 * The sketch is responsive and adapts to any browser window size using normalized coordinates.
 *
 * Each class stores normalized coordinates (0.0 - 1.0) for scale-safe layout,
 * and then calculates its pixel positions based on the canvas dimensions.
 */

let blobs = [], radiants = [], holes = [], sparks = [];
let bgTexture; // Off-screen buffer for persistent background grain and line texture

function setup() {
  /**
   * Step 1: Setup and Initialization
   * - Create a canvas that fills the window.
   * - Initialize an off-screen graphics buffer.
   * - Generate the four types of visual components.
   */
  createCanvas(windowWidth, windowHeight);
  background(0); // Ensure clean black background
  noStroke();     // Disable outlines globally for cleaner visuals

  bgTexture = createGraphics(width, height); // Create off-screen texture layer
  createTexture(bgTexture);                 // Populate buffer with grain and line texture

  // Instantiate all elements with randomized positions
  for (let i = 0; i < 60; i++) blobs.push(new NoiseBlob());
  for (let i = 0; i < 25; i++) radiants.push(new Radiant());
  for (let i = 0; i < 20; i++) holes.push(new Hole());
  for (let i = 0; i < 200; i++) sparks.push(new Spark());
}

function draw() {
  /**
   * Step-by-step rendering pipeline
   * - Static background texture
   * - Semi-transparent overlay for motion trails
   * - Depth-ordered rendering of animated elements
   */

  // Step 1: Draw the pre-generated background texture
  image(bgTexture, 0, 0);

  // Step 2: Overlay a low-opacity black rectangle to create ghosting/motion blur
  fill(0, 25);
  rect(0, 0, width, height);

  // Step 3: Render 'Hole' elements — these black voids stay mostly static
  for (let h of holes) h.show();

  // Step 4: Animate and render 'NoiseBlob' — soft glowing blobs
  for (let b of blobs) {
    b.update();
    b.show();
  }

  // Step 5: Animate and render 'Radiant' — rotating spiky light bursts
  for (let r of radiants) {
    r.update();
    r.show();
  }

  // Step 6: Animate and render 'Spark' — glowing drifting particles
  for (let s of sparks) {
    s.update();
    s.show();
  }
}

function windowResized() {
  /**
   * Ensures that all components properly scale and reposition when the window changes size.
   */
  resizeCanvas(windowWidth, windowHeight);
  bgTexture = createGraphics(width, height);
  createTexture(bgTexture);

  // Recalculate element positions and sizes using stored normalized coordinates
  for (let b of blobs) {
    b.x = b.normX * width;
    b.y = b.normY * height;
    b.rBase *= min(width, height) / 900;
  }
  for (let r of radiants) {
    r.x = r.normX * width;
    r.y = r.normY * height;
    r.r *= min(width, height) / 900;
    r.lineLength *= min(width, height) / 900;
  }
  for (let h of holes) {
    h.x = h.normX * width;
    h.y = h.normY * height;
    h.r *= min(width, height) / 900;
    h.innerR *= min(width, height) / 900;
  }
  for (let s of sparks) {
    s.x = s.normX * width;
    s.y = s.normY * height;
  }
}

function createTexture(g) {
  /**
   * Create static background texture:
   * - Random dots for noise
   * - Soft diagonal lines for depth
   */
  g.background(0);
  g.noStroke();

  // Grainy particles
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(0.5, 2);
    let a = random(5, 15);
    g.fill(30, 20, 40, a); // Dim purple-colored dots
    g.ellipse(x, y, s);
  }

  // Subtle scratch lines for visual layering
  g.stroke(40, 30, 50, 10);
  for (let i = 0; i < 50; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-100, 100);
    g.line(x1, y1, x2, y2);
  }
}

// The classes below represent the core metaphoric visual components.
// Each uses independent behavior and styling logic.

// NoiseBlob: Glowing fog-like entity animated with Perlin noise and pulsing size
class NoiseBlob {
  constructor() {
    /**
     * Initialize position, size, and appearance for the blob.
     * Each blob has a unique position, oscillation phase, and color.
     */
    this.normX = random();
    this.normY = random();
    this.x = this.normX * width;
    this.y = this.normY * height;
    this.rBase = random(0, 120) * (min(width, height)/900); // base radius
    this.alpha = random(30, 120);
    this.phase = random(TWO_PI);
    this.speed = random(0.003, 0.01);
    /**
     * Blob color is warm and soft, with slight variations.
     */
    this.c = color(255 + random(-30, 0), 180 + random(-30, 30), 120 + random(-50, 50), this.alpha);
    this.depth = random(1);
    this.noiseScale = random(0.005, 0.02);
  }

  update() {
    /**
     * Update the blob's radius based on sinusoidal phase.
     * Also use Perlin noise for drifting movement.
     */
    this.phase += this.speed;
    this.r = this.rBase + sin(this.phase) * (15 * this.depth);
    this.x += map(noise(frameCount * this.noiseScale, 0), -1, 1, -0.3, 0.3);
    this.y += map(noise(0, frameCount * this.noiseScale), -1, 1, -0.3, 0.3);
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  show() {
    /**
     * Render the core and glow layers of the blob.
     * Uses multiple ellipses and light blending for glow effect.
     */
    push();
    translate(this.x, this.y);
    if (this.depth > 0.7) drawingContext.globalCompositeOperation = 'lighter';
    fill(this.c);
    ellipse(0, 0, this.r);

    // Outer glow rings
    let glowSize = this.r * 1.5;
    for (let i = 0; i < 3; i++) {
      fill(red(this.c), green(this.c), blue(this.c), this.alpha * 0.3 / (i + 1));
      ellipse(0, 0, glowSize * (0.7 + i * 0.3));
    }

    // Ripple-like stroke details
    noFill();
    stroke(255, this.alpha * 0.5);
    strokeWeight(0.5);
    for (let i = 0; i < 5; i++) {
      ellipse(0, 0, this.r * (0.3 + i * 0.1));
    }
    pop();
  }
}

// Radiant: Rotating rays to symbolize pulsing life energy
class Radiant {
  /**
   * Each radiant has a center, rotation, and pulsing rays.
   */
  constructor() {
    this.normX = random();
    this.normY = random();
    this.x = this.normX * width;
    this.y = this.normY * height;
    this.r = random(15, 50) * (min(width, height)/900);
    this.n = int(random(20, 100)); // number of rays
    this.alpha = random(40, 120);
    this.angle = random(TWO_PI);
    this.rotSpeed = random(0.001, 0.02);
    this.lineLength = random(15, 40);
    this.depth = random(1);
    this.pulseSpeed = random(0.01, 0.03);
    this.pulsePhase = random(TWO_PI);
  }

  update() {
    /**
     * Advance rotation and update ray pulsing size.
     */
    this.angle += this.rotSpeed * map(this.depth, 0, 1, 0.8, 1.2);
    this.pulsePhase += this.pulseSpeed;
    this.currentLength = this.lineLength * (0.8 + sin(this.pulsePhase) * 0.2);
  }

  show() {
    /**
     * Draw the rotating rays outward from center.
     * Every 5th ray is brighter and thicker for contrast.
     */
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    let strokeAlpha = this.alpha * map(this.depth, 0, 1, 0.7, 1);

    for (let i = 0; i < this.n; i++) {
      let a = TWO_PI * i / this.n;
      let x1 = cos(a) * this.r;
      let y1 = sin(a) * this.r;
      let x2 = cos(a) * (this.r + this.currentLength);
      let y2 = sin(a) * (this.r + this.currentLength);

      if (i % 5 === 0) {
        stroke(255, 255, 200, strokeAlpha * 1.5);
        strokeWeight(map(this.depth, 0, 1, 0.5, 1.2));
      } else {
        stroke(255, 240, 180, strokeAlpha);
        strokeWeight(map(this.depth, 0, 1, 0.3, 0.8));
      }
      line(x1, y1, x2, y2);
    }

    // Draw central glow core
    fill(255, 240, 180, strokeAlpha * 0.5);
    noStroke();
    ellipse(0, 0, this.r * 0.5);
    pop();
  }
}

// Hole: Symbolic voids to suggest loss or emptiness
class Hole {
  constructor() {
    /**
     * Define circular hole with outer black ring and inner colored core.
     */
    this.normX = random();
    this.normY = random();
    this.x = this.normX * width;
    this.y = this.normY * height;
    this.r = random(5, 10) * (min(width, height)/900);
    this.innerR = this.r * random(0.3, 0.7);
    this.innerColor = color(20 + random(-10, 10), 10 + random(-5, 5), 30 + random(-10, 10));
  }

  show() {
    /**
     * Draw outer black circle, inner color core, and a highlight spot.
     */
    push();
    translate(this.x, this.y);
    noStroke();
    fill(0); // Outer void
    ellipse(0, 0, this.r * 2);
    fill(this.innerColor); // Core glow
    ellipse(0, 0, this.innerR * 2);
    fill(60, 50, 80, 100); // Subtle specular highlight
    ellipse(this.r * 0.2, -this.r * 0.2, this.r * 0.3);
    pop();
  }
}

// Spark: Fleeting glowing particles with fade and drift
class Spark {
  constructor() {
    /**
     * When created, immediately call reset to initialize position and attributes.
     */
    this.normX = random();
    this.normY = random();
    this.reset();
    this.type = random() > 0.7 ? "line" : "dot"; // Different style for variety
  }

  reset() {
    /**
     * Reinitialize particle when it dies or leaves the screen.
     */
    this.x = this.normX * width;
    this.y = this.normY * height;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(1, 3);
    this.baseAlpha = random(50, 150);
    this.colorVariation = random(100);
    this.life = random(100, 500);
    this.age = 0;
  }

  update() {
    /**
     * Move the particle and age it.
     * If too old or off-screen, restart it.
     */
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    if (this.age > this.life || this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
  }

  show() {
    /**
     * Render the particle.
     * Either a glowing dot or a glowing line depending on type.
     */
    let alpha = this.baseAlpha * (0.5 + 0.5 * sin(this.age * 0.05));
    if (this.type === "line") {
      let angle = noise(this.x * 0.01, this.y * 0.01) * TWO_PI;
      let len = this.size * 3;
      stroke(255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3, alpha);
      strokeWeight(this.size * 0.5);
      line(this.x, this.y, this.x + cos(angle) * len, this.y + sin(angle) * len);
    } else {
      noStroke();
      fill(255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3, alpha);
      ellipse(this.x, this.y, this.size);
      fill(255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3, alpha * 0.3);
      ellipse(this.x, this.y, this.size * 3);
    }
  }
}
