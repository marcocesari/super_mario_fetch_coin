class Goomba {
    constructor({ image_left, image_right, canvas_width, ground_y }) {
        this.image_left = image_left;
        this.image_right = image_right;
        this.image = this.image_left;

        this.canvas_width = canvas_width;
        this.x = canvas_width / 4;
        this.y = ground_y;
        this.speed_x = 5;
        this.ground_y = ground_y;

        this.animation_start_time = millis();
    }

    moveRight() {
        this.x += this.speed_x;
        this.image = this.image_right;
    }

    moveLeft() {
        this.x -= this.speed_x;
        this.image = this.image_left;
    }

    move() {
        this.animateGoomba();
        if (this.x <= 0 || this.x + this.image.width >= this.canvas_width) {
            this.speed_x = -1 * this.speed_x;
        }
        this.x += this.speed_x;
    }

    animateGoomba() {
        if (millis() > self.animation_start_time + 200) {
            self.animation_start_time = millis();
            if (this.image === this.image_left) {
                this.image = this.image_right;
            } else {
                this.image = this.image_left;
            }
        }
    }

    show() {
        image(this.image, this.x, this.y - this.image.height);
    }

    reachCoin(coin_x) {
        if (this.ai && Math.abs(this.x - coin_x) > this.speed_x) {
            if (this.x < coin_x) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        }
    }

    jump() {
        if (this.y >= this.ground_y) {
            // on the ground
            this.speed_y = -this.jump_power;
        }
    }

    toggleAI() {
        this.ai = !this.ai;
    }
}
