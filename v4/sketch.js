let gravity, ground_y, jump_power;
let player, player_right, player_left, player_x, player_y, player_speed_x, player_speed_y, player_ai;
let mario_right, mario_left;
let luigi_right, luigi_left;
let goomba, goomba_right, goomba_left, goomba_x, goomba_y, goomba_start_time, goomba_speed_x;
let coin, coin_x, coin_y, coin_speed, coin_sound;
let bkg, bkg_landscape, bkg_underwater;
let score;
let game_over_sound;
let game_status;
let level;
let title, title_start_time;
let jump_sound;

function preload() {
    bkg_landscape = loadImage('assets/background1.png');
    bkg_underwater = loadImage('assets/underwater.png');
    mario_right = loadImage('assets/mario_right.png');
    mario_left = loadImage('assets/mario_left.png');
    luigi_right = loadImage('assets/luigi_right.png');
    luigi_left = loadImage('assets/luigi_left.png');
    coin = loadImage('assets/coin.png');
    coin_sound = loadSound('assets/smb_coin.wav');
    game_over_sound = loadSound('assets/smb_gameover.wav');
    goomba_right = loadImage('assets/goomba_right.png');
    goomba_left = loadImage('assets/goomba_left.png');
    jump_sound = loadSound('assets/jump_sound.mp3');
}

function setup() {
    this.focus();
    createCanvas(800, 800);

    level = 1;
    setTitle('LEVEL 1');
    bkg = bkg_landscape;

    gravity = 1;
    jump_power = 20;

    player_right = mario_right;
    player_left = mario_left;
    player = player_right;

    ground_y = 800 - 104;
    player_x = width / 2 - player.width / 2;
    player_y = ground_y - player.height * 2;
    player_speed_x = 10;
    player_speed_y = 0;
    player_ai = false;

    coin_y = 0;
    coin_x = random(width);
    coin_speed = 6;

    score = 0;

    goomba = goomba_left;
    goomba_start_time = millis();
    goomba_speed_x = 5;
    goomba_x = 250;
    goomba_y = height - goomba.height - 104;
}

function draw() {
    background(bkg);

    printTitle();

    moveGoomba();
    movePlayer();
    moveCoin();

    let d = dist(coin_x, coin_y, player_x, player_y - player.height);
    if (d < 60) {
        gotCoin();
        if (score == 5) setupLevel2();
        if (score == 10) setupLevel3();
    }

    updateScore();

    checkGameOver();
}

function updateScore() {
    image(coin, 30, 30);
    textSize(24);
    textAlign(LEFT, CENTER);
    text(score, 70, 52);
}

function checkGameOver() {
    if (coin_y > height) {
        printText('GAME OVER');
        if (game_status == 'play') {
            game_over_sound.play();
            game_status = 'game_over';
        }
    }
}

function gotCoin() {
    coin_y = 0;
    coin_x = random(width);
    score = score + 1;
    coin_sound.play();
}

function setupLevel2() {
    level = 2;
    setTitle('LEVEL 2');
    player_speed_x = 15;
    coin_speed = 10;
}

function setupLevel3() {
    level = 3;
    setTitle('LEVEL 3');
    player_speed_x = 25;
    coin_speed = 15;
    bkg = bkg_underwater;
}

function moveRight() {
    player_x = player_x + player_speed_x;
    player = player_right;
}

function moveLeft() {
    player_x = player_x - player_speed_x;
    player = player_left;
}

function movePlayer() {
    if (keyIsDown(LEFT_ARROW)) {
        moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        moveRight();
    }
    if (player_ai === true && Math.abs(player_x - coin_x) > player_speed_x) {
        if (player_x < coin_x) {
            moveRight();
        } else {
            moveLeft();
        }
    }
    player_y = player_y + player_speed_y;
    if (player_y < ground_y) {
        // in the air
        player_speed_y += gravity;
    } else {
        player_speed_y = 0;
        player_y = ground_y;
    }
    image(player, player_x, player_y - player.height);
}

function moveGoomba() {
    animateGoomba();
    if (goomba_x <= 0 || goomba_x + goomba.width >= width) {
        goomba_speed_x = -1 * goomba_speed_x;
    }
    goomba_x = goomba_x + goomba_speed_x;
    image(goomba, goomba_x, goomba_y);
}

function animateGoomba() {
    if (millis() > goomba_start_time + 200) {
        goomba_start_time = millis();
        if (goomba === goomba_left) {
            goomba = goomba_right;
        } else {
            goomba = goomba_left;
        }
    }
}

function keyPressed() {
    if (key.toLowerCase() === 'm') {
        player_right = mario_right;
        player_left = mario_left;
    }
    if (key.toLowerCase() === 'l') {
        player_right = luigi_right;
        player_left = luigi_left;
    }
    if (key.toLowerCase() === 'a') {
        player_ai = !player_ai;
    }
    if (keyCode === UP_ARROW) {
        if (player_y >= ground_y) {
            // on the ground
            player_speed_y = -jump_power;
            jump_sound.play();
        }
    }
}

function moveCoin() {
    if (game_status == 'play') {
        coin_y = coin_y + coin_speed;
        image(coin, coin_x, coin_y);
    }
}

function setTitle(msg) {
    title = msg;
    title_start_time = millis();
    game_status = 'title';
}

function printTitle() {
    if (game_status == 'title') {
        if (millis() < title_start_time + 2000) {
            printText(title);
        } else {
            game_status = 'play';
        }
    }
}

function printText(txt) {
    textSize(100);
    textAlign(CENTER, CENTER);
    text(txt, width / 2, height / 2);
}
