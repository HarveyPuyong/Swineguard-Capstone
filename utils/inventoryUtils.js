// Check for emojis and inputs
function containsEmoji(text) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(text);
}
function isInvalidInput(itemName, description) {
    return !itemName || !description || containsEmoji(itemName) || containsEmoji(description);
}

// Check Expiry Date
function checkExpiryDate(expiryDate) {
    const today = new Date();
    const currentYear = today.getFullYear();

    const expirationDate = new Date(expiryDate);
    const expirationYear = expirationDate.getFullYear();

    return expirationYear <= currentYear;
}

// Validate inputs letters and negative numbers are not allowed
function isValidNumber (value) {
    if (typeof value !== 'string') return false; // Only allow strings

    // Reject exponential, letters, negatives, etc.
    if (!/^\d+(\.\d+)?$/.test(value)) return false;

    const number = Number(value);
    return !isNaN(number) && isFinite(number) && number > 0;
}

// Check input
function checkTextInput(){

}

module.exports = {isValidNumber, isInvalidInput, checkExpiryDate};