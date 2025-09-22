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

async function getMedicine(medicineId) {
    try {
        const response = await api.get(`/inventory/medicine/{medicineId}`);

        if(response.status === 200) return response?.data;

    } catch (error){
        console.error('Failed to fetch medicines:', error);
        throw error; 
    }

}



export { fetchMedicines, getMedicine};