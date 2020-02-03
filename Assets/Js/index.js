const body = document.getElementById('body');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const generation = document.getElementById('generation');
const table_ = document.getElementById('table');
const height = document.getElementById("height");
const width = document.getElementById("width");
const form = document.getElementById('form');
const choice = document.getElementById('choice')
const display = document.getElementById('display')
const max = document.getElementById('max');
const min = document.getElementById('min');
const avg = document.getElementById('avg');
const maxGen = document.getElementById('maxGen');
const minGen = document.getElementById('minGen');
const random = document.getElementById('random');
let generationCount = 0; 
let start = false;
let interval;
let total = 0;

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
        this.count = 0;
        let array = [];
        for(let element of elements){
            let result = this.rule(element)
            if(result){
                array.push(result);
            }
        }
        this.replaceTile(array);
        return this.count;
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
            }else{
                this.count++
            }
        }else{
            let count = this.countTile(h, w, color)
            if(count == 3){
                newElement.style.backgroundColor = 'black';
                this.count++
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

    randomGen(n){
        this.clear();
        for(let x = 0; x < n ; x++){
            while(true){
                let w = Math.floor(Math.random() * Math.floor(this.width) + 1);
                let h = Math.floor(Math.random() * Math.floor(this.height) + 1);
                console.log(h, w)
                let e = document.getElementById(`${h}:${w}`);
                if(e.style.backgroundColor == 'white'){
                    e.style.backgroundColor = 'black';
                    break;
                }
            }
        }
    }

    clear = () => {
        let table = table_.firstChild;
        let elements = document.getElementsByClassName('td');
        for(let element of elements){
            element.style.backgroundColor = 'white';
        }
    }

}

const launch = (x, y) => {
    generation.innerHTML = `Generation number : ${generationCount}`;
    board.setHeight(y);
    board.setWidth(x);
    board.define()
    document.addEventListener('click', changeColor);
    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
    resetButton.addEventListener('click', resetGame);
    random.addEventListener('click', randomGeneration);
}

const randomGeneration = (e) => {
    let m = board.height * board.width;
    while(true){
        let  result = prompt("Choose the number of tile you want to color max is " + m.toString() , "");
        if (result == null || result == "") {
            break;
            return false;
        } else {
            if(parseInt(result, 10) <= m){
                board.randomGen(parseInt(result, 10));
                break;
            }
        }
    }
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
        stopButton.className = stopButton.className.replace('d-none', '')
        resetButton.className = resetButton.className.replace('d-none', '')
        if(random.className.indexOf('d-none') == -1){
            random.className = random.className + ' d-none';
        }
        let elements = document.getElementsByClassName('td');
        start = true;
        interval = setInterval( () => {
            generation.innerHTML = `Generation number : ${generationCount}`;
            let result = board.play(elements);
            generationCount++;
            changeValue(result)
            if(result == 0){

            }
        }, 100)
    }
}

const stopGame = (e) => {
    if(start){
        start = false
        clearInterval(interval)
        stopButton.className = stopButton.className + ' d-none'
    }
}

const resetGame = (e) => {
        if(stopButton.className.indexOf('d-none') == -1){
            clearInterval(interval)
            stopButton.className = stopButton.className + ' d-none'
            start = false
        }
        resetButton.className = resetButton.className + ' d-none'
        random.className = random.className.replace('d-none', '')
        avg.innerHTML = '0';
        min.innerHTML = '0';
        max.innerHTML = '0';
        maxGen.innerHTML = '0';
        minGen.innerHTML = '0';
        total = 0;
        generationCount = 0;
        generation.innerHTML = `Generation number : ${generationCount}`;
        board.clear();
}

const changeValue = (a) => {
    if(a > parseInt(max.innerHTML, 10)){
        max.innerHTML = a
        maxGen.innerHTML = generationCount
    }
    if(a < parseInt(min.innerHTML, 10) || generationCount == 1){
        min.innerHTML = a
        minGen.innerHTML = generationCount
    }
    total = total + a
    avg.innerHTML = Math.floor( total / generationCount);
}

const getSize = (e) => {
    e.preventDefault();
    let h = parseInt(height.value, 10)
    let w = parseInt(width.value, 10)
    if(typeof w == 'number' && typeof h == 'number' && w <= 70 && h <= 70 && w >= 1 && h >= 1){
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