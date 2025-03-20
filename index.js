const moveBtn = document.getElementById('move-btn');
const nodeBtn = document.getElementById('node-btn');
const edgeBtn = document.getElementById('edge-btn');
const deleteBtn = document.getElementById('delete-btn');
const drawBtn = document.getElementById('draw-btn');


const UIBtns = [moveBtn, nodeBtn, edgeBtn, deleteBtn, drawBtn];

function resetUIBtns() {
    UIBtns.forEach(btn => {
        btn.classList.remove('selected');
    })
}

function changeModeUI() {
    const modeUI = document.querySelector('#current-mode');
    modeUI.innerText = mode.toString();
    resetUIBtns();
    if(mode.toString() === "MOVE") {
        moveBtn.classList.add('selected');
    } else if(mode.toString() === "NODE") {
        nodeBtn.classList.add('selected');
    } else if(mode.toString() === "EDGE") {
        edgeBtn.classList.add('selected');
    } else if(mode.toString() === "DELETE") {
        deleteBtn.classList.add('selected');
    } else if(mode.toString() === "DRAW") {
        drawBtn.classList.add('selected');
    }
}

// const updateEvent = new Event('input');
// const textareaUI = document.getElementsByTagName('textarea')[0];
// textareaUI.addEventListener('input', () => {console.log("saiu o evento"); updateUI()});

function updateColorList(list) {
    /*
        Re-renderiza a lista de cores com base em um array "list"
    */
    const listUI = document.querySelector("color-list");
    list.forEach(colorHex => {
        const colorSquare = document.createElement('span');
        // TODO
    })
}

function updateUI() {
    displayEdgeListUI(edges);
}

function displayEdgeListUI(edgeList) {
    const container = document.querySelector("#edge-list");
    container.textContent = '';
    edgeList.forEach((edge, index) => {
        container.appendChild(createEdgeListItem(edge, index));
    })
    return;
}   

function createEdgeListItem(edge, index) {
    const outer = document.createElement('div');
    const p = document.createElement('span');
    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = '&#10005;'
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        deleteEdge(index);
    })
    p.innerHTML = `[${nodes[edge.source].label}, ${nodes[edge.destination].label}]`;
    outer.appendChild(p);
    outer.appendChild(deleteBtn);
    return outer;
}

function saveCanvasAsPNG() {
    saveCanvas(canvas, "myGraph", "png");
    return;
}


moveBtn.addEventListener('click', () => {
    mode = "MOVE";
    changeModeUI();
});

nodeBtn.addEventListener('click', () => {
    mode = "NODE";
    changeModeUI();

});

edgeBtn.addEventListener('click', () => {
    mode = "EDGE";
    changeModeUI();
});

deleteBtn.addEventListener('click', () => {
    mode = "DELETE";
    changeModeUI();
});

drawBtn.addEventListener('click', () => {
    mode = "DRAW";
    changeModeUI();
});



let tutorialPage = parseInt(localStorage.getItem("tutorialPage"));
const tutorialPagesHTML = document.getElementsByClassName('tutorial-page');
const stageDisplayHTML = document.getElementsByClassName('tutorial-stage-square');

function showCorrectTutorialPage() {

    if(tutorialPage >= 0 && tutorialPage < tutorialPagesHTML.length) document.querySelector('#tutorial-modal').style.display = 'block';

    if(tutorialPage >= tutorialPagesHTML.length) {
        document.querySelector('#tutorial-modal').style.display = 'none';
    }

    for(let i = 0; i < tutorialPagesHTML.length; i++) {
        if(tutorialPage == i) {
            tutorialPagesHTML[i].style.display = 'block';
            stageDisplayHTML[i].classList.add('selected');
        }
        else {
            tutorialPagesHTML[i].style.display = 'none';
            stageDisplayHTML[i].classList.remove('selected');
        }
            
    }

    localStorage.setItem("tutorialPage", tutorialPage);

}

const infoBtn = document.querySelector("#info-btn");
infoBtn.addEventListener('click', () => {
    tutorialPage = 0;
    showCorrectTutorialPage();
})


document.querySelector('#tutorial-next').addEventListener('click', () => {
    tutorialPage += 1;
    showCorrectTutorialPage();
})

document.querySelector('#tutorial-back').addEventListener('click', () => {
    if(tutorialPage > 0) tutorialPage -= 1;
    
    showCorrectTutorialPage();
})

showCorrectTutorialPage();
