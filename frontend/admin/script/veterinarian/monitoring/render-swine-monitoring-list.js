import { fetchAppointments } from "../../../api/fetch-appointments.js";
import fetchSwines from "../../../api/fetch-swines.js";
import fetchUser from "../../auth/fetchUser.js";
import fetchUsers from "../../../api/fetch-users.js";
import { getAgeText } from "../../../utils/calculate-months-years.js";
import { getServiceName } from "../../../api/fetch-services.js";

const renderMonitoringList = async () => {
  const admin = await fetchUser();
  const role = admin.roles;

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
          <button type="button" class="update-btn__monitoring-swine" data-swine-id="${swine._id}" ${role[0] !== 'veterinarian' ? 'style="display:none"' : ''}}>Update</button>
        </div>
      </div>
    `;
  }

  listContainer.innerHTML = monitoringListHTML;

  // ✅ Re-initialize your event listeners
  document.dispatchEvent(new Event('renderMonitoredSwine'));
};

const renderMonitoringPastList = async () => {
  const admin = await fetchUser();
  const role = admin.roles;

  // Fetch all data
  const [appointments, users, swines] = await Promise.all([
    fetchAppointments(),
    fetchUsers(),
    fetchSwines()
  ]);

  // ✅ 1. Filter appointments assigned to this veterinarian
  const vetAppointments = appointments.filter(app => String(app.vetPersonnel) === String(admin._id));

  // ✅ 2. Group appointments by swineId(s) (array field)
  const swineMap = new Map();
  for (const app of vetAppointments) {
    if (Array.isArray(app.swineIds)) {
      for (const swineId of app.swineIds) {
        if (!swineMap.has(swineId)) {
          swineMap.set(swineId, []);
        }
        swineMap.get(swineId).push(app);
      }
    }
  }

  // ✅ 3. Build HTML
  const listContainer = document.querySelector('.monitoring-history__list');
  let monitoringListHTML = '';

  if (swineMap.size === 0) {
    listContainer.innerHTML = `
      <div class="no-monitoring-swine">
        <p>No Swine to Display.</p>
      </div>
    `;
    return;
  }

  for (const [swineId, swineAppointments] of swineMap.entries()) {
    const swine = swines.find(s => String(s._id) === String(swineId));
    if (!swine) continue;

    const owner = users.find(u => String(u._id) === String(swine.clientId));
    const fullName = owner
      ? `${owner.firstName} ${owner.middleName.charAt(0).toUpperCase()}. ${owner.lastName}`
      : 'Unknown Owner';
    const address = owner ? `${owner.barangay}, ${owner.municipality}` : 'Unknown Address';
    const contact = owner ? owner.contactNum : 'N/A';

    // ✅ 4. List appointments + symptoms
    let appointmentDetailsHTML = '';
    for (const app of swineAppointments) {
      const serviceName = await getServiceName(app.appointmentService);
      appointmentDetailsHTML += `
        <div class="appointment-detail">
          <p>Appointment: ${serviceName || 'N/A'}</p>
          <p>Symptoms: ${
            Array.isArray(app.clinicalSigns)
              ? app.clinicalSigns.join(', ')
              : app.clinicalSigns || 'None reported'
          }</p>
          <hr>
        </div>
      `;
    }

    // ✅ 5. Swine card
    monitoringListHTML += `
      <div class="client-swine">
        <div class="top">
          <img class="monitoring-swine-card__image"
               src="${
                 swine.swineProfileImage
                   ? '/uploads/' + swine.swineProfileImage
                   : './images-and-icons/images/swine-image.png'
               }"
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
            <p><strong>Owner:</strong> ${fullName}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Contact:</strong> ${contact}</p>

            <h4>Swine Information</h4>
            <p><strong>Type:</strong> ${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
            <p><strong>Age:</strong> ${getAgeText(swine.birthdate)}</p>
            <p><strong>Sex:</strong> ${swine.sex.charAt(0).toUpperCase()}${swine.sex.slice(1)}</p>

            <h4>Appointments</h4>
            ${appointmentDetailsHTML}
          </div>
        </div>
      </div>
    `;
  }

  listContainer.innerHTML = monitoringListHTML;
  document.dispatchEvent(new Event('renderPastMonitoredSwine'));
};




export { renderMonitoringList, renderMonitoringPastList };
