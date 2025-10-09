// import { fetchAppointments } from "../../../api/fetch-appointments.js";
// import fetchSwines from "../../../api/fetch-swines.js";
// import fetchUser from "../../auth/fetchUser.js";
// import fetchUsers from "../../../api/fetch-users.js";
// import { getAgeText } from "../../../utils/calculate-months-years.js";


// // Admin
// const admin = await fetchUser();
// const { _id } = admin;

// // Appointments
// const appoinments = await fetchAppointments();

// //Users
// const users = await fetchUsers();


// //Swines
// const swines = await fetchSwines();
// const underMonitoringSwine = swines.filter(swine => swine.isUnderMonitoring === true);

// const renderMonitoringList = () => {
//     let monitoringListHTML = '';

//     if (underMonitoringSwine.length === 0) {
//         monitoringListHTML = `
//             <div class="no-monitoring-swine">
//                 <p>No Swine to Display.</p>
//             </div>
//         `;
//     }

//     for (const swine of underMonitoringSwine) {

//         //Get Swine Raiser Info
//         const filterSwineRaiser = users.find(user => user._id === swine.clientId);
//         const firstName = filterSwineRaiser.firstName;
//         const middleName = filterSwineRaiser.middleName;
//         const lastName = filterSwineRaiser.lastName;
//         const municipality = filterSwineRaiser.municipality;
//         const barangay = filterSwineRaiser.barangay;
//         const contact = filterSwineRaiser.contactNum;

//         monitoringListHTML += `
//             <div class="client-swine">
//                 <div class="top">
//                     <img class="monitoring-swine-card__image" src="${swine.swineProfileImage ? '/uploads/' + swine.swineProfileImage : './images-and-icons/images/swine-image.png'}" alt="swine-image">
//                     <div class="swine-info">
//                         <p class="swine-four-digit-id">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
//                         <p>${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
//                     </div>
                    
//                     <button type="button" class="view-more__monitoring-swine" data-swine-id="${swine._id}">View</button>
//                 </div>

//                 <div class="bottom">
//                     <div class="full-details">
//                         <h4>Clien Information</h4>
//                         <p><strong>Owner: </strong>${firstName} ${middleName.charAt(0).toUpperCase()}. ${lastName}</p>
//                         <p><strong>Address: </strong>${barangay}, ${municipality}</p>
//                         <p><strong>Contact: </strong>${contact}</p>

//                         <h4>Swine Information</h4>
//                         <p><strong>Type: </strong>${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
//                         <p><strong>Age: </strong>${getAgeText(swine.birthdate)}</p>
//                         <p><strong>Age: </strong>${swine.sex.charAt(0).toUpperCase()}${swine.sex.slice(1)}</p>
//                     </div>
//                     <button type="button" class="update-btn__monitoring-swine" data-swine-id="${swine._id}">Update</button>
//                 </div>
//             </div>
//         `;
//         document.querySelector('.swine-monitoring-list').innerHTML = monitoringListHTML;
//         document.dispatchEvent(new Event('renderMonitoredSwine')); 
//     };

// }

// export {
//     renderMonitoringList
// }


import { fetchAppointments } from "../../../api/fetch-appointments.js";
import fetchSwines from "../../../api/fetch-swines.js";
import fetchUser from "../../auth/fetchUser.js";
import fetchUsers from "../../../api/fetch-users.js";
import { getAgeText } from "../../../utils/calculate-months-years.js";

const renderMonitoringList = async () => {
  const admin = await fetchUser();
  const { _id } = admin;

  // Always fetch fresh data
  const [appointments, users, swines] = await Promise.all([
    fetchAppointments(),
    fetchUsers(),
    fetchSwines()
  ]);

  const underMonitoringSwine = swines.filter(swine => swine.isUnderMonitoring === true);

  const listContainer = document.querySelector('.swine-monitoring-list');
  let monitoringListHTML = '';

  if (underMonitoringSwine.length === 0) {
    listContainer.innerHTML = `
      <div class="no-monitoring-swine">
        <p>No Swine to Display.</p>
      </div>
    `;
    return;
  }

  for (const swine of underMonitoringSwine) {
    const filterSwineRaiser = users.find(user => user._id === swine.clientId);
    const firstName = filterSwineRaiser.firstName;
    const middleName = filterSwineRaiser.middleName;
    const lastName = filterSwineRaiser.lastName;
    const municipality = filterSwineRaiser.municipality;
    const barangay = filterSwineRaiser.barangay;
    const contact = filterSwineRaiser.contactNum;

    monitoringListHTML += `
      <div class="client-swine">
        <div class="top">
          <img class="monitoring-swine-card__image" 
               src="${swine.swineProfileImage ? '/uploads/' + swine.swineProfileImage : './images-and-icons/images/swine-image.png'}" 
               alt="swine-image">
          <div class="swine-info">
            <p class="swine-four-digit-id">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
            <p>${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
          </div>
          <button type="button" class="view-more__monitoring-swine" data-swine-id="${swine._id}">View</button>
        </div>

        <div class="bottom">
          <div class="full-details">
            <h4>Client Information</h4>
            <p><strong>Owner:</strong> ${firstName} ${middleName.charAt(0).toUpperCase()}. ${lastName}</p>
            <p><strong>Address:</strong> ${barangay}, ${municipality}</p>
            <p><strong>Contact:</strong> ${contact}</p>

            <h4>Swine Information</h4>
            <p><strong>Type:</strong> ${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
            <p><strong>Age:</strong> ${getAgeText(swine.birthdate)}</p>
            <p><strong>Sex:</strong> ${swine.sex.charAt(0).toUpperCase()}${swine.sex.slice(1)}</p>
          </div>
          <button type="button" class="update-btn__monitoring-swine" data-swine-id="${swine._id}">Update</button>
        </div>
      </div>
    `;
  }

  listContainer.innerHTML = monitoringListHTML;

  // ✅ Re-initialize your event listeners
  document.dispatchEvent(new Event('renderMonitoredSwine'));
};

export { renderMonitoringList };
