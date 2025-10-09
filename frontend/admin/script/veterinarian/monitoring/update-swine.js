// ==========================
// update-swine.js
// ==========================
import api from "../../../utils/axiosConfig.js";
import popupAlert from "../../../utils/popupAlert.js";
import { renderMonitoringList } from "./render-swine-monitoring-list.js";

let currentSwineId = null;

export const updateSwineId = (swineId) => {
  currentSwineId = swineId;
};

export const handleUpdateSwine = async (e) => {
  e.preventDefault(); // ✅ just in case called from form submit
  const form = document.querySelector('#update-swine__monitoring');
  const updateForm = document.querySelector('.update-monitoring__client-swine');

  try {
    const swineData = {
      status: form.querySelector('#update-form-monitoring__select-swine-health-status').value,
      cause: form.querySelector('#update-form__monitoring-cause').value || 'none',
    };

    const response = await api.put(`/swine/update/swine/status/${currentSwineId}`, swineData);

    if (response.status === 200) {
      popupAlert('success', 'Success!', 'Swine updated successfully')
        .then(async() => {
          await renderMonitoringList();
          form.reset();
          updateForm.classList.remove('show'); // ✅ Close after success
        });
    }
  } catch (err) {
    const errMessage = err.response?.data?.message || err.response?.data?.error || "Something went wrong.";
    popupAlert('error', 'Error!', errMessage);
  }
};
