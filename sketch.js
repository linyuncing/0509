// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // Initial X position of the circle
let circleY = 240; // Initial Y position of the circle
const circleRadius = 50; // Radius of the circle

let isDragging = false; // Flag to track if the circle is being dragged
let previousX, previousY; // Previous position of the circle

let isDraggingThumb = false; // Flag to track if the circle is being dragged by the thumb
let previousThumbX, previousThumbY; // Previous position of the circle when dragged by the thumb

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

  // Initialize previous positions
  previousX = circleX;
  previousY = circleY;
  previousThumbX = circleX;
  previousThumbY = circleY;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill('#3a86ff');
  noStroke();
  ellipse(circleX, circleY, circleRadius * 2);

  // Draw the trajectory if the circle is being dragged by the index finger
  if (isDragging) {
    stroke('#90e0ef');
    strokeWeight(2);
    line(previousX, previousY, circleX, circleY);
    previousX = circleX;
    previousY = circleY;
  }

  // Draw the trajectory if the circle is being dragged by the thumb
  if (isDraggingThumb) {
    stroke('#a2d2ff');
    strokeWeight(2);
    line(previousThumbX, previousThumbY, circleX, circleY);
    previousThumbX = circleX;
    previousThumbY = circleY;
  }

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    isDragging = false; // Reset dragging flag for index finger
    isDraggingThumb = false; // Reset dragging flag for thumb
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the positions of the index finger tip (keypoint 8) and thumb tip (keypoint 4)
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        // Check if both the index finger and thumb are touching the circle's edge
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleRadius) {
          // Move the circle to the index finger's position
          circleX = indexFinger.x;
          circleY = indexFinger.y;
          isDragging = true; // Set dragging flag for index finger
        }

        if (dThumb < circleRadius) {
          // Move the circle to the thumb's position
          circleX = thumb.x;
          circleY = thumb.y;
          isDraggingThumb = true; // Set dragging flag for thumb
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
