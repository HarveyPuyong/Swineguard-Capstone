
import popupAlert from './../../utils/popupAlert.js';
import api from '../../utils/axiosConfig.js';
import { renderSchedulesFromCalendar } from './render-vet-schedules.js';


function handleAddNewSchedule (clickedDate, userID){
  const addNewScheduleForm = document.querySelector('.vet-schedule-form');

  addNewScheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceFormData = {
      title: document.getElementById('schedule-title').value, 
      description: document.getElementById('schedule-description').value, 
      date: clickedDate, 
      userId: userID
    }

    console.log(serviceFormData);
    const overlay = document.querySelector('.calendar-overlay');

    try {
      const response = await api.post(`/schedule/vet/personal-sched/${userID}`, serviceFormData);

      if(response.status === 201){
        popupAlert('success', 'Success', `New schedule "${serviceFormData.title}" added successully.`).
          then(() => {
            addNewScheduleForm.reset();
            addNewScheduleForm.classList.remove('show');
            overlay.classList.remove('show'); 

            // Render the User Schedule
            renderSchedulesFromCalendar();
        });   
      }
    
    } catch (error) {
      // ✅ Handle backend validation messages
      if (error.response && error.response.data && error.response.data.message) {
        popupAlert("error", "Error", error.response.data.message);
      } else {
        popupAlert("error", "Error", "Something went wrong while adding the new schedule.");
      }

      console.error("Add new Schedule error:", error);
    }
  })

}


function handleAddNewScheduleFromSection (userID){
  const addNewScheduleForm = document.querySelector('.availability-vet-schedule-form');

  addNewScheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceFormData = {
      title: document.getElementById('availability-schedule-title').value, 
      description: document.getElementById('availability-schedule-description').value, 
      date: document.getElementById('availability-schedule-date').value, 
      userId: userID
    }

    console.log(serviceFormData);
    const overlay = document.querySelector('.availability-overlay');

    try {
      const response = await api.post(`/schedule/vet/personal-sched/${userID}`, serviceFormData);

      if(response.status === 201){
        popupAlert('success', 'Success', `New schedule "${serviceFormData.title}" added successully.`).
          then(() => {
            addNewScheduleForm.reset();
            addNewScheduleForm.classList.remove('show');
            overlay.classList.remove('show'); 

            // Render the User Schedule
            renderSchedulesFromCalendar();
        });   
      }
    
    } catch (error) {
      // ✅ Handle backend validation messages
      if (error.response && error.response.data && error.response.data.message) {
        popupAlert("error", "Error", error.response.data.message);
      } else {
        popupAlert("error", "Error", "Something went wrong while adding the new schedule.");
      }

      console.error("Add new Schedule error:", error);
    }
  })

}

function handleEditScheduleFromSection (scheduleId){
  const editScheduleForm = document.querySelector('.availability-vet-schedule-form-edit');

  editScheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editScheduleData = {
      title: document.getElementById('availability-schedule-title-edit').value, 
      description: document.getElementById('availability-schedule-description-edit').value, 
      date: document.getElementById('availability-schedule-date-edit').value
    }

    console.log(editScheduleData);
    const overlay = document.querySelector('.availability-overlay');

    try {
      const response = await api.put(`/schedule/edit/vet/personal-sched/${scheduleId}`, editScheduleData);

      if(response.status === 201){
        popupAlert('success', 'Success', `Schedule "${editScheduleData.title}" edited successully.`).
          then(() => {
            editScheduleForm.reset();
            editScheduleForm.classList.remove('show');
            overlay.classList.remove('show'); 

            // Render the User Schedule
            renderSchedulesFromCalendar();
        });   
      }
    
    } catch (error) {
      // ✅ Handle backend validation messages
      if (error.response && error.response.data && error.response.data.message) {
        popupAlert("error", "Error", error.response.data.message);
      } else {
        popupAlert("error", "Error", "Something went wrong while editing the schedule.");
      }

      console.error("Edit Schedule error:", error);
    }
  })

}

export { handleAddNewSchedule, handleAddNewScheduleFromSection, handleEditScheduleFromSection }