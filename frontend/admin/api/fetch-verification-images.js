const endpoints = "/get/verification-image";
import api from "../utils/axiosConfig.js";

const fetchVerificationImages = async () => {
  try {
    const response = await api.get(endpoints);

    if(response.status === 200) return response.data
  } catch (error) {
    console.error('Failed to fetch verification images:', error);
    throw error; 
  }
};


export default fetchVerificationImages