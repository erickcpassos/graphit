const canvasWidth = 400, canvasHeight = 400;
const nodeRadius = 40;
const mode = "MOVE"

let nodes = []
let edges = []


function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    const genNodes = 4;
    canvas.parent("p5-canvas")
    for(let i = 0; i < genNodes; i++) {
        nodes.push(new Node(i));
    }

    for(let i = 0; i < genNodes; i++) {
        for(let j = i+1; j < genNodes; j++) {
            if(i == j) continue;
            edges.push(new Edge(i, j));
        }
    }
}

function draw() {
    background(220);
    edges.forEach((edge) => edge.display())
    nodes.forEach((node) => node.display())
}

function mousePressed() {
    for(let i = nodes.length-1; i >= 0; i--) { // greater indexed nodes are displayed above
        let d = dist(mouseX, mouseY, nodes[i].x, nodes[i].y);
        if(d < nodeRadius) {
            nodes[i].onClick();
            break;
        }
    }
}

function mouseReleased() {
    for(let i = nodes.length-1; i >= 0; i--) {
        if(nodes[i].isMoving) {
            nodes[i].onRelease();
        }
    }
}

class Edge {
    constructor(source, destination, isDirected=false) {
        this.source = source;
        this.destination = destination;
        this.isDirected = isDirected;
    }

    display() {
        push();
        strokeWeight(2);
        line(nodes[this.source].x, nodes[this.source].y, nodes[this.destination].x, nodes[this.destination].y)
        
        if(this.isDirected) {
            push();
            var angle = atan2(nodes[this.source].y - nodes[this.destination].y, nodes[this.source].x - nodes[this.destination].x); //gets the angle of the line
            translate(nodes[this.destination].x, nodes[this.destination].y); //translates to the destination vertex
            rotate(angle-HALF_PI); //rotates the arrow point
            let offset = nodeRadius*0.8;
            fill(0, 0, 0);
            triangle(-offset*0.25, offset, offset*0.25, offset, 0, offset*0.5); //draws the arrow point as a triangle
            pop();
        }
        
        pop();
    }
}

class Node {
    constructor(label, x=random(nodeRadius, canvasWidth-nodeRadius), y=random(nodeRadius, canvasHeight-nodeRadius)) {
        this.label= label;
        this.x = x;
        this.y = y
        this.isMoving = false;
    }

    display() {
        if(this.isMoving) {
            this.x=mouseX; 
            this.y=mouseY;
        }

        circle(this.x, this.y, nodeRadius);
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }

    onClick() {
        if(mode === "MOVE") {
            console.log(`started moving node ${this.label}`);
            this.isMoving = true;
        }
    }

    onRelease() {
        console.log(`stopped moving node ${this.label}`);
        if(mode === "MOVE") {
            this.isMoving = false;
        }
    }
}