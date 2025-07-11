import api from '../utils/axiosConfig.js'


async function fetchMedicines() {
    try {
        const response = await api.get('/inventory/all');

        if(response.status === 200) return response?.data;

    } catch (error){
        console.error('Failed to fetch medicines:', error);
        throw error; 
    }

}


export default fetchMedicines;