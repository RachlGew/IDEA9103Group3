let blobs = [];
let radiants = [];
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

  for (let i = 0; i < 25; i++) {
    radiants.push(new Radiant());
  }

  for (let i = 0; i < 20; i++) {
    holes.push(new Hole());
  }

}

function draw() {
  // 显示背景纹理
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
    

    if (this.depth > 0.7) {
      drawingContext.globalCompositeOperation = 'lighter';
    }
    

    fill(this.c);
    ellipse(0, 0, this.r);
    
  
    let glowSize = this.r * 1.5;
    for (let i = 0; i < 3; i++) {
      fill(red(this.c), green(this.c), blue(this.c), this.alpha * 0.3 / (i+1));
      ellipse(0, 0, glowSize * (0.7 + i * 0.3));
    }
    
  
    noFill();
    stroke(255, this.alpha * 0.5);
    strokeWeight(0.5);
    for (let i = 0; i < 5; i++) {
      let r = this.r * (0.3 + i * 0.1);
      ellipse(0, 0, r);
    }
    
    pop();
  }
}


class Radiant {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(15, 50); 
    this.n = int(random(20, 100));
    this.alpha = random(40, 120);
    this.angle = random(TWO_PI);
    this.rotSpeed = random(0.001, 0.02);
    this.lineLength = random(15, 40);
    this.depth = random(1);
    this.pulseSpeed = random(0.01, 0.03);
    this.pulsePhase = random(TWO_PI);
  }

  update() {
    this.angle += this.rotSpeed * map(this.depth, 0, 1, 0.8, 1.2);
    this.pulsePhase += this.pulseSpeed;
    this.currentLength = this.lineLength * (0.8 + sin(this.pulsePhase) * 0.2);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    
    let strokeAlpha = this.alpha * map(this.depth, 0, 1, 0.7, 1);
    stroke(255, 240, 180, strokeAlpha);
    strokeWeight(map(this.depth, 0, 1, 0.3, 0.8));
    
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
    
    
    fill(255, 240, 180, strokeAlpha * 0.5);
    noStroke();
    ellipse(0, 0, this.r * 0.5);
    
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


