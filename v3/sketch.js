let mario, mario_right, mario_left, mario_x, mario_y, mario_speed;
let coin, coin_x, coin_y, coin_speed, coin_sound;
let bkg, bkg_level_1;
let score;
let game_over_sound;
let game_status;
let level;
let title, title_start_time;

function preload() {
  bkg_level_1 = loadImage('assets/background1.png');
  mario_right = loadImage('assets/mario_right.png');
  mario_left = loadImage('assets/mario_left.png');
  coin = loadImage('assets/coin.png');
  coin_sound = loadSound('assets/smb_coin.wav');
  game_over_sound = loadSound('assets/smb_gameover.wav');
}

function setup() {
  console.log(bkg_level_1)
  this.focus();
  if(displayWidth>800 && displayHeight>800) {
    createCanvas(800, 800);  
  } else {
    createCanvas(displayWidth, displayHeight);
  }
  
  level = 1;
  setTitle('LEVEL 1'); 
  setBackground(bkg_level_1);

  mario_x = width / 2;
  mario_y = 800 - 210;
  mario_speed = 10;
  mario = mario_right;
  
  coin_y = 0;
  coin_x = random(width);
  coin_speed = 6;
  score = 0;
}

function draw() {
  background(bkg);
  printTitle();
  
  moveMario();
  moveCoin();
  
  let d = dist(coin_x, coin_y, mario_x, mario_y);
  if(d<60) {
    gotCoin();
    if (score==20) setupLevel2();
    if (score==30) setupLevel3();
  }
  
  updateScore();
  checkGameOver();
}

function updateScore() {
  image(coin, 30, 30);
  textSize(24);
  textAlign(LEFT, CENTER);
  text(score, 70, 52);
  //+' '+displayWidth+' '+displayHeight+' '+displayDensity()+' '+bkg.width+'-'+bkg.height, 40, 40)
}

function checkGameOver() {
  if(coin_y>height) {
    printText('GAME OVER');
    if(game_status=='play') {
      game_over_sound.play();
      game_status = 'game_over';
    }
  }
}

function gotCoin() {
  coin_y=0;
  coin_x=random(width);
  score = score + 1;
  coin_sound.play();
}

function setupLevel2() {
  level = 2;
  setTitle('LEVEL 2');
  mario_speed = 15;
  coin_speed = 10;
}

function setupLevel3() {
  level = 3;
  setTitle('LEVEL 3');
  mario_speed = 25;
  coin_speed = 15;
}

function moveMario() {
  if(keyIsDown(LEFT_ARROW)) {
    mario_x = mario_x - mario_speed;
    mario = mario_left;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    mario_x = mario_x + mario_speed;
    mario = mario_right;
  }
  image(mario, mario_x, mario_y);
}

function moveCoin() {
  if(game_status=='play') {
    coin_y = coin_y + coin_speed;
    image(coin, coin_x, coin_y);
  }
}

function setTitle(msg) {
  title = msg;
  title_start_time = millis();
  game_status='title';
}

function printTitle() {
  if(game_status=='title') {
    if(millis()<title_start_time+2000) {
      printText(title);
    } else {
      game_status='play';
    }
  }
}

function printText(txt) {
  textSize(100);
  textAlign(CENTER, CENTER);
  text(txt, width/2, height/2);
}

function setBackground(b) {
  bkg = b;
  bkg.resize(displayWidth, 0);
}
