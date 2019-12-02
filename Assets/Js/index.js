const body = document.getElementById('body');
const startButton = document.getElementById('start');
const generation = document.getElementById('generation');
let generationCount = 0; 
let start = false;

class Board{

    constructor(height, width){
        this.height = height
        this.width = width
    }

    define = () => {
        for(var x = 1; x <= this.height; x++){
            let tr = document.createElement("tr");
            body.appendChild(tr);
            for(var y = 1; y <= this.width; y++){
                let td = document.createElement("td");
                this.setA(td, [['id', `${x}:${y}`] ,['class', 'td'], ['style', 'background-color: white;']]);
                let lastTr = body.lastChild;
                lastTr.appendChild(td);
            }
        }
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
}

const changeColor = (e) => {
    if(start){
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

document.addEventListener('click', changeColor);
startButton.addEventListener('click', startGame);

const board = new Board(60, 50);
board.define()
generation.innerHTML = `Generation number : ${generationCount}`;
