// ======================== UI elements ======================== //

const infoText = document.getElementById("info-text");

const controlButtons = document.getElementById("control-buttons");
const symbolButtons = document.querySelectorAll(".symbol-btn");
const startBtn = document.getElementById("start-btn");

const board = document.getElementById("board");
const cellsHTML = document.querySelectorAll("[data-cell]");




/**
 * Object for managing the state of the app.
 */
const STATE = {
    game: null,
    gameIsActive: false,
    userSymbol: "X",       // Must be initialized when game starts
    computerSymbol: "O",   // Must be initialized when game starts
};


/**
 * Class used to handle settings for the game.
 */
class Settings
{
    static updatePlayersSymbol(userSymbol) {
        STATE.userSymbol = userSymbol;
        if (STATE.userSymbol == "X") {
            STATE.computerSymbol = "O";
        } else {
            STATE.computerSymbol = "X";
        }
    }
}

/**
* Class used to handle game operations and game state.
*/
class Game
{
    // Initializes a game with default values
    constructor(
        board =  [
            [null, null, null],
            [null, null, null],
            [null, null, null],
       ] ,
        symbolsPlaced = 0,
        playersTurn = "user",
        winner = null,
        winningcellsHTML = ["-1.-1", "-1.-1", "-1.-1"]
    ) {
        this.board = board;
        this.symbolsPlaced = symbolsPlaced;
        this.playersTurn = playersTurn;
        this.winner = winner;
        this.winningcellsHTML = winningcellsHTML;   // Format to store winning cellsHTML for easy access in UI.
    }

    startGame() {
        UI.clearBoard();
        STATE.gameIsActive = true;
        UI.hideControlButtons();
        this.playersTurn = this.getStartingPlayer();
        console.log(this.playersTurn);
        this.assignSymbols();
        this.handleMove();
    }

    assignSymbols() {
        if (symbolButtons[0].classList.contains("selected")) {
            STATE.userSymbol = "X";
            STATE.computerSymbol = "O";
        } else {
            STATE.userSymbol = "O";
            STATE.computerSymbol = "X";
        }
    }

    getStartingPlayer() {
        const number = Math.floor((Math.random() * 2) + 1);
        if (number == 1) {
            infoText.textContent = "You start";
            return "user";
        } else {
            infoText.textContent = "The computer starts";
            return "computer";
        }
    }

    handleMove() {
        if (!STATE.gameIsActive) {
            this.gameOver();
            return;
        }

        if (this.playersTurn == "user") {
            infoText.textContent = "Your turn";
        } else if (this.playersTurn == "computer") {
            infoText.textContent = "The computer's turn";
            this.makeComputerMove();
        } else {
            console.log("Something went wrong");
            alert("Something went wrong");
        }

        this.symbolsPlaced++;
    }

    handlePlayerOption(row, col, clickedCell) {
        console.log(this.cellIsEmpty(row, col));
        console.log(STATE.userSymbol);
 
        if (!this.cellIsEmpty(row, col)) {
            UI.markCellAsTaken(clickedCell);
        } else {
            clickedCell.textContent = STATE.userSymbol;
            this.board[row][col] = STATE.userSymbol;
            // Check for win / draw
            STATE.game.playersTurn = "computer";
            this.checkForGameOver();
            STATE.game.handleMove();
        }
    }

    makeComputerMove() {
        if (!STATE.gameIsActive) {
            return;
        }

        let row = 0;
        let col = 0;

        while (true) {
            row = Math.floor(Math.random() * 3);
            col = Math.floor(Math.random() * 3);

            if (this.cellIsEmpty(row, col)) {
                setTimeout(() => {
                    STATE.game.board[row][col] = STATE.computerSymbol;
                    UI.makeComputerChoice(row, col);
                    this.checkForGameOver();
                    STATE.game.playersTurn = "user";
                    STATE.game.handleMove(); 
                }, 100);  
                // }, Math.floor((Math.random() * 2000) + 1000));

                return; 
            }
        }
    }

    cellIsEmpty(row, col) {
        return STATE.game.board[row][col] == null;
    }

    checkForGameOver() {
        // Only check for possible win if 5 or more moves has been made
        if (this.symbolsPlaced < 5) {
            return;
        }

        if (this.winner == null) {
            this.checkRows();
        }

        if (this.winner == null) {
            this.checkColumns();
        }

        if (this.winner == null) {
            this.checkDiagonals();
        }

        // Game ends if symbols are placed in all cellsHTML
        if (this.symbolsPlaced == 9) {
            this.gameOver();
        }
    }

    checkRows() {
        for (let row = 0; row < 3; row++) {
            if (this.board[row][0] != null && (this.board[row][0] == this.board[row][1] && this.board[row][1] == this.board[row][2])) {
                if (this.board[row][0] == STATE.userSymbol) {
                    this.winner = "user";
                } else {
                    this.winner = "computer";
                }
                this.winningcellsHTML = [`${ row }.0`, `${ row }.1`, `${ row }.2`];
                STATE.gameIsActive = false;
            }
        }
    }

    checkColumns() {
        for (let col = 0; col < 3; col++) {
            if (this.board[0][col] != null && (this.board[0][col] == this.board[1][col] && this.board[1][col] == this.board[2][col])) {
                if (this.board[0][col] == STATE.userSymbol) {
                    this.winner = "user";
                } else {
                    this.winner = "computer";
                }
                this.winningcellsHTML = [`0.${ col }`, `1.${ col }`, `2.${ col }`];
                console.log(this.winningcellsHTML);
                STATE.gameIsActive = false;
            }
        }
    }

    checkDiagonals() {
        // Top left to bottom right
        if (this.board[0][0] != null && (this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2])) {
            if (this.board[0][0] == STATE.userSymbol) {
                this.winner = "user";
            } else {
                this.winner = "computer";
            }
            this.winningcellsHTML = ["0.0", "1.1", "2.2"];
            console.log(this.winningcellsHTML);
 
            STATE.gameIsActive = false;
            return;
        }

        // Bottom left to top right
        if (this.board[2][0] != null && (this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2])) {
            if (this.board[2][0] == STATE.userSymbol) {
                this.winner = "user";
            } else {
                this.winner = "computer";
            }
            this.winningcellsHTML = ["2.0", "1.1", "0.2"];
            console.log(this.winningcellsHTML);

            STATE.gameIsActive = false;
        }
    }

    gameOver() {
        UI.announceWinner();
        UI.flashWinningcellsHTML();
        UI.enableRestart();
    }
}


/**
 * Class used to manipulate the UI.
 */
class UI
{
    static updateSelectedSymbol(symbol) {
        if (symbol == "X") {
            symbolButtons[0].classList.add("selected");
            symbolButtons[1].classList.remove("selected");

        } else if (symbol == "O") {
            symbolButtons[0].classList.remove("selected");
            symbolButtons[1].classList.add("selected");
        } else {
            console.log("Something went wrong");
            alert("Something went wrong");
        }
    }

    static hideControlButtons() {
        controlButtons.style.display = "none";
    }

    static showControlButtons() {
        controlButtons.style.display = "block";
    }

    static clearBoard() {
        cellsHTML.forEach(cell => {
            cell.textContent = "";
            cell.style.backgroundColor = "#ddd";
        });
    }

    /**
     * Not done
     */
    static preShowMove(cell) {
        cell.textContent = STATE.userSymbol;
        cell.style.color = "#888";
    }

    /**
     * Not done
     */
    static undoPreShow(cell) {
        cell.textContent = "";
        cell.style.color = "#080";
    }

    static markCellAsTaken(cell) {
        cell.style.backgroundColor = "#f33";
        let iterations = 1;

        const interval = setInterval(() => {
            if (iterations % 2 == 0) {
                cell.style.backgroundColor = "#f55";
            } else {
                cell.style.backgroundColor = "#ddd";
            }
            
            iterations++;
            if (iterations == 6) {
                clearInterval(interval);
            }
        }, 125);
    }

    static makeComputerChoice(row, col) {
        cellsHTML.forEach(cell => {
            if (cell.getAttribute("data-cell")[0] == row && cell.getAttribute("data-cell")[2] == col) {
                cell.textContent = STATE.computerSymbol;
            }
        });
    }

    static announceWinner() {
        if (STATE.game.winner == null) {
            infoText.textContent = "Draw";
            board.style.backgroundColor = "#aaa";
            return;
        }

        if (STATE.game.winner == "user") {
            infoText.textContent = `You won!`;
        } else {
            infoText.textContent = `The computer won`;
        }
    }

    static flashWinningcellsHTML() {
        const color = STATE.game.winner == "user" ? "#5f5" : "#f55";

        const winningcellsHTMLHTML = [];

        STATE.game.winningcellsHTML.forEach(cell => {
            winningcellsHTMLHTML.push(document.querySelector(`[data-cell="${ cell }"]`));
        });

        winningcellsHTMLHTML.forEach(cell => {
            cell.style.backgroundColor = color;
        });

        let iterations = 1;
        const interval = setInterval(() => {
            winningcellsHTMLHTML.forEach(cell => {
                if (iterations % 2 == 0) {
                    cell.style.backgroundColor = color;
                } else {
                    cell.style.backgroundColor = "#ddd";
                }
            });
            if (++iterations == 5) {
                clearInterval(interval);
            }
        }, 300);
    }

    static enableRestart() {
        setTimeout(() => {
            startBtn.textContent = "Play again";
            controlButtons.style.display = "block";
        }, 1800);
    }
}




// =========================== Events =========================== // 

// Changing symbol
symbolButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        const userSymbol = btn.getAttribute("data-symbol")
        UI.updateSelectedSymbol(userSymbol);
        Settings.updatePlayersSymbol(userSymbol);
    });
});

// Start game
startBtn.addEventListener("click", () => {
    STATE.game = new Game();
    STATE.gameIsActive = true;
    STATE.game.startGame();
});

/**
 * Not done
 */
// Hovering events for the cellsHTML
// cellsHTML.forEach(cell => {
//     // Mouse over
//     cell.addEventListener("mouseover", e => {
//         if (e.target.textContent == "") {
//             UI.preShowMove(e.target);
//         }
//     });

//     // Mouse leave
//     cell.addEventListener("mouseleave", e => {
//         if (cell.style.color == "rgb(136, 136, 136)") {
//             UI.undoPreShow(cell);
//         }
//     });
// });

// Clicking on a cell
board.addEventListener("click", e => {
    // Do nothing is game is not started
    if (STATE.gameIsActive != true) {
        return;
    }

    // Do nothing is clicked element is not a cell
    if (!e.target.classList.contains("cell")) {
        return;
    }

    // Do nothing if it is the computer's turn
    if (STATE.game.playersTurn == "computer") {
        return
    }

    const coordinates = e.target.getAttribute("data-cell");

    STATE.game.handlePlayerOption(coordinates[0], coordinates[2], e.target);
});