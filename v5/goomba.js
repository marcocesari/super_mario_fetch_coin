class Goomba {
    constructor({ image_left, image_right, canvas_width, ground_y }) {
        this.image_left = image_left;
        this.image_right = image_right;
        this.image = image_left;

        this.canvas_width = canvas_width;
        this.x = canvas_width / 4;
        this.y = ground_y;
        this.speed_x = 5;

        this.animation_start_time = millis();
    }

    move() {
        this.animateGoomba();
        if (this.x <= 0 || this.x + this.image.width >= this.canvas_width) {
            this.speed_x *= -1;
        }
        this.x += this.speed_x;
    }

    animateGoomba() {
        if (millis() > this.animation_start_time + 200) {
            this.animation_start_time = millis();
            if (this.image == this.image_left) {
                this.image = this.image_right;
            } else {
                this.image = this.image_left;
            }
        }
    }

    show() {
        image(this.image, this.x, this.y - this.image.height);
    }
}
