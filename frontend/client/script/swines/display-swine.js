import fetchSwines from './../../../admin/api/fetch-swines.js';
import fetchClient from '../auth/fetch-client.js';
import fetchSwineById from './fetch-swine.js';
import { formattedDate } from '../../../admin/utils/formated-date-time.js';
import { removeSwine } from './edit-remove.js';
import { fetchAppointments } from '../../../admin/api/fetch-appointments.js';
import { getServiceName } from '../../../admin/api/fetch-services.js';
import { getMedicineName } from '../../../admin/api/fetch-medicine.js';
import getSwineRecords from './fetch-swine-records.js';
import { barGraph, lineGraph } from './swine-graph.js';
import api from '../../client-utils/axios-config.js';


// ======================================
// ========== Display Client Swines
// ======================================
const displayClientSwines = async() => {
    try {
        const user = await fetchClient();
        const userId = user._id;

        const swines = await fetchSwines();
        const filterClientSwine = swines.filter(swine => swine.clientId === userId && swine.status !== 'removed');
        let swineHTML = '';

        if (filterClientSwine.length === 0) {
            swineHTML = `
                <div class="no-swine">
                    <p class="highlghted-txt">No Swine</p>
                    <p>Click 'Add' to create swine</p>
                </div>
            `;
        }

        filterClientSwine.forEach(swine => {
            swineHTML += `
            <div class="swine-card ${swine.status}" data-set-swine-id="${swine._id}">
                <img class="swine-card__image" src="images-and-icons/icons/swine-image.png" alt="swine-image">
                <div class="swine-card__swine-info">
                    <p class="swine-card__id">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
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


// ======================================
// ========== Display Full Details
// ======================================
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
            <button class="swines-full-info__edit-btn enable-edit-mode-btn" type="button" data-set-swine-id="${swine._id}" ${swine.status === 'sold' ? 'hidden' : ''}>Edit</button>       
        </div>

        <div class="swines-full-info__details">
            <div class="detail">
                <span class="detail-label">ID</span>
                <p class="detail-value">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
            </div>
            <div class="detail">
                <span class="detail-label">Type</span>
                <p class="detail-value">${swine.type.charAt(0).toUpperCase() + swine.type.slice(1)}</p>
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
                    <option value="sold">Sold</option>
                    <option value="deceased">Deceased</option>
                </select>
            </div>
            <div class="detail">
                <span class="detail-label">Weight/kg</span>
                <input class="detail-value" id="swine-weight" type="number" step="any" value="${swine.weight || ''}" placeholder="kg">
            </div>
            <div class="detail" style="display:none;">
                <span class="detail-label">Cause:</span><br>
                <input id="death-cause" name="death-cause" class="detail-value" type="text" value="${swine.cause || ''}" placeholder="Cause">
            </div>
        </div>
        

        <div class="swine-history-container show">

            <div class="history-nav-btns">
                <button class="history-nav-btns__nav swine-medical-history-btn active" type="button">Medical History</button>
                <button class="history-nav-btns__nav swine-health-history-btn" type="button">Health History</button>
            </div>

            <div class="medical-history__container swine-history show">
                <div class="swine-medical__history-list swine-history__list" id="swine-medical__history-list">
                    <hr>
                    <p>No Medical History.</p>
                </div>
            </div>

            <div class="health-history__container swine-history">
                <div class="swine-health__history-list swine-history__list" id="swine-health__history-list">
                    <hr>
                    <p>No Health History.</p>
                </div>
            </div>
        </div>

        <div class="buttons-container">
            <button class="swines-full-info__cancel-btn disable-edit-mode-btn" type="button">Cancel</button>
            <button class="swines-full-info__save-btn" type="submit">Save</button>
        </div>
    `;

    document.querySelector('#swines-full-info').innerHTML = swineFullDetails;
    await getSwineMedicalHistory(swineId);
    await getSwineHealthHistory(swineId);
    

    document.dispatchEvent(new Event('renderFullSwineDetails')); 
};


// ======================================
// ========== Get Swine Medical History Records
// ======================================
const getSwineMedicalHistory = async(swineId) => {
    try {
        const appointments = await fetchAppointments();
        const filteredCompletedAppointments = appointments.filter(appointment => appointment.swineIds.includes(swineId) && appointment.appointmentStatus === 'completed');

        if (filteredCompletedAppointments.length === 0) {
            document.querySelector('#swine-medical__history-list').innerHTML = 'No Medical History.';
            return; // stop execution
        }

        let swineHealthRecordsHTML = '';
        for (const appointment of filteredCompletedAppointments) {
            const serviceName = await getServiceName(appointment.appointmentService)
            const medicineName = await getMedicineName(appointment.medicine);
            swineHealthRecordsHTML += `
                <hr>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${formattedDate(appointment.appointmentDate)}</p>
                <p><strong>Medicine:</strong> ${medicineName}</p>
            `;
        }

        document.querySelector('#swine-medical__history-list').innerHTML = swineHealthRecordsHTML;

    } catch (err){
        console.error("Something went wrong went getting swine records");
    }
}


// ======================================
// ========== Get Swine Health History
// ======================================
const getSwineHealthHistory = async (swineId) => {

    try {

        let swineMontlyWeight = [];

        const swineRecordsResponse = await getSwineRecords();
        const filteredSwine = swineRecordsResponse.records.filter(swine => swine.swineId === swineId);

        // Month names for display
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        filteredSwine.forEach(data => {
            swineMontlyWeight.push({
                month: monthNames[data.month - 1],  // Convert 7 -> July
                weight: data.monthlyWeight
            });
        });


        lineGraph(swineMontlyWeight);

    } catch (err) {
        console.error("Something went wrong when getting swine records", err);
    }
};


// ======================================
// ========== Get Swine Health History
// ======================================
const displayAllSwineWeight = async () => {
    const client = await fetchClient();
    const { _id } = client;

    try {
        const swinesResponse = await fetchSwines();
        const clientSwines = swinesResponse.filter(swine => swine.clientId === _id && (swine.status !== 'sold' && swine.status !== 'deceased'));

        // ✅ X-axis categories (Swine Types)
        const categories = ["Sow", "Boar", "Piglet", "Grower"];

        // ✅ Create series: each swine as a series
        const series = clientSwines.map(swine => {
            const typeIndex = categories.indexOf(swine.type.charAt(0).toUpperCase() + swine.type.slice(1));
            let data = [0, 0, 0, 0];
            data[typeIndex] = swine.weight || 0;

            return {
                name: swine.swineFourDigitId, // Swine ID as series name
                data: data
            };
        });

        barGraph(categories, series);

    } catch (err) {
        console.error("Something went wrong when getting swine records", err);
    }
};


// ======================================
// ========== Update User Swine Type
// ======================================
const automaticallyUpdateSwineType = async() => {
    const user = await fetchClient();
    const clientId = user._id;

    try {
        const response = await api.put(`/swine/update/swine-type/user/${clientId}`);
        if (response.status === 200) {
            console.log(response.data.message);
        }
    } catch (err) {
        console.error("Error updating swine types:", err);
    }
    
}




export {
    automaticallyUpdateSwineType,
    displayClientSwines,
    displayFullSwineDetails,
    displayAllSwineWeight
};
