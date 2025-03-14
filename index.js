function changeModeUI() {
    const modeUI = document.querySelector('#current-mode');
    modeUI.innerText = mode.toString();
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

const infoBtn = document.querySelector("#info-btn");
infoBtn.addEventListener('mouseover', () => {
    const infoModal = document.querySelector("#info-modal");
    infoModal.hidden = false;
})

infoBtn.addEventListener('mouseout', () => {
    const infoModal = document.querySelector("#info-modal");
    infoModal.hidden = true;
})