let canvasWidth = 500, canvasHeight = 500;
const nodeRadius = 40;

let mode = "MOVE";
let nodeToAddEdgeFrom = -1;

let nodes = []
let edges = []

let isGraphDirected = false;

let colorList = ["#FFFFFF", "#000000"]
let currentVertexBackgroundColorIndex = 0;

const drawingPaths = []
let currentDrawingPath = [];
let drawingColor = '#000000';



function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function setup() {
    if(windowWidth <= 768) {
        canvasWidth = windowWidth;
        canvasHeight = windowHeight-150;
    } else {
        canvasWidth = canvasHeight = 0.7*min(windowHeight, windowWidth);
    }
    let canvas = createCanvas(canvasWidth, canvasHeight);
    const genNodes = 4;
    frameRate(60);
    canvas.parent("p5-canvas")
}

function windowResized() {

    if(windowWidth <= 768) {
        canvasWidth = windowWidth;
        canvasHeight = windowHeight-150;
    } else {
        canvasWidth = canvasHeight = 0.7*min(windowHeight, windowWidth);
    }

    console.log(canvasWidth);
    resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
    background(220);
    readTextArea();
    edges.forEach((edge) => edge.display())
    nodes.forEach((node) => {node.display(); node.goToNextAnimationFrame();})


    if(mode === "DRAW") {
        push();
            noFill();
            if(mouseIsPressed && mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) {
                const drawingPoint = {
                    x: mouseX, y: mouseY, color: drawingColor
                }
                currentDrawingPath.push(drawingPoint);
            }
        
            drawingPaths.forEach(path => {
                beginShape();
                    path.forEach(point => {
                        stroke(point.color);
                        strokeWeight(3);
                        vertex(point.x, point.y);
                    });
                endShape();
            })
        pop();
    }
    
}

function readTextArea() {

    let graphData = document.getElementsByTagName('textarea')[0].value;
    graphData = graphData.split('\n');


    // apago as arestas que não estão no textarea
    edges.forEach((edge, index) => {
        let exists = false;
        graphData.forEach((line) => {

            let l = line.split(' ').filter((item) => item.length > 0);
            if(l.length >= 2) { // eh uma aresta, sem peso
                let edgeLabel = "";
                for(let i = 2; i < l.length; i++) {
                    edgeLabel += l[2].toString();
                }
                
                if(+l[0] == nodes[edge.source].label && +l[1] == nodes[edge.destination].label && edgeLabel.trim() == edge.weight.trim()) {
                    exists = true;
                    return;
                }
            }

        })

        if(!exists) {
            deleteEdge(index, false);
        }
    });

    // apago os vertices que não estão no textarea
    nodes.forEach((node, index) => { // pra cada vertice
        let exists = false;

        graphData.forEach((line) => { // checa cada linha da caixa de texto
            let l = line.split(' ').filter((item) => item.length > 0);

            if(l.length > 0) {
                for(let i = 0; i < Math.min(2, l.length); i++) {
                    if(l[i] == node.label) {
                        exists = true;
                        return;
                    }
                }
            }
        })
        
        if(!exists) {
            deleteNode(index);
        }
    }) 

    let nxtEdges = [];

    // vê quais vértices e arestas estão no textarea e precisam ser adicionados nas listas "nodes" e "edges"
    graphData.forEach(line => {
        let l = line.split(' ').filter((item) => item.length > 0);
        if(l.length === 1) {
            addNode(random(nodeRadius, canvasWidth-nodeRadius), random(nodeRadius, canvasWidth-nodeRadius), l[0]);
        }

        if(l.length >= 2) { // eh uma aresta

            addNode(random(nodeRadius, canvasWidth-nodeRadius), random(nodeRadius, canvasWidth-nodeRadius), l[0]);
            addNode(random(nodeRadius, canvasWidth-nodeRadius), random(nodeRadius, canvasWidth-nodeRadius), l[1]);

            let weight = "";
            for(let i = 2; i < l.length; i++) {
                weight += " " + l[i];
            }

            weight = weight.trim();

            // busca se já tem uma aresta com as mesmas propriedades visiveis (source, destination, label, directed)
            let foundEdge = edges.find((edge) => edge.source == l[0] && edge.destination == l[1] && edge.label == weight);
            if(!foundEdge) {
                nxtEdges.push(new Edge(nodes.findIndex((node) => node.label == l[0]), nodes.findIndex((node) => node.label == l[1]), weight, isGraphDirected))
                // vou adicionar esse edge no proximo frame
            } else {
                nxtEdges.push(foundEdge); // se encontrei o edge, boto o mesmo na lista
                edges.splice(edges.indexOf(foundEdge), 1); // apago esse edge da lista de edges pra fazer uma bijecao textarea <-> edges
            }

        }

    });


    const didEdgesChange = edges.length == nxtEdges.length && edges.every((edge, index) => (edge.source == nxtEdges[index].source && edge.destination == nxtEdges[index].destination && edge.weight == nxtEdges[index].weight)); 

    if(!didEdgesChange) {
        edges = nxtEdges;
        updateUI();
    }

    // edges = nxtEdges;

    // atribui valores de curva para multiedges
    for(let i = 0; i < nodes.length; i++) {

        let selfLoopEdgesAtI = [];
        edges.forEach((edge, index) => {
            if(edge.source == i && edge.source == edge.destination) {
                selfLoopEdgesAtI.push(index);
            }
        });

        
        selfLoopEdgesAtI.forEach((index, num) => {
            edges[index].selfLoopIndex = num+1;
        })


        for(let j = 0; j < nodes.length; j++) {
            let indexesOfEdgesInTheSamePairOfVertices = [];
            edges.forEach((edge, index) => {
                if((edge.source == i && edge.destination == j) || (edge.source == j && edge.destination == i)) {
                    indexesOfEdgesInTheSamePairOfVertices.push({index: index, reverse: (edge.source > edge.destination)});
                }
            })

            if(indexesOfEdgesInTheSamePairOfVertices.length === 1) {
                edges[indexesOfEdgesInTheSamePairOfVertices[0].index].curveValue = 0;
                continue;
            }

            indexesOfEdgesInTheSamePairOfVertices.forEach((value, index) => {
                let curveValue = 50*(floor(index/2)+1);
                
                if(index%2==1) {
                    curveValue *= -1;
                }
                
                if(value.reverse) {
                    curveValue *= -1;
                }

                edges[value.index].curveValue = curveValue; 
            })
        }
    }

}

function keyPressed() {

    if(keyCode === 49)      mode = "MOVE";
    else if(keyCode === 50) mode = "NODE";
    else if(keyCode === 51) mode = "EDGE";
    else if(keyCode === 52) mode = "DELETE";
    else if(keyCode === 53) mode = "DRAW";

    if(keyCode === 65) {
        mode = "NODE";
    }

    if(keyCode === 69) {
        mode = "EDGE";
    }

    if(keyCode == 68) {
        mode = "DELETE";
    }

    if(keyCode == 86) {
        mode = "VALUES";
    }

    if(keyCode == 81) {
        mode = "DRAW";
    }

    if(keyCode == 67 && mode === "DRAW") {
        clearAllDrawings();
    }

    changeModeUI()
    return;
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

    changeModeUI()
    return;
}

function mousePressed() {

    if(mouseX < 0 || mouseY < 0 || mouseX > canvasWidth || mouseY > canvasWidth) return;

    switch (mode) { // toma ações diferentes dependendo do MODO atual
        case "NODE":
            let label = 0;
            for(let i = 0; i < nodes.length; i++) {
                if(!isNaN(+nodes[i].label)) {
                    label = Math.max(+nodes[i].label + 1, label);
                }
            }
            addNode(mouseX, mouseY, label.toString());
            const graphDataTextArea = document.getElementsByTagName('textarea')[0];

            graphDataTextArea.value += `\n${label}`
            break;

        case "EDGE":
            for(let i = nodes.length-1; i >= 0; i--) { // vertices de indices maiores estão acima
                if(nodes[i].wasClicked(mouseX, mouseY)) {
                    if(nodeToAddEdgeFrom === -1) { // se não tem ninguém selecionado, selecione o vertice clicado
                        nodes[i].select();
                        nodeToAddEdgeFrom = i;
                    } else {                        // se já tiver algum selecionado, adicione uma aresta entre eles e reseta
                        const graphDataTextArea = document.getElementsByTagName('textarea')[0];
                        
                        graphDataTextArea.value += `\n${nodes[nodeToAddEdgeFrom].label} ${nodes[i].label}`;

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
                    deleteEdge(i);
                    break;
                }
            }

        case "VALUES":
            for(let i = nodes.length-1; i >= 0; i--) { // vertices de indices maiores estão acima
                if(nodes[i].wasClicked(mouseX, mouseY)) {
                    // TODO
                }
                
            }

        case "DRAW":
            currentDrawingPath = [];
            drawingPaths.push(currentDrawingPath);
            break;

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

function clearAllDrawings() {
    drawingPaths.splice(0);
    return;
}

function mouseReleased() {
    for(let i = nodes.length-1; i >= 0; i--) {
        if(nodes[i].isMoving) {
            nodes[i].onRelease();
        }
    }
}

function deleteNode(index) {
    const graphDataTextArea = document.getElementsByTagName('textarea')[0];

    let l = graphDataTextArea.value.split('\n');
    l = l.filter(line => {
        return !line.split(' ').slice(0, 2).includes(nodes[index].label)
    }); // reescreve o texto tirando as linhas que envolvem o nó a ser deletado

    graphDataTextArea.value = l.join('\n');

    // conserta os indices das arestas afetadas pela deleção
    edges = edges.filter(edge => (edge.source !== index && edge.destination !== index));
    edges.forEach(edge => {
        if(edge.source > index) edge.source--;
        if(edge.destination > index) edge.destination--;
    });
    nodes.splice(index, 1);
    updateUI();


    return;
}

function deleteEdge(index, isInTextArea=true) {

    const graphDataTextArea = document.getElementsByTagName('textarea')[0];
    let lines = graphDataTextArea.value.split('\n');

    let lineToDelete = -1;
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i].split(' ');
        let edgeLabel = "";
        for(let i = 2; i < line.length; i++) {
            edgeLabel += line[i].toString();
        }
        edgeLabel = edgeLabel.trim();
        if(line.length >= 2) {

            if((line[0] == nodes[edges[index].source].label && line[1] == nodes[edges[index].destination].label && edgeLabel == edges[index].weight) || (line[0] == nodes[edges[index].destination].label && line[1] == nodes[edges[index].source].label && edgeLabel == edges[index].weight)) {
                lineToDelete = i;
                break;
            }
        }
    }

    if(lineToDelete != -1 && isInTextArea) {
        lines.splice(lineToDelete, 1);
    }


    graphDataTextArea.value = lines.join('\n');
    edges.splice(index, 1);
    updateUI();

    return;
}

function resetNodeSelection() {
    nodes.forEach(node => {
        node.deselect();
    });
    nodeToAddEdgeFrom = -1;
    return;
}

function addNode(x, y, label=null) {

    if(label === null) {
        label = 0;
        for(let i = 0; i < nodes.length; i++) {
            if(!isNaN(+nodes[i].label)) {
                label = Math.max(+nodes[i].label + 1, label);
            }
        }
    }
    
    for(let i = 0; i < nodes.length; i++) {
        if(nodes[i].label == label) return;
    }
    

    nodes.push(new Node(label, x, y, colorList[currentVertexBackgroundColorIndex]));
    updateUI();

    return;
}

function addEdge(source, destination, weight, directed=isGraphDirected) {

    edges.push(new Edge(source, destination, weight, directed));
    updateUI();

}

function clearGraph() {
    if(confirm("Are you sure? This will delete your graph and drawings completely!")) {
        const graphDataTextArea = document.getElementsByTagName('textarea')[0];
        graphDataTextArea.value = '';
        clearAllDrawings();
    }
}
