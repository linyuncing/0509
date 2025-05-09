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
        // Get the positions of the index finger tip (keypoint 8) and thumb tip (keypoint 4)
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        // Check if both the index finger and thumb are touching the circle's edge
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleRadius && dThumb < circleRadius) {
          // Move the circle to the midpoint between the index finger and thumb
          circleX = (indexFinger.x + thumb.x) / 2;
          circleY = (indexFinger.y + thumb.y) / 2;
        }

        // Determine hand color based on handedness
        let handColor = hand.handedness === 'Left' ? '#8338ec' : '#ff006e';

        // Draw lines connecting specific keypoints
        connectKeypoints(hand.keypoints, [0, 1, 2, 3, 4], handColor);  // Thumb
        connectKeypoints(hand.keypoints, [5, 6, 7, 8], handColor);     // Index finger
        connectKeypoints(hand.keypoints, [9, 10, 11, 12], handColor);  // Middle finger
        connectKeypoints(hand.keypoints, [13, 14, 15, 16], handColor); // Ring finger
        connectKeypoints(hand.keypoints, [17, 18, 19, 20], handColor); // Pinky
      }
    }
  }
}

// Helper function to connect keypoints with lines
function connectKeypoints(keypoints, indices, color) {
  stroke(color);       // Set the stroke color
  strokeWeight(5);     // Set the stroke weight to 5
  noFill();
  for (let i = 0; i < indices.length - 1; i++) {
    let start = keypoints[indices[i]];
    let end = keypoints[indices[i + 1]];
    line(start.x, start.y, end.x, end.y);
  }
}
