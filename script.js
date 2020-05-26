document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-button");
    const width = 10;
    let nextRandNum = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width * 2, width * 3],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];
        
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];
        
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];
        
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    
    //randomly select a tetromino
    let randNum = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[randNum][currentRotation];

    //draw the first rotation
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add("tetromino");
            squares[currentPosition + index].style.backgroundColor = colors[randNum];
        });
    };

    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove("tetromino");
            squares[currentPosition + index].style.backgroundColor = "";
        });
    };

    //controls
    function control(e) {
        switch (e.keyCode) {
            case 37:
                moveLeft()
                break;
            
            case 39:
                moveRight()
                break;
            
            case 38:
                rotateTetromino()
                break;

            case 40:
                moveDown()
                break;
        }

    };
    document.addEventListener("keydown", control)
    
    //move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
            current.forEach(index => squares[currentPosition + index].classList.add("taken"));
            randNum = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[randNum][currentRotation];
            nextRandNum = Math.floor(Math.random() * theTetrominoes.length);
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        };
    };

    //move left, unless too far left to do so
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1
        };

        draw();
    };

    //move right, unless too far right to do so
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1
        };

        draw();
    };

    //rotate the tetromino
    function rotateTetromino() {
        undraw();
        currentRotation ++;

        //return to first rotation at the end of cycle
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[randNum][currentRotation]

        draw();
    };

    // show next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    const displayIndex = 0;

    //first rotation for each shape
    const upNextTetrominoes = [
        //l Tetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        //z Tetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        //tTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        //oTetromino
        [0, 1, displayWidth, displayWidth + 1],
        //iTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]//iTetromino
    ];

    //show shape in mini-grid
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove("tetromino");
            square.style.backgroundColor = "";
        });
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add("tetromino");
            displaySquares[displayIndex + index].style.backgroundColor = colors[randNum];
        });
    };

    //start/pause button functionality
    startBtn.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandNum = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    })

    //score/clear line
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if(row.every(index => squares[index].classList.contains("taken"))) {
                //increase score
                score += 10;
                scoreDisplay.innerHTML = score;

                //clear line
                row.forEach(index => {
                    squares[index].classList.remove("taken", "tetromino");
                    squares[index].style.backgroundColor = "";

                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))

            }
        }
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            scoreDisplay.innerHTML = end;
            clearInterval(timerId);
        }
    }

});