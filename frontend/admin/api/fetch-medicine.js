import api from '../utils/axiosConfig.js'


async function fetchMedicines() {
    try {
        const response = await api.get('http://localhost:2500/inventory/all');

        if(response.status === 200) return response?.data;

    } catch (error){
        console.error('Failed to fetch medicines:', error);
        throw error; 
    }

}


export default fetchMedicines;