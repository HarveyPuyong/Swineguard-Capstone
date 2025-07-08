import api from './../utils/axiosConfig.js'

const selectTag = document.getElementById('available-personnel');

async function populateTechnician() {
    selectTag.innerHTML = '<option value="">Personnel</option>'; 

    try {
        const response = await api.get('http://localhost:2500/get/technician');

        if(response === 200) return response?.data;

    } catch (error){
        console.log(error)
    }

}


export default populateTechnician;