class HandDrawer {
  constructor(width = 600, height = 480) {
    this.w = width;
    this.h = height;
    this.video = null;
    this.handPose = null;
    this.hands = [];
    this.canvasGraphics = null;
    this.px = -1;
    this.py = -1;
  }

  preload() {
    this.handPose = ml5.handPose();
  }

  
  setup() {
    createCanvas(this.w, this.h);
    frameRate(60);

    this.canvasGraphics = createGraphics(this.w, this.h);

    this.video = createCapture({
      video: {
        width: { ideal: this.w },
        height: { ideal: this.h },
        frameRate: { max: 60 }
          
      }

    });
    this.video.size(this.w, this.h);
    this.video.elt.muted = true;
    this.video.hide();

    this.handPose.detectStart(this.video, (results) => this.gotHands(results));
  }

  gotHands(results) {
    this.hands = results;
  }

  draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(this.video, 0, 0, width, height);
    pop();

    image(this.canvasGraphics, 0, 0);

    if (this.hands.length > 0) {
      let hand = this.hands[0];
      let wrist = hand.keypoints[0];
      let refDist = dist(hand.keypoints[9].x, hand.keypoints[9].y, wrist.x, wrist.y);

      let fingers = [8, 12, 16, 20];
      let isFist = fingers.every(i => dist(hand.keypoints[i].x,
            hand.keypoints[i].y, wrist.x, wrist.y) < refDist * 1.3);

      if (isFist) {
        this.px = -1;
        this.py = -1;

        fill(0, 0, 0);
        rect(220, 25, 210, 40, 20);
        fill(255);
        textSize(22);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text("Puño cerrado", width / 2, 45);

      } else {
        // Dibujar con el índice
        let indexFinger = hand.keypoints[8];
        let x = width - indexFinger.x;
        let y = indexFinger.y;

        if (this.px !== -1 && this.py !== -1) {
          this.canvasGraphics.stroke(0, 0, 0);
          this.canvasGraphics.strokeWeight(20);
          
          this.canvasGraphics.line(this.px, this.py, x, y);
        }

        this.px = x;
        this.py = y;

        fill(255, 255, 255);
        noStroke();
        circle(x, y, 10);
      }
    } else {
      this.px = -1;
      this.py = -1;
    }
  }

  clearCanvas() {
    this.canvasGraphics.clear();
  }
}

let drawer;

function preload() {
  drawer = new HandDrawer(640, 480);
  drawer.preload();
}

function setup() {
  drawer.setup();
}

function draw() {
  drawer.draw();
}

function keyPressed() {
  if (key === ' ') {
    drawer.clearCanvas();
  }
}