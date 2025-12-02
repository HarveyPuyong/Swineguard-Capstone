import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';
import updatedItemQuantity from '../../utils/deduct-item-stock.js';
import { fetchAppointments } from '../../api/fetch-appointments.js';
import {displayTaskList} from '../veterinarian/display-appoinment-task.js';


// ======================================
// ==========Handle Complete Appointment
// ======================================
let currentAppointmentId = null;
const completeTaskForm = document.querySelector('.complete-task-form');
const medicineSelectElement = document.querySelector('#completeTaskForm__set-medicine-list');
const medicineListContainer = document.querySelector('.follow-up__medicine-list');
const checkBoxContainer = document.querySelector(".check-box__swine-Ids"); // CheckBoxes of swine Ids

const handleCompleteAppointment = async (e) => {
  e.preventDefault();

  const allAppointments = await fetchAppointments();
  const appointment = allAppointments.find(app => app._id === currentAppointmentId);

  if (!appointment) {
    popupAlert('error', 'Error!', 'Appointment not found.');
    return;
  }

  // ====== GET SELECTED SWINES ======
  const selectedSwines = Array.from(
    checkBoxContainer.querySelectorAll('input[type="checkbox"]:checked')
  ).map(cb => cb.value);


  // ====== GET ALL MEDICINE ENTRIES ======
  const medicineListContainer = document.querySelector("#medicine-list-container");

  const medicationEntries = Array.from(
    medicineListContainer.querySelectorAll(".medicine-entry")
  );

  const medications = medicationEntries.map(entry => ({
    medicine: entry.querySelector(".medicine-select").value,
    variation: entry.querySelector(".variation-select").value,
    amount: Number(entry.querySelector(".amount-input").value)
  }));

  if (medications.length === 0) {
    popupAlert("error", "No medicine", "Please add at least one medicine entry.");
    return;
  }

  // ====== FINAL FORM DATA ======
  const formData = {
    medications,
    healthStatus: completeTaskForm.querySelector('#completeTaskForm__select-swine-health-status').value || 'none',
    causeOfDeath: completeTaskForm.querySelector('#completeTaskForm__cause-of-death').value || 'none',
    numberOfDeaths: completeTaskForm.querySelector('#completeTaskForm__num-of-death').value || 0
  };

  const itemId = completeTaskForm.querySelector('#completeTaskForm__set-medicine-var').value;

  try {
    // ====== PATCH COMPLETE APPOINTMENT ======
    const response = await api.patch(`/appointment/complete/${currentAppointmentId}`, formData);

    if (response.status === 200) {
      
      // ====== UPDATE SWINE STATUS ======
      if (selectedSwines.length > 0) {
        await api.patch(`/swine/update/is-under/monitoring`, {
          swineIds: selectedSwines,
          status: formData.healthStatus,
          cause: formData.causeOfDeath
        });
      }

      popupAlert('success', 'Success!', 'Appointment Completed successfully').then(() => {

        updatedItemQuantity(formData.medications);

        completeTaskForm.reset();
        handleRenderAppointments();
        appointmentsDashboard();
        displayTaskList();

        completeTaskForm.classList.remove("show");

      });
    }

  } catch (err) {

    console.error("❌ Error completing appointment:", err);

    const errMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong. Please try again.";

    popupAlert('error', 'Error!', errMessage);
  }
};


const completeAppointmentRequest = (appointmentId) => {
  currentAppointmentId = appointmentId;
};

const setupCompleteAppointmentFormListener = () => {
  const completeTaskForm = document.querySelector('.complete-task-form');
  if (completeTaskForm) {
    completeTaskForm.addEventListener('submit', handleCompleteAppointment); 
  }
};


// ======================================
// ==========Handle Restore Appointment
// ======================================
const handleRestoreAppointment = async(appointmentId) => {
  try{
      const response = await api.patch(`/appointment/restore/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment restore successfully')
          .then(() => {
            handleRenderAppointments();
            appointmentsDashboard();
          });
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


// ======================================
// ==========Handle Delete Appointment
// ======================================
const handleDeleteAppointment = async(appointmentId) => {
  try{
      const response = await api.delete(`/appointment/delete/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment Deleted successfully')
          .then(() => {
            handleRenderAppointments()
            appointmentsDashboard();
          });;
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


// ======================================
// ==========Handle Update Appointment
// ======================================
const handleFollowUpAppointment = async (e) => {
  e.preventDefault();

  const form = document.querySelector(".follow-up-task-form");

  const allAppointments = await fetchAppointments();
  const appointment = allAppointments.find(app => app._id === currentAppointmentId);

  if (!appointment) {
    popupAlert("error", "Error!", "Appointment not found.");
    return;
  }

  // ====== GET SWINES SELECTED ======
  const selectedSwines = Array.from(
    form.querySelectorAll('.check-box__swine-Ids input[type="checkbox"]:checked')
  ).map(cb => cb.value);

  // ====== GET ALL MEDICINE ENTRIES ======
  const medicineListContainer = form.querySelector("#followUp-medicine-list-container");

  const medicationEntries = Array.from(
    medicineListContainer.querySelectorAll(".medicine-entry")
  );

  const medications = medicationEntries.map(entry => ({
    medicine: entry.querySelector(".medicine-select").value,
    variation: entry.querySelector(".variation-select").value,
    amount: Number(entry.querySelector(".amount-input").value)
  }));

  if (medications.length === 0) {
    popupAlert("error", "No medicine", "Please add at least one medicine entry.");
    return;
  }

  // ====== GET SWINE STATUS FIELDS ======
  const swineStatusSelect = form.querySelector("#followUpForm__swine-status");
  const causeInput = form.querySelector("#followUpForm__cause");
  const deathInput = form.querySelector("#followUpForm__death-count");

  const followUpData = {
    medications,
    healthStatus: swineStatusSelect.value,
    causeOfDeath: causeInput.value || "none",
    appointmentDate: form.querySelector("#followUpForm__date").value,
    numberOfDeaths: Number(deathInput.value) || 0
  };

  try {
    const response = await api.patch(
      `/appointment/follow-up/${currentAppointmentId}`,
      followUpData
    );

    if (response.status === 200) {
      // Update swine status
      if (selectedSwines.length > 0) {
        await api.patch(`/swine/update/is-under/monitoring`, {
          swineIds: selectedSwines,
          status: followUpData.healthStatus,
          cause: followUpData.causeOfDeath
        });
      }

      popupAlert("success", "Success", "Follow-up saved successfully").then(() => {
        form.reset();
        handleRenderAppointments();
        appointmentsDashboard();
        displayTaskList();
        form.classList.remove("show");
        updatedItemQuantity(followUpData.medications);
        //console.log("Medications payload to update:", followUpData.medications);
      });
    }

  } catch (err) {
    console.error("Follow-up error:", err);

    const errMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong.";

    popupAlert("error", "Error!", errMessage);
  }
};



const setupFollowUpAppointmentFormListener = () => {
  const followUpTaskForm = document.querySelector('.follow-up-task-form');
  if (followUpTaskForm) {
    followUpTaskForm.addEventListener('submit', handleFollowUpAppointment); 
  }
};



export {
          handleRestoreAppointment, 
          handleDeleteAppointment, 
          completeAppointmentRequest,
          setupFollowUpAppointmentFormListener,
          setupCompleteAppointmentFormListener
        };