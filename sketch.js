// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // Initial X position of the circle
let circleY = 240; // Initial Y position of the circle
const circleRadius = 50; // Radius of the circle

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

  // Draw the circle
  fill('#3a86ff');
  noStroke();
  ellipse(circleX, circleY, circleRadius * 2);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the position of the index finger tip (keypoint 8)
        let indexFinger = hand.keypoints[8];

        // Check if the index finger is touching the circle
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleRadius) {
          // Move the circle to the index finger's position
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }

        // Draw lines connecting specific keypoints
        connectKeypoints(hand.keypoints, [0, 1, 2, 3, 4]);  // Thumb
        connectKeypoints(hand.keypoints, [5, 6, 7, 8]);     // Index finger
        connectKeypoints(hand.keypoints, [9, 10, 11, 12]);  // Middle finger
        connectKeypoints(hand.keypoints, [13, 14, 15, 16]); // Ring finger
        connectKeypoints(hand.keypoints, [17, 18, 19, 20]); // Pinky
      }
    }
  }
}

// Helper function to connect keypoints with lines
function connectKeypoints(keypoints, indices) {
  beginShape();
  noFill();
  for (let i of indices) {
    let point = keypoints[i];
    vertex(point.x, point.y);
  }
  endShape();
}
