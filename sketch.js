let x, y;
let speed;
let objx, objy;
let mario, mario_right, mario_left;
let coin;
let bkg;
let score;
let sound;

function preload() {
  mario_right = loadImage('mario_right.png');
  mario_left = loadImage('mario_left.png');
  coin = loadImage('coin.png');
  bkg = loadImage('background.png');
  sound = loadSound('smw_coin.wav');
}

function setup() {
  createCanvas(800, 800);
  x = width / 2;
  y = 800 - 210;
  speed = 15;
  objy = 0;
  objx = random(width);
  score = 0;
  mario = mario_right;
}

function draw() {
  background(bkg);
  
  if(keyIsDown(LEFT_ARROW)) {
    x = x - speed;
    mario = mario_left;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    x = x + speed;
    mario = mario_right;
  }
  image(mario, x,y)
  
  objy = objy + 6;
  image(coin, objx, objy)
  
  let d = dist(objx, objy, x, y);
  if(d<60) {
    objy=0;
    objx=random(width);
    score = score + 1;
    sound.play();
  }
  
  textSize(24);
  textAlign(LEFT, CENTER);
  text('Score: '+score, 40, 40)
  
  if(objy>height) {
    textSize(100);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width/2, height/2);
  }
}
