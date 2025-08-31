//  Verify inputs empty or too short
const isValidInput = (userInput) => {
    return typeof userInput === 'string' && userInput.trim().length > 1;
}

// Check for emojis
const containsEmoji = (text) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(text);
}

// Check for numbers
const hasNumber = (input) => /\d/.test(input);

// Check for Special Characters
const containsSpecialChar = (input) => /[^a-zA-Z0-9\s]/.test(input);

module.exports = { isValidInput, containsEmoji, hasNumber, containsSpecialChar };