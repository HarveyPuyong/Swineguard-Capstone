import api from '../../client-utils/axios-config.js';
import popupAlert from '../../../admin/utils/popupAlert.js';
import {displayClientSwines} from './display-swine.js';

let currentSwineId = null;

const handleFormSubmit = async (e) => {
  e.preventDefault();

  const editSwineForm = document.querySelector('#swines-full-info');
  if (!currentSwineId) return;

  try {
    const typeInput = editSwineForm.querySelector('#select-swine-type');
    const statusInput = editSwineForm.querySelector('#select-swine-health-status');
    const weightInput = editSwineForm.querySelector('#swine-weight');
    const causeInput = editSwineForm.querySelector('#death-cause');

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const swineData = {
      type: typeInput?.value,
      status: statusInput?.value,
      weight: weightInput?.value,
      cause: causeInput?.value,
    };

    const swineDataForMonthlyRecords = {
      monthlyStatus: statusInput?.value,
      monthlyWeight: weightInput?.value,
      swineId: currentSwineId,
      month,
      year
    };

    // ✅ Update swine details first
    const response = await api.put(`/swine/edit/${currentSwineId}`, swineData);
    if (response.status === 200) {
      popupAlert('success', 'Success', `Swine edited successfully`);
    }

    // ✅ Try saving monthly record
    try {
      const swineMonthlyRecords = await api.post('/swine/add/montly-swine-records', swineDataForMonthlyRecords);
      popupAlert('success', 'Success', 'Swine monthly record saved successfully.');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const confirmOverwrite = await Swal.fire({
          title: 'Record already exists',
          text: error.response.data?.message || 'This monthly record already exists. Do you want to overwrite it?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, overwrite',
          cancelButtonText: 'No'
        });

        if (confirmOverwrite.isConfirmed) {
          try {
            const overwriteResponse = await api.post('/swine/add/montly-swine-records', {
              ...swineDataForMonthlyRecords,
              overwrite: true
            });
            popupAlert('success', 'Success', overwriteResponse.data.message);
          } catch (overwriteErr) {
            popupAlert('error', 'Error', 'Failed to overwrite the swine record.');
          }
        }
      } else {
        popupAlert('error', 'Error', 'Failed to save swine monthly record.');
      }
    }

    // ✅ Reset form after everything
    editSwineForm.reset();
    editSwineForm.classList.remove('edit-mode');
    editSwineForm.classList.add('view-mode');
    editSwineForm.classList.remove('show');
    displayClientSwines();
    currentSwineId = null;

  } catch (error) {
    console.error(error);
    popupAlert('error', 'Error', `Editing swine failed: ${error}`);
  }
};





const updateSwineDetails = (swineId) => {
  currentSwineId = swineId;
};

const setupSwineFormListener = () => {
  const editSwineForm = document.querySelector('#swines-full-info');
  if (editSwineForm) {
    editSwineForm.addEventListener('submit', handleFormSubmit);
  }
};



const removeSwine = async (swineId) => {
  const confirmResult = await Swal.fire({
    title: 'Are you sure?',
    text: 'This swine will be removed.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it',
    cancelButtonText: 'No, cancel',
    reverseButtons: true
  });

  if (!confirmResult.isConfirmed) return; // If user clicks "No", do nothing

  try {
    const response = await api.patch(`/swine/remove/${swineId}`);

    if (response.status === 200) {
      popupAlert('success', 'Success', 'Swine removed successfully').then(() => {
        displayClientSwines();
      });
    }

  } catch (error) {
    console.log(error);
    popupAlert('error', 'Error', `Removing swine failed: ${error}`);
  }
};

export {
    setupSwineFormListener ,
    updateSwineDetails,
    removeSwine
};