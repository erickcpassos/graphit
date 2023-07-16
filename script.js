const canvasWidth = 400, canvasHeight = 400;
const nodeRadius = 20;
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

    for(let i = 0; i < genNodes; i++) {
        for(let j = i+1; j < genNodes; j++) {
            edges.push(new Edge(i, j));
        }
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

    if(keyCode == 68) {
        mode = "DELETE";
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
                if(nodes[i].wasClicked(mouseX, mouseY)) {
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
            
        case "DELETE":
            for(let i = nodes.length-1; i >= 0; i--) { // vertices de indices maiores estão acima
                if(nodes[i].wasClicked(mouseX, mouseY)) {
                    deleteNode(i);
                    break;
                }
            }

            for(let i = edges.length-1; i >= 0; i--) {
                if(edges[i].wasClicked(mouseX, mouseY)) {
                    console.log("ARESTA " + i + " FOI CLICADA!");
                    deleteEdge(i);
                    break;
                }
            }

        default:
            for(let i = nodes.length-1; i >= 0; i--) { // vertices de indices maiores estão acima
                if(nodes[i].wasClicked(mouseX, mouseY)) {
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

function deleteNode(index) {
    edges = edges.filter(edge => (edge.source !== index && edge.destination !== index));
    edges.forEach(edge => {
        if(edge.source > index) edge.source--;
        if(edge.destination > index) edge.destination--;
    });
    nodes.splice(index, 1);
    return;
}

function deleteEdge(index) {
    edges.splice(index, 1);
    return;
}

function resetNodeSelection() {
    nodes.forEach(node => {
        node.deselect();
    });
    nodeToAddEdgeFrom = -1;
    return;
}

function addNode(x, y, label=nodes.length) {
    // TODO: resolver problema na label "default"
    // if(label === null) {
    //     label = 0;
    //     for(let i = 0; i < nodes.length; i++) {
    //         if(label == nodes[i].label)
    //     }
    // }

    // for(let i = 0; i < nodes.length; i++) {

    // }
    nodes.forEach((node) => {
        if(node.label == label) return;
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

    wasClicked(x, y) {
        let n1 = nodes[this.source], n2 = nodes[this.destination];
        if(n1.y < n2.y) {
            [n1, n2] = [n2, n1];
        }

        if(x < Math.min(n1.x, n2.x) || x > Math.max(n1.x, n2.x) || y < Math.min(n1.y, n2.y) || y > Math.max(n1.y, n2.y)) return false;

        const precision = 0.000000001;
        let deltaY = n2.y-n1.y, deltaX = (n2.x == n1.x ? precision : n2.x-n1.x);
        let m = deltaY/deltaX;
        let b = n1.y - m*n1.x;
        // y = mx + b
        let foundY = m*x + b;

        // console.log([n1.x, n1.y], [n2.x, n2.y]);
        // console.log({m, foundY, y});

        const acceptedDiff = 30;
        if(abs(y - foundY) <= acceptedDiff) {
            return true;
        } else {
            return false;
        }
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
        circle(this.x, this.y, 2*nodeRadius);
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
        if(d < nodeRadius) {
            return true;
        }
        return false;
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