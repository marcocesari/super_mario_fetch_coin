class PlayerDNA {
    constructor(a, b, c) {
        this.a = a ?? Math.random() - 0.5;
        this.b = b ?? Math.random() - 0.5;
        //this.c = c ?? Math.random() - 0.5;
        this.c = 0;
    }

    mutate() {
        this.a += (Math.random() * 2 - 1) * 0.1;
        this.b += (Math.random() * 2 - 1) * 0.1;
        //this.c += (Math.random() * 2 - 1) * 0.1;
        this.c = 0;
    }

    clone() {
        return new PlayerDNA(this.a, this.b, this.c);
    }

    toString() {
        return '(a:' + this.a.toFixed(2) + ' b:' + this.b.toFixed(2) + ' c:' + this.c.toFixed(2) + ')';
    }
}

class Player {
    constructor({ image_left, image_right, image, ai, gravity, jump_power, dna, canvas_width, ground_y }) {
        this.image_left = image_left;
        this.image_right = image_right;
        this.image = image ?? image_left;
        this.ai = ai ?? 'genetic';
        this.gravity = gravity ?? 1;
        this.jump_power = jump_power ?? 20;
        this.dna = dna ? dna.clone() : new PlayerDNA();

        this.canvas_width = canvas_width;
        this.ground_y = ground_y;
        this.resetInitialPosition();
        this.y = ground_y;

        this.max_speed_x = 15;
        this.speed_x = 10;
        this.speed_y = 0;
    }

    resetInitialPosition() {
        this.x = this.canvas_width / 2 - this.image.width / 2;
    }

    moveRight() {
        this.x += this.speed_x;
        this.image = this.image_right;
    }

    moveLeft() {
        this.x -= this.speed_x;
        this.image = this.image_left;
    }

    move(coin_x) {
        switch (this.ai) {
            case 'no':
                if (keyIsDown(LEFT_ARROW)) {
                    this.moveLeft();
                }
                if (keyIsDown(RIGHT_ARROW)) {
                    this.moveRight();
                }
                break;
            case 'basic':
                this.basicAI(coin_x);
                break;
            case 'genetic':
                this.geneticAI(coin_x);
                break;
        }
        this.y += this.speed_y;
        if (this.y < ground_y) {
            // in the air
            this.speed_y += this.gravity;
        } else {
            this.speed_y = 0;
            this.y = ground_y;
        }
    }

    show() {
        image(this.image, this.x - this.image.width / 2, this.y - this.image.height);
    }

    basicAI(coin_x) {
        if (Math.abs(this.x - coin_x) > this.speed_x) {
            if (this.x < coin_x) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        }
    }

    clamp(input, min, max) {
        return input < min ? min : input > max ? max : input;
    }

    map(current, in_min, in_max, out_min, out_max) {
        const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        return this.clamp(mapped, out_min, out_max);
    }

    geneticAI(coin_x) {
        const normalized_coin_x = (coin_x * 1.0) / this.canvas_width;
        const normalized_x = this.x / this.canvas_width;
        let dna = this.dna;
        let f = dna.a * normalized_coin_x + dna.b * normalized_x + dna.c;
        const speed_x = this.map(f, -2, 2, -this.max_speed_x, this.max_speed_x);
        if (speed_x >= 0) {
            this.image = this.image_right;
        } else {
            this.image = this.image_left;
        }
        this.x += speed_x;
    }

    jump() {
        if (this.y >= this.ground_y) {
            // jump only if player is on the ground
            this.speed_y = -this.jump_power;
        }
    }

    toggleAI() {
        let ai = this.ai;
        switch (ai) {
            case 'no':
                ai = 'basic';
                break;
            case 'basic':
                ai = 'genetic';
                break;
            case 'genetic':
                ai = 'no';
                break;
        }
    }

    clone(mutate) {
        const p = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        p.dna = this.dna.clone();
        if (mutate) p.dna.mutate();
        return p;
    }
}

class Players {
    constructor(player_config, num_players) {
        this.players = [];
        for (let i = 0; i < num_players; i++) this.players.push(new Player(player_config));
        this.best_players = this.players;
    }

    setup(canvas_width, ground_y) {
        for (const player of this.players) {
            player.setup(canvas_width, ground_y);
        }
    }

    move(coin_x) {
        for (const player of this.players) {
            player.move(coin_x);
        }
    }

    show() {
        for (const player of this.players) {
            player.show();
        }
    }

    toggleAI() {
        for (const player of this.players) {
            player.toggleAI();
        }
    }

    jump() {
        for (const player of this.players) {
            player.jump();
        }
    }

    setSpeed(speed_x) {
        for (const player of this.players) {
            player.speed_x = speed_x;
        }
    }

    collide(coin, min_distance = 60) {
        for (const player of this.players) {
            const d = dist(coin.x, coin.y, player.x, player.y - player.image.height);
            if (d < min_distance) return true;
        }
        return false;
    }

    assign_fit_scores(goal) {
        for (const player of this.players) {
            player.score = Math.abs(player.x - goal);
        }
    }

    sort_players_by_score(goal) {
        this.assign_fit_scores(goal);
        return this.players.sort((a, b) => a.score - b.score);
    }

    spawn_next_generation(goal) {
        this.best_players = this.sort_players_by_score(goal);
        let next_generation = this.best_players.slice(0, 10);
        let mutated_clones = [];
        for (const player of next_generation) {
            player.resetInitialPosition();
            // Add 10 clones of each player
            for (let j = 0; j < 10; j++) {
                let clone = player.clone(true);
                mutated_clones.push(clone);
            }
        }
        next_generation.push(...mutated_clones);
        this.players = next_generation;
    }
}
