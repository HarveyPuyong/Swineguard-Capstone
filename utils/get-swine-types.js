function getSwineType(birthDateStr, sex) {
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    // Calculate age in days
    const diffTime = today - birthDate;
    const ageInDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const ageInMonths = ageInDays / 30;

    // Classification
    if (ageInDays <= 60) {  
        // up to ~2 months
        return "piglet";
    } else if (ageInMonths <= 5) {  
        // ~2–5 months
        return "grower";
    } else {
        if (sex.toLowerCase() === "male") {
            return "boar";
        } else if (sex.toLowerCase() === "female") {
            if (ageInMonths < 8) {
                return "gilt";  // young female not yet breeder
            } else {
                return "sow";   // mature breeder
            }
        }
    }

    return "unknown";
}

module.exports = { getSwineType };
