
/**
 * Object for managing the state of the app.
 */
const STATE = {
    game: null,
    gameIsActive: false,
    userSymbol: "X",       // Must be initialized when game starts
    computerSymbol: "O",   // Must be initialized when game starts
};

module.exports = STATE;