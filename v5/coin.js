class Coin {
    constructor({ image, sound, x, y, speed_y, canvas_width }) {
        this.canvas_width = canvas_width;
        this.image = image;
        this.sound = sound;
        this.x = x ?? random(canvas_width - image.width);
        this.y = y ?? 0;
        this.speed_y = speed_y ?? 6;
    }

    move() {
        this.y += this.speed_y;
    }

    show() {
        image(this.image, this.x - this.image.width / 2, this.y);
    }

    play() {
        this.sound.play();
    }

    reset() {
        this.x = random(this.canvas_width - this.image.width);
        this.y = 0;
    }
}
