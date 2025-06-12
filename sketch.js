let blobs = [];

let holes = [];
let bgTexture;

function setup() {
  createCanvas(900, 900);
  background(0);
  noStroke();
  

  bgTexture = createGraphics(width, height);
  createTexture(bgTexture);

  for (let i = 0; i < 60; i++) {
    blobs.push(new NoiseBlob());
  }



  for (let i = 0; i < 20; i++) {
    holes.push(new Hole());
  }
}

function draw() {
  
  image(bgTexture, 0, 0);
  

  fill(0, 25);
  rect(0, 0, width, height);


  for (let h of holes) h.show();
  for (let b of blobs) {
    b.update();
    b.show();
  }
  for (let r of radiants) {
    r.update();
    r.show();
  }
}


function createTexture(g) {
  g.background(0);
  g.noStroke();
  

  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(0.5, 2);
    let a = random(5, 15);
    g.fill(30, 20, 40, a);
    g.ellipse(x, y, s);
  }
  

  g.stroke(40, 30, 50, 10);
  for (let i = 0; i < 50; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-100, 100);
    g.line(x1, y1, x2, y2);
  }
}


class NoiseBlob {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.rBase = random(0, 120); 
    this.alpha = random(30, 120);
    this.phase = random(TWO_PI);
    this.speed = random(0.003, 0.01);
    this.c = color(
      255 + random(-30, 0), 
      180 + random(-30, 30), 
      120 + random(-50, 50), 
      this.alpha
    );
    this.depth = random(1);
    this.noiseScale = random(0.005, 0.02);
  }

  update() {
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
    push();
    translate(this.x, this.y);

    fill(this.c);
    ellipse(0, 0, this.r);
    
    pop();
  }
}


class Radiant {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(40, 120);
    this.thickness = random(5, 15);
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.01, 0.01);
    this.depth = random(1);
    this.goldColor = color(
      255,
      215 + random(-20, 20),
      0
    );
    this.pulseSpeed = random(0.01, 0.03);
    this.pulsePhase = random(TWO_PI);
  }

  update() {
    this.rotation += this.rotSpeed * map(this.depth, 0, 1, 0.8, 1.2);
    this.pulsePhase += this.pulseSpeed;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
  
    let pulseFactor = 1 + sin(this.pulsePhase) * 0.1;

    noFill();
    stroke(this.goldColor);
    strokeWeight(this.thickness);
    ellipse(0, 0, this.r * pulseFactor);

    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let x1 = cos(angle) * (this.r/2 - this.thickness/2);
      let y1 = sin(angle) * (this.r/2 - this.thickness/2);
      let x2 = cos(angle) * (this.r/2 + this.thickness);
      let y2 = sin(angle) * (this.r/2 + this.thickness);
      
      stroke(255, 223, 0);
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }
    

    fill(this.goldColor);
    noStroke();
    ellipse(0, 0, this.thickness * 0.8);
    
    pop();
  }
}


class Hole {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(5, 10); 
    this.depth = random(1);
    this.innerR = this.r * random(0.3, 0.7);
    this.innerColor = color(
      20 + random(-10, 10),
      10 + random(-5, 5),
      30 + random(-10, 10)
    );
  }

  show() {
    push();
    translate(this.x, this.y);
    
    noStroke();
    fill(0);
    ellipse(0, 0, this.r * 2);
    
    fill(this.innerColor);
    ellipse(0, 0, this.innerR * 2);
    
    fill(60, 50, 80, 100);
    ellipse(
      this.r * 0.2, 
      -this.r * 0.2, 
      this.r * 0.3
    );
    
    pop();
  }
}