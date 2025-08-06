import fetchSwines from './../../../admin/api/fetch-swines.js';
import fetchClient from '../auth/fetch-client.js';
import fetchSwineById from './fetch-swine.js';
import { formattedDate } from '../../../admin/utils/formated-date-time.js';
import { removeSwine } from './edit-remove.js';
import { fetchAppointments } from '../../../admin/api/fetch-appointments.js';
import { getServiceName } from '../../../admin/api/fetch-services.js';
import { getMedicineName } from '../../../admin/api/fetch-medicine.js';

const displayClientSwines = async() => {
    try {
        const user = await fetchClient();
        const userId = user._id;

        const swines = await fetchSwines();
        const filterClientSwine = swines.filter(swine => swine.clientId === userId && swine.status !== 'removed');
        let swineHTML = '';

        filterClientSwine.forEach(swine => {
            swineHTML += `
            <div class="swine-card ${swine.status}" data-set-swine-id="${swine._id}">
                <img class="swine-card__image" src="images-and-icons/icons/swine-image.png" alt="swine-image">
                <div class="swine-card__swine-info">
                    <p class="swine-card__id">${swine.swineFourDigitId}</p>
                    <p class="swine-card__type">${swine.type.charAt(0).toUpperCase() + swine.type.slice(1)}</p>
                    <p class="swine-card__status">${swine.status.charAt(0).toUpperCase() + swine.status.slice(1)}</p>
                </div>
                <i class="swine-card__delete-btn fa-solid fa-trash" id="remove-swine" data-set-swine-id="${swine._id}"></i>
            </div>
            `; 
        });

        document.querySelector('.swines-card-list').innerHTML = swineHTML;

        document.dispatchEvent(new Event('renderClientSwine')); 
    } catch (err) {
    console.error("Error loading services:", err);
  }

    document.querySelectorAll('#remove-swine').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // prevent triggering swine full details
            const swineId = btn.getAttribute('data-set-swine-id');

            const confirmDelete = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to remove this swine?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                cancelButtonText: 'No, cancel'
            });

            if (confirmDelete.isConfirmed) {
                removeSwine(swineId); // This is your function from edit-remove.js
            }
        });
    });
}

const displayFullSwineDetails = async (swineId) => {
  const swine = await fetchSwineById(swineId);
  if (!swine) return;

    const swineFullDetails = `
        <h1 class="swines-full-info__heading">Swine Full Details</h1>
        <button class="swines-full-info__back-btn" type="button">
            <i class="swines-full-info__back-btn--arrow fas fa-arrow-left"></i> 
            <span class="swines-full-info__back-btn--label">Back</span>
        </button>
        <img class="swines-full-info__swine-img" src="images-and-icons/icons/swine-image.png" alt="Swine Image" />
            
        <div class="swine-full-info__details-label-btn-container">
            <p class="swines-full-info__info-label">Swine Info</p>
            <button class="swines-full-info__edit-btn enable-edit-mode-btn" type="button" data-set-swine-id="${swine._id}">Edit</button>       
        </div>

        <div class="swines-full-info__details">
            <div class="detail">
                <span class="detail-label">ID</span>
                <p class="detail-value">${swine.swineFourDigitId}</p>
            </div>
            <div class="detail">
                <span class="detail-label">Type</span>
                <select class="detail-value" id="select-swine-type">
                    <option value="${swine.type}">${swine.type}</option>
                    <option value="piglet">Piglet</option>
                    <option value="grower">Grower</option>
                    <option value="boar">Boar</option>
                    <option value="sow">Sow</option>
                </select>
            </div>
            <div class="detail">
                <span class="detail-label">Sex</span>
                <select class="detail-value" id="select-swine-sex" disabled>
                    <option value="${swine.sex}">${swine.sex.charAt(0).toUpperCase() + swine.sex.slice(1)}</option>
                </select>
            </div>
            <div class="detail">
                <span class="detail-label">Breed</span>
                <select class="detail-value" id="select-swine-breed" disabled>
                    <option value="${swine.breed}">${swine.breed}</option>
                </select>
            </div>
            <div class="detail">
                <span class="detail-label">Birth Date</span>
                <input class="detail-value" id="input-swine-birthdate" type="text" value="${formattedDate(swine.birthdate)}"  readonly>
            </div>
            <div class="detail">
                <span class="detail-label">Health Status</span>
                <select class="detail-value" id="select-swine-health-status">
                    <option value="${swine.status}"}>${swine.status.charAt(0).toUpperCase() + swine.status.slice(1)}</option>
                    <option value="pregnant">Pregnant</option>
                    <option value="healthy">Healthy</option>
                    <option value="pregnant">Pregnant</option>
                    <option value="sick">Sick</option>
                    <option value="deceased">Deceased</option>
                </select>
            </div>
            <div class="detail">
                <span class="detail-label">Weight/kg</span>
                <input class="detail-value" id="swine-weight" type="number" step="any" value="${swine.weight || ''}" placeholder="kg">
            </div>
            <div class="detail">
                <span class="detail-label">Cause:</span><br>
                <input id="death-cause" name="death-cause" class="detail-value" type="text" value="${swine.cause || ''}" placeholder="Cause">
            </div>
        </div>
        
        <div class="medical-history__container">
            <h3>Medical History</h3>
            <div class="swine-medical__history-list" id="swine-medical__history-list">
                <hr>
                <p>No Medical History.</p>
            </div>
        </div>

        <div class="buttons-container">
            <button class="swines-full-info__cancel-btn disable-edit-mode-btn" type="button">Cancel</button>
            <button class="swines-full-info__save-btn" type="submit">Save</button>
        </div>
    `;

    document.querySelector('#swines-full-info').innerHTML = swineFullDetails;
    await getSwineHistoryRecords(swineId);
};

const getSwineHistoryRecords = async(swineId) => {
    try {
        const appointments = await fetchAppointments();
        const filteredCompletedAppointments = appointments.filter(appointment => appointment.swineIds.includes(swineId) && appointment.appointmentStatus === 'completed');

        let swineHealthRecordsHTML = '';
        for (const appointment of filteredCompletedAppointments) {
            const serviceName = await getServiceName(appointment.appointmentService)
            const medicineName = await getMedicineName(appointment.medicine);
            swineHealthRecordsHTML += `
                <hr>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${formattedDate(appointment.appointmentDate)}</p>
                <p><strong>Medicine:</strong> ${medicineName}</p>
                <p><strong>Dosage:</strong> ${(appointment.dosage)/appointment.swineCount} mg</p>
            `;
        }

        document.querySelector('#swine-medical__history-list').innerHTML = swineHealthRecordsHTML;

    } catch (err){
        console.error("Something went wrong went getting swine records");
    }
}

export {
    displayClientSwines,
    displayFullSwineDetails
};
