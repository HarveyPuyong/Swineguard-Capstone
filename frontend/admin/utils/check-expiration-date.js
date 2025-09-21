// Check Expiry Date
function checkExpiryDate(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  const expirationDate = new Date(expiryDate);
  expirationDate.setHours(0, 0, 0, 0);

  // Define limits
  const minAllowed = new Date(today);
  minAllowed.setDate(today.getDate() + 8); // at least 1 week + 1 day ahead

  const maxAllowed = new Date(today);
  maxAllowed.setFullYear(today.getFullYear() + 1); // up to 1 year ahead

  // Return true only if within range
  return expirationDate >= minAllowed && expirationDate <= maxAllowed;
}

export {
    checkExpiryDate
}