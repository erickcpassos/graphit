function changeModeUI() {
    const modeUI = document.querySelector('#current-mode');
    modeUI.innerText = mode.toString();
}

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