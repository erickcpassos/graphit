class Node {
    constructor(label, radius=20, x=random(nodeRadius, canvasWidth-nodeRadius), y=random(nodeRadius, canvasHeight-nodeRadius)) {
        this.label= label;
        this.radius = radius;
        this.x = x;
        this.y = y
        this.isMoving = false;
        this.isSelected = false;
    }

    display() {
        if(this.isMoving) {
            this.x=mouseX; 
            this.y=mouseY;
        }

        push();
        if(this.isSelected) strokeWeight(4);
        circle(this.x, this.y, 2*this.radius);
        pop();
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }

    select() {
        this.isSelected = true;
    } 

    deselect() {
        this.isSelected = false;
    }

    wasClicked(x, y) {
        let d = dist(x, y, this.x, this.y);
        if(d < this.radius) {
            return true;
        }
        return false;
    }

    onClick() {
        this.isMoving = true;
    }

    onRelease() {
        this.isMoving = false;
    }
}