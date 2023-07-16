const canvasWidth = 400, canvasHeight = 400;
const nodeRadius = 40;
let mode = "MOVE";
let nodeToAddEdgeFrom = -1;

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
}

function draw() {
    background(220);
    edges.forEach((edge) => edge.display())
    nodes.forEach((node) => node.display())
}

function keyPressed() {
    if(keyCode === 65) {
        mode = "NODE";
        return;
    }

    if(keyCode === 69) {
        mode = "EDGE";
        return;
    }
}

function keyReleased() {

    switch (mode) {
        case "EDGE":
            resetNodeSelection();
            break;

        default:
            break;
    }

    mode = "MOVE";
    
    return;
}

function mousePressed() {

    switch (mode) { // toma ações diferentes dependendo do MODO atual
        case "NODE":
            addNode(mouseX, mouseY);
            break;

        case "EDGE":
            for(let i = nodes.length-1; i >= 0; i--) { // vertices de indices maiores estão acima
                let d = dist(mouseX, mouseY, nodes[i].x, nodes[i].y);
                if(d < nodeRadius) {
                    if(nodeToAddEdgeFrom === -1) { // se não tem ninguém selecionado, selecione o vertice clicado
                        nodes[i].select();
                        nodeToAddEdgeFrom = i;
                    } else {                        // se já tiver algum selecionado, adicione uma aresta entre eles e reseta
                        addEdge(nodeToAddEdgeFrom, i);
                        resetNodeSelection();
                    }

                    break;
                }
            }
            break;
            
        default:
            for(let i = nodes.length-1; i >= 0; i--) { // vertices de indices maiores estão acima
                let d = dist(mouseX, mouseY, nodes[i].x, nodes[i].y);
                if(d < nodeRadius) {
                    nodes[i].onClick();
                    break;
                }
            }
            break;
    }
}

function mouseReleased() {
    for(let i = nodes.length-1; i >= 0; i--) {
        if(nodes[i].isMoving) {
            nodes[i].onRelease();
        }
    }
}

function resetNodeSelection() {
    nodes.forEach(node => {
        node.deselect();
    });
    nodeToAddEdgeFrom = -1;
    return;
}

function addNode(x, y, label=nodes.length) {
    nodes.forEach((node) => {
        if(node.label === label) return;
    });

    nodes.push(new Node(label, x, y));
    return;
}

function addEdge(source, destination, directed=false) {
    edges.forEach(edge => {
        if(edge.source === source && edge.destination === destination) return;
        if(!directed && edge.source === edge.destination && edge.destination === edge.source) return; 
    });

    edges.push(new Edge(source, destination, directed));
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
        this.isSelected = false;
    }

    display() {
        if(this.isMoving) {
            this.x=mouseX; 
            this.y=mouseY;
        }

        push();
        if(this.isSelected) strokeWeight(4);
        circle(this.x, this.y, nodeRadius);
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

    onClick() {
        if(mode === "MOVE") {
            this.isMoving = true;
        }
    }

    onRelease() {
        if(mode === "MOVE") {
            this.isMoving = false;
        }
    }
}