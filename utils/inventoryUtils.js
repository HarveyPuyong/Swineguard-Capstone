// ✅ Emoji check
function containsEmoji(text) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
}

// ✅ Allowed pattern: letters, numbers, spaces, and dashes (-)
function isAllowedText(text) {
  const allowedRegex = /^[A-Za-z0-9\- ]+$/;
  return allowedRegex.test(text);
}

// ✅ Combined validation
function isInvalidInput(itemName) {
  if (!itemName ) return true;
  if (containsEmoji(itemName) ) return true;
  if (!isAllowedText(itemName) ) return true;
  return false;
}

// Check Expiry Date
function checkExpiryDate(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize
  const expirationDate = new Date(expiryDate);
  return expirationDate > today; // ✅ true if future
}

// Validate inputs letters and negative numbers are not allowed
function isValidNumber (value) {
    if (typeof value !== 'string') return false; // Only allow strings

    // Reject exponential, letters, negatives, etc.
    if (!/^\d+(\.\d+)?$/.test(value)) return false;

    const number = Number(value);
    return !isNaN(number) && isFinite(number) && number > 0;
}



module.exports = {isValidNumber, isInvalidInput, checkExpiryDate};