((d, w) => {
    d.addEventListener('DOMContentLoaded', () =>{
        const grid = d.querySelector('.grid');
        let squares = Array.from(d.querySelectorAll('.grid div'));
        let colordisplaySquares = Array.from(d.querySelectorAll('.display-grid div'));
        const scoreDisplay = d.getElementById("score");
        const startBtn = d.getElementById("start-btn");
        const width = 10;
        let nextRandom = 0;
        let timerId
        let score = 0;
        const colors = [
            'blue',
            'orange',
            'red',
            'green',
            'purple',
            'yellow',
            'lightblue'
        ];

        // The Tetrominos

        const jTetromino = [
            [1, width + 1, width * 2 + 1, 2],
            [width, width + 1, width + 2, width * 2 + 2],
            [1, width + 1, width * 2 + 1, width * 2],
            [width, width * 2, width * 2 + 1, width * 2 + 2]
        ]

        const lTetromino = [
            [1, width + 1, width * 2 + 1, width * 2 + 2],
            [width, width + 1, width + 2, 2],
            [1, 2, width + 2, width * 2 + 2],
            [width, width + 1, width + 2, width * 2]
        ]

        const zTetromino = [
            [width + 1, width + 2, width * 2, width * 2 + 1],
            [0, width, width + 1, width * 2 + 1],
            [width + 1, width + 2, width * 2, width * 2 + 1],
            [0, width, width + 1, width * 2 + 1],
        ]

        const sTetromino = [
            [1, 2, width, width + 1],
            [1, width + 1, width + 2, width * 2 + 2],
            [1, 2, width, width + 1],
            [1, width + 1, width + 2, width * 2 + 2],
        ]

        const tTetromino = [
            [1, width, width + 1, width + 2],
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

        const theTetrominoes = [jTetromino, lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino];

        let currentPosition = 4;
        let currentRotation = 0;

        //randomly select a tetromino (index 0 - 6)
        let random = Math.floor(Math.random() * theTetrominoes.length);

        // selects a random tetromino and the first rotation of that tetromino
        let current = theTetrominoes[random][currentRotation];

        // draw the tetromino
        let draw = () => {
            current.forEach(index => {
                squares[currentPosition + index].classList.add('tetromino');
                squares[currentPosition + index].style.backgroundColor = colors[random];
            });
        }

        // undraw the tetromino
        let undraw = () => {
            current.forEach(index => {
                squares[currentPosition + index].classList.remove('tetromino');
                squares[currentPosition + index].style.backgroundColor = '';
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
        //timerId = setInterval(moveDown, 500);

        // assign functions to keyCodes
        let control = (e) => {
            if (e.keyCode === 37) { // left arrow
                moveLeft();
            } else if (e.keyCode === 38) { // up arrow
                rotate();
            } else if (e.keyCode === 39) { // right arrow
                moveRight();
            } else if (e.keyCode === 40) { // down arrow
                moveDown();
            }
        }

        d.addEventListener('keyup', control); // event listener for key-up
        
        // freeze function
        let freeze = () => {
            // if the tetromino overlaps with a taken div
            if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
                // mark div's of the tetromino as taken
                current.forEach(index => squares[currentPosition + index].classList.add('taken'));
                //start a new tetronimo falling
                random = nextRandom;
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                current = theTetrominoes[random][currentRotation];
                currentPosition = 4;
                draw();
                displayShape();
                addScore();
                gameOver();
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

        // rotate the tetromino
        let rotate = () => {
            undraw();
            currentRotation += 1;
            if (currentRotation === current.length) { // if current rotation gets to 4, set back to 0
                currentRotation = 0;
            }
            current = theTetrominoes[random][currentRotation];
            draw();
        }

        // show up-next tetromino in mini-grid display
        const displaySquares = d.querySelectorAll('.mini-grid div')
        const displayWidth = 4;
        let displayIndex = 0; 
        

        const upNextTetrominoes = [
            [1, displayWidth + 1, displayWidth * 2 + 1, 2],
            [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],
            [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1],
            [1, 2, displayWidth, displayWidth + 1],
            [2, displayWidth, displayWidth + 1, displayWidth + 2],
            [0, 1, displayWidth, displayWidth + 1],
            [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
        ];
        
        // display the shape in the mini-grid display
        let displayShape = () => {
            displaySquares.forEach(square => {
                square.classList.remove('tetromino')
                square.style.backgroundColor = '';
            })
            upNextTetrominoes[nextRandom].forEach(index => {
                displaySquares[displayIndex + index].classList.add('tetromino');
                displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
            })
        }


        const colorDispTetrominoes = [
            [1, width + 1, width * 2 + 1, 2],
            [1, width + 1, width * 2 + 1, width * 2 + 2],
            [width + 1, width + 2, width * 2, width * 2 + 1],
            [1, 2, width, width + 1],
            [2, width, width + 1, width + 2],
            [0, 1, width, width + 1],
            [1, width + 1, width * 2 + 1, width * 3 + 1]
        ];

        let displayPosition = 2;

        // draw display grid tetrominos
        let drawDisplay = () => {
            for (let i = 0; i < colorDispTetrominoes.length; i += 1) {
                colorDispTetrominoes[i].forEach(index => {
                    console.log(i, index);
                    console.log(displayPosition + index)
                    colordisplaySquares[displayPosition + index].classList.add('tetromino');
                    colordisplaySquares[displayPosition + index].style.backgroundColor = colors[i];
                });
                displayPosition += width * 3 ; // move down the grid
            }
        }

        drawDisplay();

        // add functionality to the Start/Pause button
        startBtn.addEventListener('click', () => {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            } else {
                draw();
                timerId = setInterval(moveDown, 1000);
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                displayShape();
            }
        })

        // add scoring
        let addScore = () => {
            for (let i = 0; i < 199; i += width) {
                const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i +9];
                
                if (row.every(index => squares[index].classList.contains('taken'))) {
                    score += 10;
                    scoreDisplay.textContent = score;
                    row.forEach(index => {
                        squares[index].classList.remove('taken');
                        squares[index].classList.remove('tetromino');
                        squares[index].style.backgroundColor = '';
                    });
                    const squaresRemoved = squares.splice(i, width);
                    squares = squaresRemoved.concat(squares);
                    squares.forEach(cell => grid.appendChild(cell));
                }
            }
        }

        // game over
        let gameOver = () => {
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                scoreDisplay.textContent = 'Game OVER. Total Score:' + score;
                clearInterval(timerId);
            }
        }


    })
}) (document, window);
