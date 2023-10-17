class Score {
    constructor(icon) {
        this.icon = icon;
        this.value = 0;
    }

    add(amount) {
        this.value += amount;
    }

    show() {
        image(this.icon, 30, 30);
        textSize(24);
        textAlign(LEFT, CENTER);
        text(this.value, 70, 52);
    }
}
