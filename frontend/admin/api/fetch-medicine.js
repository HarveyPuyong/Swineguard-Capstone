import api from '../utils/axiosConfig.js'


async function populateMedicine() {
    const selectTag = document.getElementById('medicine-list');
    if(!selectTag) return;
    
    selectTag.innerHTML = '<option value="">Select a Medicine</option>'; 

    try {
        const response = await api.get('http://localhost:2500/inventory/all');

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


export default populateMedicine;