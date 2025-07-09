import api from '../utils/axiosConfig.js'

async function getMedicineName(itemId) {
  try {
    if (!itemId) {
      return 'not set';
    }
    //console.log('getTechnicianName: userId = ', userId); // debug
    const response = await api.get(`/inventory/${itemId}`);
    const medicineData = response.data;

    return medicineData.itemName; // returns only the Item Name

  } catch (error) {
    console.error('Error fetching medicines:', error);
    return 'Medicine not found.'; // fallback
  }
}

export default getMedicineName;