
import STATE from "./state";

const infoText = document.getElementById("info-text");

const controlButtons = document.getElementById("control-buttons");
const symbolButtons = document.querySelectorAll(".symbol-btn");

const grid = document.getElementById("grid");
const cells = document.querySelectorAll("[data-cell]");



/**
 * Class used to manipulate the UI.
 */
export default class UI
{
    static updateSelectedSymbol(symbol) {
        if (symbol == "cross") {
            symbolButtons[0].classList.add("selected");
            symbolButtons[1].classList.remove("selected");

        } else if (symbol == "circle") {
            symbolButtons[0].classList.remove("selected");
            symbolButtons[1].classList.add("selected");
        } else {
            alert("Something went wrong!");
        }
    }

    static hideControlButtons() {
        controlButtons.style.display = "none";
    }

    static showControlButtons() {
        controlButtons.style.display = "block";
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
        cells.forEach(cell => {
            if (cell.getAttribute("data-cell")[0] == row && cell.getAttribute("data-cell")[2] == col) {
                cell.textContent = STATE.computerSymbol;
            }
        });
    }

    static announceWinner() {
        if (STATE.game.winner == null) {
            infoText.textContent = "Draw";
            grid.style.backgroundColor = "#aaa";
            return;
        }

        if (STATE.game.winner == "user") {
            infoText.textContent = `You won!`;
        } else {
            infoText.textContent = `The computer won`;
        }
    }

    static flashWinningCells() {
        const color = STATE.game.winner == "user" ? "#5f5" : "#f55";

        const winningCellsHTML = [];

        STATE.game.winningCells.forEach(cell => {
            winningCellsHTML.push(document.querySelector(`[data-cell="${ cell }"]`));
        });

        winningCellsHTML.forEach(cell => {
            cell.style.backgroundColor = color;
        });

        let iterations = 1;
        const interval = setInterval(() => {
            winningCellsHTML.forEach(cell => {
                if (iterations % 2 == 0) {
                    cell.style.backgroundColor = color;
                } else {
                    cell.style.backgroundColor = "#ddd";
                }
            });
            if (++iterations == 7) {
                clearInterval(interval);
            }
        }, 300);
    }
}