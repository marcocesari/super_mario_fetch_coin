class Title {
    constructor(canvas_width, canvas_height) {
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
    }

    setTitle(txt) {
        this.txt = txt;
        this.start_time = millis();
    }

    show() {
        if (!this.isTitleExpired()) {
            textSize(100);
            textAlign(CENTER, CENTER);
            text(this.txt, this.canvas_width / 2, this.canvas_height / 2);
        }
    }

    isTitleExpired() {
        return millis() > this.start_time + 2000;
    }
}
