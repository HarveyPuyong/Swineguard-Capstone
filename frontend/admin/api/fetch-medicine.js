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


export { fetchMedicines, getMedicineName};