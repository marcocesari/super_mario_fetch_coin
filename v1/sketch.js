let characterX, characterY; // Character's position
let characterSize = 50; // Character's size
let objectX, objectY; // Falling object's position
let objectSize = 30; // Falling object's size
let speedY; // Vertical speed of the falling object
let score = 0; // Player's score

function preload() {
  // Load the character image
  character = loadImage('mario100.png');
  obj = loadImage('coin80.png');
  backgroundImage = loadImage('background.png');
}

function setup() {
  createCanvas(400, 400);
  characterX = width / 2;
  characterY = height - 50;
  objectX = random(width);
  objectY = 0;
  speedY = random(5, 10);
}

function draw() {
  background(220);
  //background(backgroundImage);

  // Move the character with keyboard input
  if (keyIsDown(LEFT_ARROW)) {
    characterX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    characterX += 5;
  }

  // Draw and update the character
  fill(255, 0, 0); // Red color for the character
  ellipse(characterX, characterY, characterSize, characterSize);
  // Draw the character image
  //image(character, characterX - character.width / 2, characterY - character.height / 2-60);


  // Draw and update the falling object
  fill(0, 0, 255); // Blue color for the falling object
  ellipse(objectX, objectY, objectSize, objectSize);
  //image(obj, objectX, objectY, objectSize, objectSize);


  // Update the position of the falling object
  objectY += speedY;
  //if (objectY>=height) gameOver();

  // Check for collision between character and object
  let d = dist(characterX, characterY, objectX, objectY);
  if (d < characterSize / 2 + objectSize / 2) {
    // Collision detected, increase the score and reset the object
    score++;
    objectX = random(width);
    objectY = 0;
    speedY = random(2, 5);
  }

  // Display the player's score
  textSize(24);
  textAlign(LEFT, CENTER)
  fill(0);
  text("Score: " + score, 20, 30);
}

function gameOver() {
  textSize(100);
  textAlign(CENTER, CENTER)
  fill(0);
  text("GAME OVER", width/2, height/2)
}
