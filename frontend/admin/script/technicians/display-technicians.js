import api from '../../utils/axiosConfig.js';
import fetchUsers from '../../api/fetchUsers.js';


const handleRenderTechnicians = async() => {
  try{
    const allUsers = await fetchUsers();

    const technicians = allUsers.filter(user => user.roles.includes('technician'));

    let technicianHTML = '';

    technicians.forEach(technician => {
      const technicianFullname = `${technician.firstName} ${technician.middleName} ${technician.lastName}`;

      technicianHTML += `
        <div class="technician" data-technician-id=${technician._id}>
          <div class="technician__profile">
            <img class="technician__profile-img" src="images-and-icons/images/example-user-profile-pic.jpg" alt="technician-img">
            <p class="technician__profile-name">${technicianFullname}</p>
            <p class="technician__profile-position">Technician |</p>
          </div>
          <div class="technician__task">
            <h4 class="technician__task-heading">Task:</h4>
            <div class="task-card">
              <div class="task-card__group">
                <p class="task-card__task-name">
                  <span class="task-card__label">Task:</span>
                  <span class="task-card__value">Deworming</span>
                </p>
                <p class="task-card__task-location">
                  <span class="task-card__label">Location:</span>
                  <span class="task-card__value">Santol, Boac</span>          
                </p>
              </div>
              <p class="task-card__task-type">Service</p>
              <div class="task-card__group">
                <p class="task-card__task-date">
                  <span class="task-card__label">Date:</span>
                  <span class="task-card__value">May 9, 2025</span> 
                </p>
                <p class="task-card__task-time">
                  <span class="task-card__label">Time:</span>
                  <span class="task-card__value">11:30 AM</span>                       
                </p>
              </div>
            </div>
            <p class="technician__task-availability-status">AVAILABLE</p>
          </div>
        </div>
      `
    });

    document.querySelector('.technician-list-container').innerHTML = technicianHTML;

  } catch (err) {
    console.log(err)
  }

}   

export default handleRenderTechnicians ;