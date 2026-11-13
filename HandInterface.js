class HandInterface {

  constructor() {
    this.hands = [];
    
    this.fingers = [
      "thumb",
      "index_finger",
      "middle_finger",
      "ring_finger",
      "pinky_finger"
    ];

    this.fingerParts = [
      "_mcp",
      "_pip",
      "_dip",
      "_tip"
    ];

    this.squareSize = 300;
    this.btnW = 120;
    this.btnH = 60;
    this.btnMargin = 15;

    this.btnX =
      width / 2 +
      this.squareSize / 2 -
      this.btnMargin -
      this.btnW;

    this.btnY =
      height / 2 +
      this.squareSize / 2 -
      this.btnMargin -
      this.btnH;

    this.squareColor = color(0, 120, 255);
    this.wasPressed = false;
  }

  setHands(hands) {
    this.hands = hands;
  }

  draw() {

    this.drawUI();

    if (this.hands.length > 0) {
      this.drawHands();
      this.checkPress();
    }
  }

  drawUI() {

    noStroke();

    rectMode(CENTER);

    fill(
      red(this.squareColor),
      green(this.squareColor),
      blue(this.squareColor),
      80
    );

    rect(
      width / 2,
      height / 2,
      this.squareSize,
      this.squareSize
    );

    rectMode(CORNER);

    if (this.wasPressed) {
      fill(150);
    } else {
      fill(255);
    }

    stroke(0);
    strokeWeight(3);

    rect(
      this.btnX,
      this.btnY,
      this.btnW,
      this.btnH
    );
  }

  isInsideButton(point) {

    return (
      point.x > this.btnX &&
      point.x < this.btnX + this.btnW &&
      point.y > this.btnY &&
      point.y < this.btnY + this.btnH
    );
  }

  isExtended(hand, finger) {

    let tip = hand[finger + "_tip"];
    let pip = hand[finger + "_pip"];

    return (
      dist(
        tip.x,
        tip.y,
        hand.wrist.x,
        hand.wrist.y
      ) >
      dist(
        pip.x,
        pip.y,
        hand.wrist.x,
        hand.wrist.y
      )
    );
  }

  isThumbExtended(hand) {

    let ref = hand.pinky_finger_mcp;

    return (
      dist(
        hand.thumb_tip.x,
        hand.thumb_tip.y,
        ref.x,
        ref.y
      ) >
      dist(
        hand.thumb_mcp.x,
        hand.thumb_mcp.y,
        ref.x,
        ref.y
      ) * 1.2
    );
  }

  checkPress() {

    let pressed = false;

    for (let hand of this.hands) {

      let onlyTwoUp =

        this.isExtended(hand, "index_finger") &&
        this.isExtended(hand, "middle_finger") &&

        !this.isExtended(hand, "ring_finger") &&
        !this.isExtended(hand, "pinky_finger") &&

        !this.isThumbExtended(hand);

      if (
        onlyTwoUp &&
        this.isInsideButton(hand.index_finger_tip) &&
        this.isInsideButton(hand.middle_finger_tip)
      ) {

        pressed = true;
      }
    }

    if (pressed && !this.wasPressed) {

      this.squareColor = color(
        random(255),
        random(255),
        random(255)
      );

      console.log("Botón pulsado");
    }

    this.wasPressed = pressed;
  }

  drawHands() {

    stroke(0);
    strokeWeight(5);

    for (let hand of this.hands) {

      for (let finger of this.fingers) {

        let localParts = [];

        for (let part of this.fingerParts) {

          let point = hand[finger + part];

          if (point) {
            localParts.push(point);
          }
        }

        if (localParts.length === 4) {

          for (let i = 0; i < 3; i++) {

            line(
              localParts[i].x,
              localParts[i].y,
              localParts[i + 1].x,
              localParts[i + 1].y
            );
          }
        }
      }
    }
  }
}
