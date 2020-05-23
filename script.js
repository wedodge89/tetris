document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-button");
    const width = 10;
    
    // The Tetrominoes
     const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width * 2, width * 2 + 2],
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
    console.log(randNum);
    
    let current = theTetrominoes[randNum][currentRotation];

    //draw the first rotation
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add("tetromino")
        });
    };

    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove("tetromino")
        });
    };

    //set timer for move down
    timerId = setInterval(moveDown, 1000);

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

            // case 40:
            //     moveDown()
            //     break;
        }
        
        // if(e.keyCode === 37) {
        //     moveLeft();
        // };
    };
    document.addEventListener("keyup", control)
    
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
            currentPosition = 4;
            draw();
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
    }

});