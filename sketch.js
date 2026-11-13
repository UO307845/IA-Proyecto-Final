let video;
let handPose;
let detector;

function preload() {
  handPose = ml5.handPose({ maxHands: 1 });
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
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  
  detector.procesar();
}