'use strict';

// grid initialization
const gameGrid = document.querySelector('.game-container__grid');
const width = 10;
const height = 20;

let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * tetrominoes.length);
let currentIdentifier = tetrominoes[random];
let current = currentIdentifier.rotation[currentRotation];

const title = document.querySelector('#title');
const points = document.querySelector('#points');
const tryAgain = document.querySelector('#reload');

//create 200 divs inside the game container
for (let i = 0; i < 210; i++) {
    const stdDiv = document.createElement('div');
    stdDiv.classList.add('game-container__square');
    if (i >= 200) {
        stdDiv.classList.add('set');
    }
    gameGrid.appendChild(stdDiv);
}

//grab the 200 squares in the array in a manageable array
const squares = Array.from(document.querySelectorAll('.game-container__square'));

//variable that manages how to render the tetrominoes in the grid
let tetrominoRender = [];
let tetrominoRenderIndex = [];

//helper function to change the tetrominoRender if the tetromino is I which occupies an area of 16 instead of 9
function renderHelper() {
    // there is a problem in the render as the first line may be blank if the object is in rotation 0 and the first 3 pixels are empty, basically drawing the whole space of 6 instead of just the required fields
    if (currentIdentifier.tetromino === 'i') {
        tetrominoRenderIndex = [
            currentPosition,
            currentPosition + 1,
            currentPosition + 2,
            currentPosition + 3,
            currentPosition + width,
            currentPosition + width + 1,
            currentPosition + width + 2,
            currentPosition + width + 3,
            currentPosition + width * 2,
            currentPosition + width * 2 + 1,
            currentPosition + width * 2 + 2,
            currentPosition + width * 2 + 3,
            currentPosition + width * 3,
            currentPosition + width * 3 + 1,
            currentPosition + width * 3 + 2,
            currentPosition + width * 3 + 3
        ];
        tetrominoRender = [
            squares[tetrominoRenderIndex[0]],
            squares[tetrominoRenderIndex[1]],
            squares[tetrominoRenderIndex[2]],
            squares[tetrominoRenderIndex[3]],
            squares[tetrominoRenderIndex[4]],
            squares[tetrominoRenderIndex[5]],
            squares[tetrominoRenderIndex[6]],
            squares[tetrominoRenderIndex[7]],
            squares[tetrominoRenderIndex[8]],
            squares[tetrominoRenderIndex[9]],
            squares[tetrominoRenderIndex[10]],
            squares[tetrominoRenderIndex[11]],
            squares[tetrominoRenderIndex[12]],
            squares[tetrominoRenderIndex[13]],
            squares[tetrominoRenderIndex[14]],
            squares[tetrominoRenderIndex[15]]
        ];
    } else {
        tetrominoRenderIndex = [
            currentPosition,
            currentPosition + 1,
            currentPosition + 2,
            currentPosition + width,
            currentPosition + width + 1,
            currentPosition + width + 2,
            currentPosition + width * 2,
            currentPosition + width * 2 + 1,
            currentPosition + width * 2 + 2
        ];
        tetrominoRender = [
            squares[tetrominoRenderIndex[0]],
            squares[tetrominoRenderIndex[1]],
            squares[tetrominoRenderIndex[2]],
            squares[tetrominoRenderIndex[3]],
            squares[tetrominoRenderIndex[4]],
            squares[tetrominoRenderIndex[5]],
            squares[tetrominoRenderIndex[6]],
            squares[tetrominoRenderIndex[7]],
            squares[tetrominoRenderIndex[8]]
        ];
    }
}

function dropTetromino() {
    random = Math.floor(Math.random() * tetrominoes.length);
    currentIdentifier = tetrominoes[random];
    currentPosition = 4;
    currentRotation = 0;
    current = currentIdentifier.rotation[currentRotation];
}

let tetrominoDraw;
let tetrominoDrawIndex;

function draw() {
    renderHelper();
    tetrominoDraw = [];
    tetrominoDrawIndex = [];
    for (let tetro in tetrominoRender) {
        if (current[tetro] === 1) {
            tetrominoRender[tetro].classList.add('painted');
            tetrominoDraw.push(tetrominoRender[tetro]);
            tetrominoDrawIndex.push(tetrominoRenderIndex[tetro]);
        }
    }
}

function undraw() {
    renderHelper();
    for (let tetro in tetrominoRender) {
        if (current[tetro] === 1) {
            tetrominoRender[tetro].classList.remove('painted');
        }
    }
}

function gravity() {
    undraw();
    currentPosition += width;
    draw();
    gameOver();
    boundary();
}

function gameOver() {
    if (
        tetrominoDrawIndex.some((tetro) => squares[tetro].classList.contains('set')) &&
        currentPosition < 20
    ) {
        clearInterval(game);
        title.textContent = 'GAME OVER';
        title.style.fontSize = '3em';
        title.style.marginBottom = '1em';
    }
}

function boundary() {
    if (
        tetrominoDrawIndex.some(
            (tetro) =>
                squares[tetro + width].classList.contains('set') ||
                squares[tetro].classList.contains('set')
        )
    ) {
        tetrominoDraw.forEach((tetro) => {
            tetro.classList.add('set');
            tetro.classList.remove('painted');
        });
        clearLine();
        dropTetromino();
    } else return false;
}

//checks the key code pressed on the event listener
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}

function moveDown() {
    if (!tetrominoDrawIndex.some((tetro) => squares[tetro + width].classList.contains('set'))) {
        if (!boundary()) {
            undraw();
            currentPosition += width;
            draw();
            boundary();
            updatePoints(2);
        } else boundary();
    }
}

//helper function to check if the drawn tetrominoe is ocupying both edges of the grid, if draws the last rotation, a little dirty but works
function returnDraw(sign) {
    let execute;
    tetrominoDrawIndex.forEach((tetro, index) => {
        if (String(tetro).endsWith('0') || String(tetro).endsWith('9')) {
            let otherValue = String(tetrominoDrawIndex[index]).endsWith('0') ? 9 : 0;
            for (let i = index++; i < tetrominoDrawIndex.length; i++) {
                if (String(tetrominoDrawIndex[i]).endsWith(otherValue)) {
                    execute = true;
                }
            }
        }
    });
    if (execute) {
        undraw();
        currentRotation = sign === 'asc' ? currentRotation - 1 : currentRotation + 1;
        current = currentIdentifier.rotation[currentRotation];
        draw();
    }
}

let currentRotationStatus = 'asc';
function rotate() {
    switch (currentRotation) {
        case 3:
            currentRotationStatus = 'desc';
            break;
        case 0:
            currentRotationStatus = 'asc';
            break;
    }
    switch (currentRotationStatus) {
        case 'asc':
            undraw();
            currentRotation++;
            current = currentIdentifier.rotation[currentRotation];
            draw();
            returnDraw('asc');
            break;
        case 'desc':
            undraw();
            currentRotation--;
            current = currentIdentifier.rotation[currentRotation];
            draw();
            returnDraw('desc');
            break;
    }
}

function moveLeft() {
    if (
        !tetrominoDrawIndex.some((tetro) => {
            return (
                squares[tetro - 1 + width].classList.contains('set') ||
                squares[tetro - 1].classList.contains('set')
            );
        })
    ) {
        if (!tetrominoDrawIndex.some((tetro) => String(tetro).endsWith('0'))) {
            undraw();
            currentPosition--;
            draw();
        }
    }
}

function moveRight() {
    if (
        !tetrominoDrawIndex.some((tetro) => {
            return (
                squares[tetro + 1 + width].classList.contains('set') ||
                squares[tetro + 1].classList.contains('set')
            );
        })
    ) {
        if (!tetrominoDrawIndex.some((tetro) => String(tetro).endsWith('9'))) {
            undraw();
            currentPosition++;
            draw();
        }
    }
}

// create subarrays of lines to use with the clearLine function
let lines = [];
let linesHelper = [];

for (let i = 0; i < 200; i++) {
    if (String(i).endsWith('0')) {
        linesHelper = [];
        linesHelper.push(squares[i]);
    } else if (String(i).endsWith('9')) {
        linesHelper.push(squares[i]);
        lines.push(linesHelper);
    } else {
        linesHelper.push(squares[i]);
    }
}
let score = 0;

function updatePoints(point) {
    score += point;
    points.textContent = String(score);
}

// sometimes it leaves an extra pixel
function clearLine() {
    lines.forEach((line, lineIndex) => {
        if (line.every((square) => square.classList.contains('set'))) {
            line.forEach((square) => {
                square.classList.remove('set');
            });
            updatePoints(100);
            for (let i = lineIndex - 1; i >= 0; i--) {
                lines[i].forEach((square, squareIndex) => {
                    if (square.classList.contains('set')) {
                        square.classList.remove('set');
                        lines[i + 1][squareIndex].classList.add('set');
                    }
                });
            }
        }
    });
}

document.addEventListener('keydown', control);

tryAgain.addEventListener('click', reload);

function reload() {
    clearInterval(game);
    squares.forEach((square) => {
        square.classList.remove('painted');
    });
    for (let i = 0; i < 200; i++) {
        squares[i].classList.remove('set');
    }
    score = 0;
    updatePoints(0);
    startGame();
}

let time = 300;
let game;
function startGame() {
    game = setInterval(gravity, time);
    currentPosition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * tetrominoes.length);
    currentIdentifier = tetrominoes[random];
    current = currentIdentifier.rotation[currentRotation];
}

startGame();
