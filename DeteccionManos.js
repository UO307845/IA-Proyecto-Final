class DeteccionManos {
  constructor() {
    this.hands = [];
    this.gestoActual = "";
    this.gestoCandidato = "";
    this.tiempoInicio = 0;
  }

  gotHands(results) {
    this.hands = results;
  }

  procesar() {
    if (this.hands.length > 0) {
      this.drawHand(this.hands[0]);
      this.reconocerGestos(this.hands[0]);
    } else {
      this.gestoActual = "";
      this.gestoCandidato = "";
    }
  }

  drawHand(hand) {
    if (hand.keypoints) {
      fill(255, 100, 100);
      noStroke();
      for (let keypoint of hand.keypoints) {
        if (keypoint) {
          circle(keypoint.x, keypoint.y, 8);
        }
      }
    }
  }

  reconocerGestos(hand) {
    if (!hand || !hand.keypoints || hand.keypoints.length < 21) return;

    let wrist = hand.keypoints[0];

    let indexTip = hand.keypoints[8];
    let indexBase = hand.keypoints[6];
    let indexExtended = dist(indexTip.x, indexTip.y, wrist.x, wrist.y) > dist(indexBase.x, indexBase.y, wrist.x, wrist.y) * 1.2;

    let middleTip = hand.keypoints[12];
    let middleBase = hand.keypoints[10];
    let middleExtended = dist(middleTip.x, middleTip.y, wrist.x, wrist.y) > dist(middleBase.x, middleBase.y, wrist.x, wrist.y) * 1.2;

    let ringTip = hand.keypoints[16];
    let ringBase = hand.keypoints[14];
    let ringExtended = dist(ringTip.x, ringTip.y, wrist.x, wrist.y) > dist(ringBase.x, ringBase.y, wrist.x, wrist.y) * 1.2;

    let pinkyTip = hand.keypoints[20];
    let pinkyBase = hand.keypoints[18];
    let pinkyExtended = dist(pinkyTip.x, pinkyTip.y, wrist.x, wrist.y) > dist(pinkyBase.x, pinkyBase.y, wrist.x, wrist.y) * 1.2;

    let dedos = [
      { nombre: "Índice", extendido: indexExtended },
      { nombre: "Medio", extendido: middleExtended },
      { nombre: "Anular", extendido: ringExtended },
      { nombre: "Meñique", extendido: pinkyExtended }
    ];

    let extendidosCount = dedos.filter(d => d.extendido).length;
    let textoCandidato = "";

    if (extendidosCount === 0) {
      textoCandidato = "Puño cerrado";
    } 
    else if (extendidosCount === 4) {
      textoCandidato = "Mano abierta";
    } 
    else if (extendidosCount === 1) {
      let dedoUnico = dedos.find(d => d.extendido);
      textoCandidato = `Dedo levantado: ${dedoUnico.nombre}`;
    } 
    else {
      textoCandidato = "Gesto no identificado";
    }

    if (textoCandidato !== this.gestoCandidato) {
      this.gestoCandidato = textoCandidato;
      this.tiempoInicio = millis();
    }

    if (millis() - this.tiempoInicio >= 250) {
      this.gestoActual = this.gestoCandidato;
    }

    if (this.gestoActual !== "") {
      fill(0, 255, 0);
      noStroke();
      text(this.gestoActual, width / 2, 50);
    }
  }
}
