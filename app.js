((d, w) => {
d.addEventListener('DOMContentLoaded', () =>{
    const grid = d.querySelector('.grid');
    let squares = Array.from(d.querySelectorAll('.grid div'));
    const scoreDisplay = d.getElementById("score");
    const startBtn = d.getElementById("start-btn");
    const width = 10;

    // The Tetrominos

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
    ]

    const tTetromino = [
        [2, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a tetromino (1 - 5)
    let random = Math.floor(Math.random() * theTetrominoes.length);
    
    // selects a random tetromino and the first rotation of that tetromino
    let current = theTetrominoes[random][currentRotation];

    // draw the tetromino
    let draw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    // undraw the tetromino
    let undraw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }
    
    // make the tetrominos move down the page
    let moveDown = () => {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // calls this function every 1000ms = 1sec
    timerId = setInterval(moveDown, 500);

    // assign functions to keyCodes
    let control = (e) => {
        if (e.keyCode === 37) { // left arrow
            moveLeft();
        } else if (e.keyCode === 38) {
            //rotate
        } else if (e.keyCode === 39) { // right arrow
            moveRight();
        }
    }
    d.addEventListener('keyup', control); 
    
    // freeze function
    let freeze = () => {
        // if the tetromino overlaps with a taken div
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            // mark div's of the tetromino as taken
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetronimo falling
            let random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        }
    } 

    // move the tetromino left, unless it is at the edge or it's blocked
    let moveLeft = () => {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    // move the tetromino Right, unless it is at the edge or it's blocked
    let moveRight = () => {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }






})
}) (document, window);
