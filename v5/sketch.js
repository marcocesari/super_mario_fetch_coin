let player_config, goomba, goomba_config, coin, coin_config, score;
let bkg, bkg_landscape, bkg_underwater;
let game_over_sound;
let game_status,
    default_game_status = 'genetic_training';
let level;
let title;
const num_brothers = 150;

function preload() {
    bkg_landscape = loadImage('assets/background1.png');
    bkg_underwater = loadImage('assets/underwater.png');

    player_config = {
        image_left: loadImage('assets/mario_left.png'),
        image_right: loadImage('assets/mario_right.png'),
    };

    coin_config = {
        image: loadImage('assets/coin.png'),
        sound: loadSound('assets/smb_coin.wav'),
    };

    game_over_sound = loadSound('assets/smb_gameover.wav');

    goomba_config = {
        image_right: loadImage('assets/goomba_right.png'),
        image_left: loadImage('assets/goomba_left.png'),
    };
}

function setup() {
    this.focus();
    createCanvas(800, 800);
    ground_y = height - 104;

    level = 1;
    game_status = 'title';
    title = new Title(width, height);
    title.setTitle('LEVEL 1');
    bkg = bkg_landscape;

    player_config.canvas_width = width;
    player_config.ground_y = ground_y;
    brothers = new Players(player_config, num_brothers);

    coin_config.canvas_width = width;
    coin = new Coin(coin_config);

    goomba_config.canvas_width = width;
    goomba_config.ground_y = ground_y;
    goomba = new Goomba(goomba_config);

    score = new Score(coin_config.image);
}

function draw() {
    background(bkg);

    if (game_status == 'title') {
        if (title.isTitleExpired()) {
            game_status = default_game_status;
        } else {
            title.show();
        }
    }

    if (['play', 'auto', 'genetic_training', 'genetic_play'].includes(game_status)) {
        coin.move();
        coin.show();
    }

    goomba.move();
    goomba.show();

    brothers.move(coin.x);
    brothers.show();

    if (brothers.collide(coin)) {
        if (game_status == 'genetic_training') brothers.spawn_next_generation(coin.x);
        score.add(1);
        coin.reset();
        coin.play();
        if (score.value == 50 && game_status == 'play') setupLevel2();
        if (score.value == 100 && game_status == 'play') setupLevel3();
    }

    score.show();

    if (['play', 'auto', 'game_over'].includes(game_status)) checkGameOver();

    if (['genetic_training', 'genetic_play'].includes(game_status)) show_best_dna();

    if (coin.y > height) {
        if (game_status == 'genetic_training') {
            brothers.spawn_next_generation(coin.x);
            coin.reset();
        }
        if (game_status == 'genetic_play') {
            coin.reset();
        }
    }

    show_game_status();
}

function show_game_status() {
    textSize(24);
    textAlign(RIGHT, CENTER);
    text('Game mode: ' + game_status, 790, 20);
}

function show_best_dna() {
    const best_player = brothers.best_players[0];
    textSize(24);
    textAlign(RIGHT, CENTER);
    text('Best DNA: ' + best_player.dna.toString(), 790, 52);
}

function checkGameOver() {
    if (coin.y > height) {
        textSize(100);
        textAlign(CENTER, CENTER);
        text('GAME OVER', width / 2, height / 2);
        if (game_status == 'play') {
            game_over_sound.play();
            game_status = 'game_over';
        }
    }
}

function setupLevel2() {
    level = 2;
    game_status = 'title';
    title.setTitle('LEVEL 2');
    brothers.setSpeed(15);
    coin.speed_y = 10;
}

function setupLevel3() {
    level = 3;
    game_status = 'title';
    title.setTitle('LEVEL 3');
    brothers.setSpeed(25);
    coin.speed_y = 15;
    bkg = bkg_underwater;
}

function keyPressed() {
    if (key.toLowerCase() === 'a') {
        brothers.toggleAI();
    }
    if (keyCode === UP_ARROW) {
        brothers.jump();
    }
    if (key.toLowerCase() === 'g') {
        switch (game_status) {
            case 'genetic_training':
                game_status = 'genetic_play';
                let fittest = brothers.best_players[0];
                fittest.ai = 'genetic';
                brothers.players = Array(fittest);
                break;
            case 'genetic_play':
                game_status = 'play';
                let mario = brothers.best_players[0];
                mario.ai = 'no';
                brothers.players = Array(mario);
                break;
            case 'play':
                game_status = 'auto';
                let automa = brothers.best_players[0];
                automa.ai = 'basic';
                brothers.players = Array(automa);
                break;
            case 'auto':
                game_status = 'genetic_training';
                brothers = new Players(player_config, num_brothers);
                break;
        }
    }
}
