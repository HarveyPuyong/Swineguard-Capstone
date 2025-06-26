//  Verify inputs empty or too short
function isValidInput(userInput) {
    return userInput && userInput.trim().length > 2;
}

module.exports = { isValidInput } // gadagdag pa ako dito