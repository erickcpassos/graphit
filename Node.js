class Node {

    constructor(label, x=random(nodeRadius, canvasWidth-nodeRadius), y=random(nodeRadius, canvasHeight-nodeRadius), color='#FFFFFF', radius=20) {
        this.label= label;
        this.radius = radius;
        this.x = x;
        this.y = y
        this.isMoving = false;
        this.isSelected = false;
        this.color = color;
        this.animationFrame = 0;
        this.scaleAnimationFrames = [0, 0.05, 0.07, 0.12, 0.25, 0.4, 0.6, 0.9, 1.3, 1.25, 1.15, 1]; // scales for spring animation
        this.numFrames = this.scaleAnimationFrames.length;
   }

    display() {
        if(this.isMoving) {
            this.x=lerp(this.x, mouseX, 0.3); 
            this.y=lerp(this.y, mouseY, 0.3);
        }

        push();
            if(this.isSelected) strokeWeight(4);
            fill(this.color);
            circle(this.x, this.y, 2*lerp(0, this.radius, this.scaleAnimationFrames[this.animationFrame]));
        pop();
        
        push();
            textAlign(CENTER, CENTER);
            fill(getAppropriateTextColor(this.color));
            textFont('Roboto Mono')
            text(this.label, this.x, this.y);
        pop();
    }

    goToNextAnimationFrame() {
        if(this.animationFrame+1 < this.numFrames) {
            this.animationFrame++;
        } 
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