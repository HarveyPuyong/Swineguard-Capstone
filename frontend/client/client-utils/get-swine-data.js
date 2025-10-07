import api from "./axios-config.js";
import fetchSwines from "../../admin/api/fetch-swines.js";


const getSwineAgeInMonths = (birthDateString) => {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += today.getMonth();

  return months <= 0 ? 0 : months;
};

const getSwineGenderMale = (sex) => {
    if (sex === 'male') return 1;
    return 0;
}

const getSwineGenderFemale = (sex) => {
    if (sex === 'female') return 1;
    return 0;
}

// Return Swine $ Digit Id
const getSwineFourDigitId = async (swineId) => {
    const swines = await fetchSwines();
    const swine = swines.find(s => s._id === swineId);

    if (!swine) return "Unknown"; // or null, depending on your use case

    const typeInitial = swine.type?.charAt(0)?.toUpperCase() || "";
    const fourDigit = swine.swineFourDigitId || "";

    return `${typeInitial}${fourDigit}`.trim();
};

export {
    getSwineAgeInMonths,
    getSwineGenderMale,
    getSwineGenderFemale,
    getSwineFourDigitId
}