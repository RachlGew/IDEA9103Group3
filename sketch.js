/**
 * The following lines were taken from ChatGPT. This is a generative artwork
 * composed of four main visual elements: glowing blobs, radiating lines, dark holes,
 * and drifting spark particles. Each part is carefully layered to simulate the passage of life.
 * All processes are modular and explained step-by-step in comments.
 */

let blobs = [];     // Array to hold NoiseBlob objects
let radiants = [];  // Array to hold Radiant objects
let holes = [];     // Array to hold Hole objects
let sparks = [];    // Array to hold Spark particle objects
let bgTexture;      // Background texture graphics buffer

function setup() {
  /**
   * Step 1: Create a square canvas for the generative artwork.
   * A 900x900 canvas gives ample space for layering and motion.
   */
  createCanvas(900, 900);

  /**
   * Step 2: Set the initial background to black.
   * This provides a clean slate and helps highlight glowing elements.
   */
  background(0);

  /**
   * Step 3: Disable all outlines globally.
   * Most elements in this sketch are rendered with fill only.
   */
  noStroke();

  /**
   * Step 4: Create a secondary graphics buffer for background texture.
   * This buffer allows us to render grain and lines once and reuse it each frame.
   */
  bgTexture = createGraphics(width, height);
  createTexture(bgTexture); // Call a custom function to draw into the buffer

  /**
   * Step 5: Generate multiple NoiseBlob objects.
   * These fog-like blobs will float and pulse across the canvas.
   */
  for (let i = 0; i < 60; i++) {
    blobs.push(new NoiseBlob());
  }

  /**
   * Step 6: Generate multiple Radiant objects.
   * These represent symbolic light bursts that rotate over time.
   */
  for (let i = 0; i < 25; i++) {
    radiants.push(new Radiant());
  }

  /**
   * Step 7: Generate multiple Hole objects.
   * These are circular black voids to simulate "absences" or portals.
   */
  for (let i = 0; i < 20; i++) {
    holes.push(new Hole());
  }

  /**
   * Step 8: Generate multiple Spark objects.
   * These particles drift and flicker like floating stardust.
   */
  for (let i = 0; i < 200; i++) {
    sparks.push(new Spark());
  }

  /**
   * The setup is now complete.
   * The animation will begin rendering in the draw loop.
   */
}


function draw() {
  /**
   * Step 1: Draw the background texture every frame.
   * This creates a persistent visual base using a pre-rendered graphic layer.
   */
  image(bgTexture, 0, 0);

  /**
   * Step 2: Overlay a semi-transparent black rectangle on top.
   * This creates a subtle trail/fade effect for moving elements.
   */
  fill(0, 25);
  rect(0, 0, width, height);

  /**
   * Step 3: Show the Hole elements.
   * These are static or slowly changing black voids rendered first to establish depth.
   */
  for (let h of holes) {
    h.show();
  }

  /**
   * Step 4: Update and show the NoiseBlob elements.
   * These are soft, glowing fog blobs with layered transparency and noise-based movement.
   */
  for (let b of blobs) {
    b.update(); // Animate the blob’s position and size
    b.show();   // Draw the blob to the screen
  }

  /**
   * Step 5: Update and show the Radiant elements.
   * These simulate rotating rays of light with pulsating lengths.
   */
  for (let r of radiants) {
    r.update(); // Update the rotation and pulse
    r.show();   // Draw the radiant shape
  }

  /**
   * Step 6: Update and show Spark particles.
   * These small glowing particles drift across the canvas and reset after a lifespan.
   */
  for (let s of sparks) {
    s.update(); // Move the spark and handle lifespan logic
    s.show();   // Render either a dot or streak version of the spark
  }

  /**
   * The frame is complete.
   * The draw loop continues indefinitely to simulate evolving motion.
   */
}


// Function to create a grainy, textured background
function createTexture(g) {
  g.background(0);
  g.noStroke();

  // Add noise dots to the texture
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(0.5, 2);
    let a = random(5, 15);
    g.fill(30, 20, 40, a);
    g.ellipse(x, y, s);
  }

  // Add subtle line patterns for depth
  g.stroke(40, 30, 50, 10);
  for (let i = 0; i < 50; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-100, 100);
    g.line(x1, y1, x2, y2);
  }
}

// 🌫️ NoiseBlob: Glowing fog with layered motion and texture
class NoiseBlob {
  constructor() {
    /**
     * Initialize position, size, and appearance for the blob.
     * Each blob has a unique position, oscillation phase, and color.
     */
    this.x = random(width);
    this.y = random(height);
    this.rBase = random(0, 120);       // Base radius
    this.alpha = random(30, 120);      // Transparency
    this.phase = random(TWO_PI);       // For oscillation
    this.speed = random(0.003, 0.01);  // Pulsing speed

    /**
     * Blob color is warm and soft, with slight variations.
     */
    this.c = color(
      255 + random(-30, 0),     // Red
      180 + random(-30, 30),    // Green
      120 + random(-50, 50),    // Blue
      this.alpha                // Alpha
    );

    this.depth = random(1);             // Affects brightness/scale
    this.noiseScale = random(0.005, 0.02);  // Controls drifting noise
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

    // Wrap around canvas boundaries
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

    if (this.depth > 0.7) {
      drawingContext.globalCompositeOperation = 'lighter';
    }

    fill(this.c);
    ellipse(0, 0, this.r);

    // Outer glow rings
    let glowSize = this.r * 1.5;
    for (let i = 0; i < 3; i++) {
      fill(red(this.c), green(this.c), blue(this.c), this.alpha * 0.3 / (i+1));
      ellipse(0, 0, glowSize * (0.7 + i * 0.3));
    }

    // Inner textures (soft ripples)
    noFill();
    stroke(255, this.alpha * 0.5);
    strokeWeight(0.5);
    for (let i = 0; i < 5; i++) {
      ellipse(0, 0, this.r * (0.3 + i * 0.1));
    }

    pop();
  }
}


// ☀️ Radiant: Rotating rays with pulsation and variation
class Radiant {
  constructor() {
    /**
     * Each radiant has a center, rotation, and pulsing rays.
     */
    this.x = random(width);
    this.y = random(height);
    this.r = random(15, 50);     // Inner radius
    this.n = int(random(20, 100)); // Number of lines
    this.alpha = random(40, 120);  // Transparency

    this.angle = random(TWO_PI);     // Current rotation
    this.rotSpeed = random(0.001, 0.02); // Rotation speed

    this.lineLength = random(15, 40); // Ray length
    this.depth = random(1);           // Depth affects opacity/size
    this.pulseSpeed = random(0.01, 0.03); // Pulsing speed
    this.pulsePhase = random(TWO_PI);    // Pulsing phase offset
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

    // Center glow
    fill(255, 240, 180, strokeAlpha * 0.5);
    noStroke();
    ellipse(0, 0, this.r * 0.5);
    pop();
  }
}

// ⚫️ Hole: Simulates a dark void or tunnel with depth
class Hole {
  constructor() {
    /**
     * Define circular hole with outer black ring and inner colored core.
     */
    this.x = random(width);
    this.y = random(height);
    this.r = random(5, 10);        // Outer radius
    this.depth = random(1);        // Unused but can be used for z-order
    this.innerR = this.r * random(0.3, 0.7); // Inner core radius

    this.innerColor = color(
      20 + random(-10, 10),
      10 + random(-5, 5),
      30 + random(-10, 10)
    );
  }

  show() {
    /**
     * Draw outer black circle, inner color core, and a highlight spot.
     */
    push();
    translate(this.x, this.y);

    noStroke();
    fill(0); // Outer dark ring
    ellipse(0, 0, this.r * 2);

    fill(this.innerColor); // Inner colored core
    ellipse(0, 0, this.innerR * 2);

    fill(60, 50, 80, 100); // Subtle highlight
    ellipse(this.r * 0.2, -this.r * 0.2, this.r * 0.3);

    pop();
  }
}

// ✨ Spark: Glowing drifting particles with lifecycle and variety
class Spark {
  constructor() {
    /**
     * When created, immediately call reset to initialize position and attributes.
     */
    this.reset();
    this.life = random(100, 500); // Total lifespan in frames
    this.age = random(this.life); // Start at a random point in life
    this.type = random() > 0.7 ? "line" : "dot"; // Choose visual type
  }

  reset() {
    /**
     * Reinitialize particle when it dies or leaves the screen.
     */
    this.x = random(width);
    this.y = random(height);
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

    if (this.age > this.life || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
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
      stroke(
        255 - this.colorVariation,
        215 - this.colorVariation * 0.5,
        130 + this.colorVariation * 0.3,
        alpha
      );
      strokeWeight(this.size * 0.5);
      line(this.x, this.y, this.x + cos(angle) * len, this.y + sin(angle) * len);
    } else {
      noStroke();
      fill(255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3, alpha);
      ellipse(this.x, this.y, this.size);

      // Glow effect
      fill(255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3, alpha * 0.3);
      ellipse(this.x, this.y, this.size * 3);
    }
  }
}
