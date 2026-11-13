class HandDrawer {
  constructor(video, width = 640, height = 480) {
    this.w = width;
    this.h = height;
    this.video = video; // Recibe el video desde el sketch principal
    this.canvasGraphics = null;
    this.px = -1;
    this.py = -1;
    this.hands = [];
  }

  setup() {
    // Creamos el lienzo gráfico donde se dibuja el trazo
    this.canvasGraphics = createGraphics(this.w, this.h);
  }

  // Método para actualizar las manos detectadas
  updateHands(results) {
    this.hands = results;
  }

  draw() {
    // Dibujar el trazo acumulado
    image(this.canvasGraphics, 0, 0);

    if (this.hands.length > 0) {
      let hand = this.hands[0];
      let wrist = hand.keypoints[0];
      let refDist = dist(hand.keypoints[9].x, hand.keypoints[9].y, wrist.x, wrist.y);

      let fingers = [8, 12, 16, 20];
      let isFist = fingers.every(i => dist(
        hand.keypoints[i].x,
        hand.keypoints[i].y,
        wrist.x, wrist.y
      ) < refDist * 1.3);

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
        // Dibujar con el índice (ajustando la coordenada por el espejo del video)
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
