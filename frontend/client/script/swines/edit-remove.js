import api from '../../client-utils/axios-config.js';
import popupAlert from '../../../admin/utils/popupAlert.js';
import {displayClientSwines} from './display-swine.js';

// const updateSwineDetails = (swineId) => {
//   const editSwineForm = document.querySelector('#swines-full-info');
//   editSwineForm.addEventListener('submit', async(e) => {
//       e.preventDefault();

//       try {
          
//           //Swine Details
//           const typeInput = editSwineForm.querySelector('#select-swine-type');
//           const statusInput = editSwineForm.querySelector('#select-swine-health-status');
//           const weightInput = editSwineForm.querySelector('#swine-weight'); // or give it an ID like '#input-swine-weight'
//           const causeInput = editSwineForm.querySelector('#death-cause');

//           const swineData = {
//               type: typeInput?.value,
//               status: statusInput?.value,
//               weight: weightInput?.value,
//               cause: causeInput?.value,
//           };

//           console.log(swineData);
//           const response = await api.put(`/swine/edit/${swineId}`, swineData);
          
//           if(response.status === 200) {
//               popupAlert('success', 'Success', `Swine edited successully`).
//               then(() => {
//                   editSwineForm.reset();
//                   editSwineForm.classList.remove('edit-mode');
//                   editSwineForm.classList.add('view-mode');
//                   editSwineForm.classList.remove('show');
//                   displayClientSwines();
                  
//               });    
//           }

//       } catch (error) {
//           console.log(error)
//           popupAlert('error', 'Error', `Adding swine error ${error}`)
//       }

//   });
// }



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

    const swineData = {
      type: typeInput?.value,
      status: statusInput?.value,
      weight: weightInput?.value,
      cause: causeInput?.value,
    };

    const response = await api.put(`/swine/edit/${currentSwineId}`, swineData);

    if (response.status === 200) {
      popupAlert('success', 'Success', `Swine edited successfully`).then(() => {
        editSwineForm.reset();
        editSwineForm.classList.remove('edit-mode');
        editSwineForm.classList.add('view-mode');
        editSwineForm.classList.remove('show');
        displayClientSwines();
        currentSwineId = null;
      });
    }

  } catch (error) {
    console.log(error);
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