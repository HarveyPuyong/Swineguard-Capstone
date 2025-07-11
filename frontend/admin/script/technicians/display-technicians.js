
import fetchUsers from '../../api/fetch-users.js';
import { fetchAppointments } from '../../api/fetch-appointments.js';
import { getServiceName } from '../../api/fetch-services.js';
import { formattedDate, formatTo12HourTime} from '../../utils/formated-date-time.js';


const handleRenderTechnicians = async () => {
  try {
    const allUsers = await fetchUsers();
    const allAppointments = await fetchAppointments();
    

    const technicians = allUsers.filter(user => user.roles.includes('technician') || user.roles.includes('veterinarian'));

    let technicianHTML = '';

    for (const technician of technicians) {
      const fullName = `${technician.roles.includes('veterinarian') ? 'Doc.' : 'Mr.'} ${technician.firstName} ${technician.middleName?.charAt(0).toUpperCase() || ''}. ${technician.lastName}`;
      const assignedTechnicians = allAppointments.filter(app => app.vetPersonnel === technician._id && app.appointmentStatus === 'accepted');

      let taskCards = '';

      if (assignedTechnicians.length > 0) {
        
        for (const task of assignedTechnicians) {
          const serviceName = await getServiceName(task.appointmentService) || 'Unknown Service';
          const location = `${task.barangay}, ${task.municipality}`;
          const schedule = formattedDate(task.appointmentDate) || 'Not set';
          const time = formatTo12HourTime(task.appointmentTime) || 'Not set';

          taskCards += `
            <div class="task-card">
              <div class="task-card__group">
                <p class="task-card__task-name">
                  <span class="task-card__label">Task:</span>
                  <span class="task-card__value">${serviceName}</span>
                </p>
                <p class="task-card__task-location">
                  <span class="task-card__label">Location:</span>
                  <span class="task-card__value">${location}</span>          
                </p>
              </div>
              <p class="task-card__task-type">Service</p>
              <div class="task-card__group">
                <p class="task-card__task-date">
                  <span class="task-card__label">Date:</span>
                  <span class="task-card__value">${schedule}</span> 
                </p>
                <p class="task-card__task-time">
                  <span class="task-card__label">Time:</span>
                  <span class="task-card__value">${time}</span>                       
                </p>
              </div>
            </div>
          `;
        };
      } else {
        taskCards = `
          <div class="task-card">
            <div class="task-card__group">
              <p class="task-card__task-name">
                <span class="task-card__label">Task:</span>
                <span class="task-card__value">No task yet.</span>
              </p>
              <p class="task-card__task-location">
                <span class="task-card__label">Location:</span>
                <span class="task-card__value">None</span>          
              </p>
            </div>
            <p class="task-card__task-type">Service</p>
            <div class="task-card__group">
              <p class="task-card__task-date">
                <span class="task-card__label">Date:</span>
                <span class="task-card__value">None</span> 
              </p>
              <p class="task-card__task-time">
                <span class="task-card__label">Time:</span>
                <span class="task-card__value">None</span>                       
              </p>
            </div>
          </div>
        `;
      }

      technicianHTML += `
        <div class="technician" data-technician-id="${technician._id}">
          <div class="technician__profile">
            <img class="technician__profile-img" src="images-and-icons/images/example-user-profile-pic.jpg" alt="technician-img">
            <p class="technician__profile-name">${fullName}</p>
            <p class="technician__profile-position">${technician.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()).join(', ')}</p>
          </div>
          <div class="technician__task">
            <h4 class="technician__task-heading">Task:</h4>
            ${taskCards}
            <p class="technician__task-availability-status">${assignedTechnicians.length > 5 ? 'NOT AVAILABLE' : 'AVAILABLE'}</p>
          </div>
        </div>
      `;
    };

    document.querySelector('.technician-list-container').innerHTML = technicianHTML;

  } catch (err) {
    console.error('Error rendering technicians:', err);
    document.querySelector('.technician-list-container').innerHTML = `
      <p class="error-message">Failed to load technicians. Please try again later.</p>
    `;
  }
};



export default handleRenderTechnicians ;












// const handleRenderTechnicians = async() => {
//   try{
//     const allUsers = await fetchUsers();
//     const allAppointments = await fetchAppointments();

//     const technicians = allUsers.filter(user => user.roles.includes('technician') || user.roles.includes('veterinarian'));

//     let technicianHTML = '';

//     technicians.forEach(technician => {
//       const technicianFullname = `${technician.roles.includes('veterinarian') ? 'Doc.' : technician.roles.includes('technician') ? 'Mr.' : ''} ${technician.firstName} ${technician.middleName.charAt(0).toUpperCase()}. ${technician.lastName}`;

//       technicianHTML += `
//         <div class="technician" data-technician-id=${technician._id}>
//           <div class="technician__profile">
//             <img class="technician__profile-img" src="images-and-icons/images/example-user-profile-pic.jpg" alt="technician-img">
//             <p class="technician__profile-name">${technicianFullname}</p>
//             <p class="technician__profile-position">${technician.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()).join(', ')}</p>
//           </div>
//           <div class="technician__task">
//             <h4 class="technician__task-heading">Task:</h4>
//             <div class="task-card">
//               <div class="task-card__group">
//                 <p class="task-card__task-name">
//                   <span class="task-card__label">Task:</span>
//                   <span class="task-card__value">No task yet.</span>
//                 </p>
//                 <p class="task-card__task-location">
//                   <span class="task-card__label">Location:</span>
//                   <span class="task-card__value">None</span>          
//                 </p>
//               </div>
//               <p class="task-card__task-type">Service</p>
//               <div class="task-card__group">
//                 <p class="task-card__task-date">
//                   <span class="task-card__label">Date:</span>
//                   <span class="task-card__value">None</span> 
//                 </p>
//                 <p class="task-card__task-time">
//                   <span class="task-card__label">Time:</span>
//                   <span class="task-card__value">None</span>                       
//                 </p>
//               </div>
//             </div>
//             <p class="technician__task-availability-status">AVAILABLE</p>
//           </div>
//         </div>
//       `
//     });

//     document.querySelector('.technician-list-container').innerHTML = technicianHTML;

//   } catch (err) {
//      console.error('Error rendering technicians:', err);
//      document.querySelector('.technician-list-container').innerHTML = `
//         <p class="error-message">Failed to load technicians. Please try again later.</p>
//      `;
//   }
// }   
