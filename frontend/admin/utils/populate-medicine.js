const selectTag = document.getElementById('medicine-list');

async function populateMedicine() {
    selectTag.innerHTML = '<option value="">Select a Medicine</option>'; // Default placeholder

    try {

        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:2500/inventory/all', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true 
      });

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