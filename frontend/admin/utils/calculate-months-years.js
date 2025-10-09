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

function getAgeText(birthDate) {
    if (!birthDate) return "age unknown";

    const birth = new Date(birthDate);
    const today = new Date();

    // Calculate total difference in months and days
    let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

    let days = today.getDate() - birth.getDate();

    // Adjust if days go negative
    if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
    }

    if (months < 0) return "invalid date";

    // Build readable text
    let ageText = "";
    if (months > 0) ageText += `${months} month${months > 1 ? "s" : ""}`;
    if (days > 0) ageText += `${months > 0 ? " and " : ""}${days} day${days > 1 ? "s" : ""}`;
    if (!ageText) ageText = "0 days old";

    return ageText;
}

export { calculateSwineAge, calculateUserAge, getAgeText };