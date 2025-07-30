const Swine = require('./../models/swineModel'); // adjust this

async function generateUniqueFourDigitId() {
  let isUnique = false;
  let id;

  while (!isUnique) {
    const randomNum = Math.floor(1 + Math.random() * 9999);
    id = String(randomNum).padStart(4, '0');

    const existing = await Swine.findOne({ swineFourDigitId: id });
    if (!existing) isUnique = true;
  }

  return id;
}

module.exports = generateUniqueFourDigitId;