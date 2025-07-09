import api from './../utils/axiosConfig.js'

const selectTag = document.getElementById('available-personnel');

async function populateTechnician() {
    selectTag.innerHTML = '<option value="">Personnel</option>'; 

    try {
        
        const response = await api.get('/get/technician');

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

async function getTechnicianName(userId) {
  try {

    if (!userId) {
      return 'not set';
    }

    //console.log('getTechnicianName: userId = ', userId); // debug
    const response = await api.get(`/get/user/${userId}`);
    const userData = response.data;

    const prefix = userData.roles.includes('veterinarian') ? 'Doc.'
                : userData.roles.includes('technician') ? 'Mr.'
                : '';

    const middleInitial = userData.middleName
                ? userData.middleName.charAt(0).toUpperCase() + '.'
                : '';

    const userFullname = `${prefix} ${userData.firstName} ${middleInitial} ${userData.lastName}`;
    return userFullname.trim();
  } catch (error) {
    console.error('Error fetching user:', error);
    return 'Technician not found.';
  }
}


export {populateTechnician, getTechnicianName};