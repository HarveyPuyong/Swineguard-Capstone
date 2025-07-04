import api from './axiosConfig.js'

const selectTag = document.getElementById('medicine-list');

async function populateMedicine() {
    selectTag.innerHTML = '<option value="">Select a Medicine</option>'; // Default placeholder

    try {
        const response = await api.get('http://localhost:2500/inventory/all');

        const data = response?.data;

        data.forEach(medicine => {
            const option = document.createElement('option');
            option.value = medicine.itemName;
            option.textContent = medicine.itemName;
            selectTag.appendChild(option);
        })

    } catch (error){
        console.log(error)
    }

}


export default populateMedicine;