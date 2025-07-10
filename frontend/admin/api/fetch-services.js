import api from '../utils/axiosConfig.js'


async function fetchServices() {
    try {
        const response = await api.get('/service/all');

        if(response.status === 200) return response?.data;

    } catch (error){
        console.error('Failed to fetch medicines:', error);
        throw error; 
    }

}


export default fetchServices;