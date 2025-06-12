let blobs = [];
let radiants = [];
let holes = [];


function setup() {
  createCanvas(900, 900);
  background(0);
  noStroke();

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
  background(0, 20); 

  for (let b of blobs) b.update();
  for (let r of radiants) r.update();
  

  for (let b of blobs) b.show();
  for (let r of radiants) r.show();
  for (let h of holes) h.show();
  
}


class NoiseBlob {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.rBase = random(40, 120);
    this.alpha = random(30, 90);
    this.phase = random(TWO_PI);
    this.speed = random(0.005, 0.01);
    this.c = color(255, 215, 100, this.alpha);
  }

  update() {
    this.phase += this.speed;
    this.r = this.rBase + sin(this.phase) * 10; // 呼吸式波动
  }

  show() {
    noStroke();
    fill(this.c);
    ellipse(this.x, this.y, this.r);
  }
}


class Radiant {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(10, 40);
    this.n = int(random(30, 80));
    this.alpha = random(40, 100);
    this.angle = random(TWO_PI);
    this.rotSpeed = random(0.002, 0.01);
  }

  update() {
    this.angle += this.rotSpeed;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(255, 240, 180, this.alpha);
    strokeWeight(0.5);
    for (let i = 0; i < this.n; i++) {
      let a = TWO_PI * i / this.n;
      let x1 = cos(a) * this.r;
      let y1 = sin(a) * this.r;
      let x2 = cos(a) * (this.r + 20);
      let y2 = sin(a) * (this.r + 20);
      line(x1, y1, x2, y2);
    }
    pop();
  }
}


class Hole {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(4, 15);
  }

  show() {
    noStroke();
    fill(0);
    ellipse(this.x, this.y, this.r);
  }
}
