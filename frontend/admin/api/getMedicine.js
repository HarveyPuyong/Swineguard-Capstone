import api from './../utils/axiosConfig.js'


async function populateMedicine() {
    const selectTag = document.getElementById('medicine-list');
    if(!selectTag) return;
    
    selectTag.innerHTML = '<option value="">Select a Medicine</option>'; 

    try {
        const response = await api.get('/inventory/all');

        const data = response?.data;

        data.forEach(medicine => {
            const option = document.createElement('option');
            option.value = medicine._id;
            option.textContent = medicine.itemName;
            selectTag.appendChild(option);
        })

    } catch (error){
        console.log(error)
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


export {populateMedicine, getMedicineName};