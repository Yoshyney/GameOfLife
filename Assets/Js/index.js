'use strict'

const body = document.getElementById('body');
const startButton = document.getElementById('start');
const generation = document.getElementById('generation');
const table_ = document.getElementById('table');
const height = document.getElementById("height");
const width = document.getElementById("width");
const form = document.getElementById('form');
const choice = document.getElementById('choice')
const display = document.getElementById('display')
let generationCount = 0; 
let start = false;

class Board{

    define = () => {
        let table = document.createElement('table');
        for(var x = 1; x <= this.height; x++){
            let tr = document.createElement("tr");
            body.appendChild(tr);
            for(var y = 1; y <= this.width; y++){
                let td = document.createElement("td");
                this.setA(td, [['id', `${x}:${y}`] ,['class', 'td'], ['style', 'background-color: white;']]);
                var lastTr = body.lastChild;
                lastTr.appendChild(td);
            }
            table.appendChild(lastTr);
        }
        table_.appendChild(table);
    }

    setA = (element, array) => {
        array.forEach((a) => {
            element.setAttribute(a[0], a[1]);
        });
    }

    play = (elements) => {
        let array = [];
        for(let element of elements){
            let result = this.rule(element)
            if(result){
                array.push(result);
            }
        }
        this.replaceTile(array);
    };

    replaceTile = (elements) => {
        for(let element of elements){
            let node = document.getElementById(element.getAttribute('id'));
            node.style.backgroundColor = element.style.backgroundColor;
        }
    }

    rule = (element) => {
        let pos = element.getAttribute('id').split(':');
        let h = parseInt(pos[0], 10);
        let w = parseInt(pos[1], 10);
        let color = element.style.backgroundColor;
        var newElement =  element.cloneNode(true);
        if(color == 'black'){
            let count = this.countTile(h, w, color)
            if(count > 3 || count < 2){
                newElement.style.backgroundColor = 'white';
                return newElement;
            }
        }else{
            let count = this.countTile(h, w, color)
            if(count == 3){
                newElement.style.backgroundColor = 'black';
                return newElement;
            }
        }
    }

    countTile = (h, w, color) => {
        let count = 0;
        for(let x = h - 1; x <= h + 1; x++){
            for(let y = w - 1; y <= w + 1; y++){
                if(!(x == h && y == w)){
                    let id = document.getElementById(`${x}:${y}`);
                    if(id != null && id.style.backgroundColor == 'black'){
                        count++;
                    }
                }
            }
        }
        return count;
    }

    setHeight = (x) => {
        this.height = x
    }

    setWidth = (x) => {
        this.width = x
    }

}

const launch = (x, y) => {
    generation.innerHTML = `Generation number : ${generationCount}`;
    board.setHeight(y);
    board.setWidth(x);
    board.define()
    document.addEventListener('click', changeColor);
    startButton.addEventListener('click', startGame);
}

const changeColor = (e) => {
    let val = e.target
    if(start || val.tagName != 'TD'){
        return;
    }
    let colorTile = e.path[0].style.backgroundColor;
    if(colorTile == 'white'){
        colorTile = 'black';
    }else{
        colorTile = 'white';
    }
    e.path[0].style.backgroundColor = colorTile;
};

const startGame = (e) => {
    if(!start){
        let elements = document.getElementsByClassName('td');
        start = true;
        setInterval( () => {
            generation.innerHTML = `Generation number : ${generationCount}`;
            board.play(elements);
            generationCount++;
        }, 100)
    }
}

const getSize = (e) => {
    e.preventDefault();
    let h = parseInt(height.value, 10)
    let w = parseInt(width.value, 10)
    if(typeof w == 'number' && typeof h == 'number' && w <= 100 && h <= 100 && w >= 1 && h >= 1){
        choice.className = "d-none"
        display.className = "d-block"
        launch(w, h);
        return true
    }else{
        alert('There is an error !')        
    }
}

const board = new Board();
form.addEventListener('submit', getSize)