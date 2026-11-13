let video;
let handPose;
let detector;
let drawer;

function preload() {
  handPose = ml5.handPose({ maxHands: 1 });
  drawer = new HandDrawer(640, 480);
  drawer.preload();
}


function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  detector = new DeteccionManos();
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
  drawer.draw();
}
