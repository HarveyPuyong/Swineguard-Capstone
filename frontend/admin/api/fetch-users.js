import api from '../utils/axiosConfig.js';

const fetchUsers = async () => {
  try {
    const response = await api.get('/users');

    if(response.status === 200) return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error; 
  }
};


export default fetchUsers