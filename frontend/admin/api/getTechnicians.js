import api from './../utils/axiosConfig.js'

const selectTag = document.getElementById('available-personnel');

async function populateTechnician() {
    selectTag.innerHTML = '<option value="">Personnel</option>'; 

    try {
        const response = await api.get('http://localhost:2500/get/technician');

        const data = response?.data;

        data.forEach(technician => {
            const prefix = technician.roles.includes('veterinarian') ? 'Doc.' : technician.roles.includes('technician') ? 'Mr.' : '';
            const middleInitial = technician.middleName ? technician.middleName.charAt(0).toUpperCase() + '.' : '';
            const optionValue = `${technician.firstName} ${middleInitial} ${technician.lastName}`;
            const technicianFullname = `${prefix} ${technician.firstName} ${middleInitial} ${technician.lastName}`;

            const option = document.createElement('option');
            option.value = technician._id;
            option.textContent = technicianFullname;

            selectTag.appendChild(option);
        });

    } catch (error){
        console.log(error)
    }

}


export default populateTechnician;