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

export {
    getSwineAgeInMonths,
    getSwineGenderMale,
    getSwineGenderFemale
}