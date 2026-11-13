let video;
let handPose;
let detector;
let drawer;
let interfaz;

function preload() {
  handPose = ml5.handPose({ maxHands: 1 });
}

function setup() {
  createCanvas(640, 480);

  video = createCapture({
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      frameRate: { max: 60 }
    },
    audio: false
  });
  video.size(640, 480);
  video.elt.muted = true;
  video.hide();

  detector = new DeteccionManos();
  interfaz = new HandInterface();
    drawer = new HandDrawer(640, 480);
  
  handPose.detectStart(video, (results) => detector.gotHands(results));

  strokeWeight(4);
  textSize(28);
  textAlign(CENTER, CENTER);

  drawer.setup();
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  
  detector.procesar();

  if (detector.hands) {
    interfaz.setHands(detector.hands);
    
    if (typeof drawer.updateHands === 'function') {
      drawer.updateHands(detector.hands);
    }
  }

  interfaz.draw();
  drawer.draw();
}

function keyPressed() {
  if (key === ' ') {
    drawer.clearCanvas();
  }
}
