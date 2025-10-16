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

// Check Expiry Date (must be within 30 days from now)
function checkExpiryDate(expiryDate) {
  const currentDate = new Date();
  const expirationDate = new Date(expiryDate);

  // Normalize both to midnight to remove hour/minute bias
  currentDate.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);

  // Difference in days
  const diffInDays = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);

  // Reject if expiry is today, in the past, or less than 30 days ahead
  if (diffInDays < 30) {
    return false;
  }

  return true; // ✅ valid: 30 or more days ahead
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