// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw lines connecting specific keypoints
        drawKeypointLines(hand.keypoints, [0, 1, 2, 3, 4]);  // Thumb
        drawKeypointLines(hand.keypoints, [5, 6, 7, 8]);     // Index finger
        drawKeypointLines(hand.keypoints, [9, 10, 11, 12]);  // Middle finger
        drawKeypointLines(hand.keypoints, [13, 14, 15, 16]); // Ring finger
        drawKeypointLines(hand.keypoints, [17, 18, 19, 20]); // Pinky
      }
    }
  }
}

// Helper function to draw lines between keypoints
function drawKeypointLines(keypoints, indices) {
  for (let i = 0; i < indices.length - 1; i++) {
    let start = keypoints[indices[i]];
    let end = keypoints[indices[i + 1]];
    stroke(0, 255, 0); // Green color for lines
    strokeWeight(2);
    line(start.x, start.y, end.x, end.y);
  }
}
