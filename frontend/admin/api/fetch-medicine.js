import api from '../utils/axiosConfig.js'


async function fetchMedicines() {
    try {
        const response = await api.get('/inventory/all/medicines');

        if(response.status === 200) return response?.data;

    } catch (error){
        console.error('Failed to fetch medicines:', error);
        throw error; 
    }

}

async function getMedicineName(medicineId) {
    const medicines = await fetchMedicines();

    if (!medicineId) {
        return 'Not set';
    }

    const foundMedicine = medicines.find(med => med._id === medicineId);
    const medicineName = foundMedicine.itemName;

    return medicineName;
}



export { fetchMedicines, getMedicineName};