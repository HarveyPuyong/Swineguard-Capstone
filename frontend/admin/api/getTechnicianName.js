import api from '../utils/axiosConfig.js'

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

export default getTechnicianName;
