// Calculate swine Age
const calculateSwineAge = (birthdate) => {
    const swineBirthdate = new Date(birthdate);
    const today = new Date();

    if (isNaN(swineBirthdate)) return 'Invalid date';

    const monthsOld = (today.getFullYear() - swineBirthdate.getFullYear()) * 12 + 
                      (today.getMonth() - swineBirthdate.getMonth());

    return monthsOld >= 0 ? monthsOld : 0;
}

const calculateUserAge = (birthdate) => {
    const birthday = new Date(birthdate);
    const currentYear = new Date();

    const userAge = currentYear.getFullYear() - birthday.getFullYear();

    return userAge;
}

export { calculateSwineAge, calculateUserAge };