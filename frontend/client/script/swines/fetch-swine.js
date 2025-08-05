import api from "../../client-utils/axios-config.js";

const fetchSwineById = async (swineId) => {
  try {
    const response = await api.get(`/swine/${swineId}`); // Adjust route if needed
    return response.data;
  } catch (err) {
    console.error('Error fetching swine by ID:', err);
    return null;
  }
};

export default fetchSwineById;