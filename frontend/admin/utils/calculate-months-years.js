// Calculate swine Age
const calculateSwineAge = (birthdate) => {
    const swineBirthdate = new Date(birthdate);
    const today = new Date();

    if (isNaN(swineBirthdate)) return 'Invalid date';

    const monthsOld = (today.getFullYear() - swineBirthdate.getFullYear()) * 12 + 
                      (today.getMonth() - swineBirthdate.getMonth());

    return monthsOld >= 0 ? monthsOld : 0;
}

export { calculateSwineAge };