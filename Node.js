class Node {
    constructor(label, x=random(nodeRadius, canvasWidth-nodeRadius), y=random(nodeRadius, canvasHeight-nodeRadius), color='#FFFFFF', radius=20) {
        this.label= label;
        this.radius = radius;
        this.x = x;
        this.y = y
        this.isMoving = false;
        this.isSelected = false;
        this.color = color;
    }

    display() {
        if(this.isMoving) {
            this.x=mouseX; 
            this.y=mouseY;
        }

        push();

            if(this.isSelected) strokeWeight(4);
            fill(this.color);
            circle(this.x, this.y, 2*this.radius);
        pop();
        
        push();
            textAlign(CENTER, CENTER);
            fill(getAppropriateTextColor(this.color));
            text(this.label, this.x, this.y);
        pop();
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