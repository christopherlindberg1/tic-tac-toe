
import STATE from "./state";

/**
 * Class used to handle settings for the game.
 */
export default class Settings
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