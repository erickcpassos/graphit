const canvasWidth = 500, canvasHeight = 500;
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
    // for(let i = 0; i < genNodes; i++) {
    //     nodes.push(new Node(i));
    // }

    // for(let i = 0; i < genNodes; i++) {
    //     for(let j = i+1; j < genNodes; j++) {
    //         edges.push(new Edge(i, j));
    //     }
    // }
}

function draw() {
    background(220);
    readTextArea();
    edges.forEach((edge) => edge.display())
    nodes.forEach((node) => node.display())
}

function readTextArea() {

    let graphData = document.getElementsByTagName('textarea')[0].value;
    graphData = graphData.split('\n');


    // apago as arestas que não estão no textarea
    edges.forEach((edge, index) => {
        let exists = false;
        graphData.forEach((line) => {

            let l = line.split(' ');
            if(l.length >= 2) { // eh uma aresta, sem peso
                if(+l[0] == nodes[edge.source].label && +l[1] == nodes[edge.destination].label) {
                    exists = true;
                    return;
                }
            }

        })
        
        if(!exists) {
            deleteEdge(index);
        }
    });

    // apago os vertices que não estão no textarea
    nodes.forEach((node, index) => { // pra cada vertice
        let exists = false;

        graphData.forEach((line) => { // checa cada linha da caixa de texto
            let l = line.split(' ');
            if(l.length > 0) {
                l.forEach((label) => { // checa cada elemento de cada linha pra cada vertice
                    if(label == node.label) { 
                        exists = true;
                        return;
                    }
                } )
            }
        })
        
        if(!exists) {
            deleteNode(index);
        }
    }) 

    graphData.forEach(line => {
        let l = line.split(' ').filter((item) => item.length > 0);
        if(l.length === 1) {
            addNode(random(nodeRadius, canvasWidth-nodeRadius), random(nodeRadius, canvasWidth-nodeRadius), l[0]);
        }
    });

    graphData.forEach(line => {
        let l = line.split(' ').filter((item) => item.length > 0);
        if(l.length >= 2) {
            addNode(random(nodeRadius, canvasWidth-nodeRadius), random(nodeRadius, canvasWidth-nodeRadius), l[0]);
            addNode(random(nodeRadius, canvasWidth-nodeRadius), random(nodeRadius, canvasWidth-nodeRadius), l[1]);

            let weight = "";
            for(let i = 2; i < l.length; i++) {
                weight += " " + l[i];
            }
            addEdge(nodes.findIndex((node) => node.label == l[0]), nodes.findIndex((node) => node.label == l[1]), weight);
        }
    })
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

    if(keyCode == 86) {
        mode = "VALUES";
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
                    console.log("ARESTA " + i + " FOI CLICADA!");
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
    const graphDataTextArea = document.getElementsByTagName('textarea')[0];

    let l = graphDataTextArea.value.split('\n');
    l = l.filter(line => {
        return !line.split(' ').includes(nodes[index].label)
    }); // reescreve o texto tirando as linhas que envolvem o nó a ser deletado

    graphDataTextArea.value = l.join('\n');

    // conserta os indices das arestas afetadas pela deleção
    edges = edges.filter(edge => (edge.source !== index && edge.destination !== index));
    edges.forEach(edge => {
        if(edge.source > index) edge.source--;
        if(edge.destination > index) edge.destination--;
    });
    nodes.splice(index, 1);
    return;
}

function deleteEdge(index) {

    const graphDataTextArea = document.getElementsByTagName('textarea')[0];
    let lines = graphDataTextArea.value.split('\n');

    let lineToDelete = -1;
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i].split(' ');
        if(line.length >= 2) {
            if((line[0] == nodes[edges[index].source].label && line[1] == nodes[edges[index].destination].label) || (line[0] == nodes[edges[index].destination].label && line[1] == nodes[edges[index].source].label)) {
                lineToDelete = i;
                break;
            }
        }
    }

    console.log(lineToDelete);

    if(lineToDelete != -1) {
        lines.splice(lineToDelete, 1);
    }

    graphDataTextArea.value = lines.join('\n');
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
    

    nodes.push(new Node(label, x, y));
    return;
}

function addEdge(source, destination, weight, directed=false) {
    for(let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        if(edge.source === source && edge.destination === destination) return;
        if(!directed && edge.source === edge.destination && edge.destination === edge.source) return; 
    }

    edges.push(new Edge(source, destination, weight, directed));
}


