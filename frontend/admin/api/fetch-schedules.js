import api from '../utils/axiosConfig.js';

const fetchSchedules = async() => {
  try {
    const response = await api.get('/schedule/get/vet/personal-sched/', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error; 
  }
}

const fetchNumOfAppt = async() => {
  try {
    const response = await api.get('/schedule/get/vet/total-num-of-app/', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error; 
  }
}

export {
    fetchSchedules,
    fetchNumOfAppt
}