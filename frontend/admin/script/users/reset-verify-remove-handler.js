import api from "../../utils/axiosConfig.js";
import handleRenderUsersTable from "./display-users-table.js";
import popupAlert from "../../utils/popupAlert.js";

// ======================================
// ==========Handle Verify User
// ======================================
const handleVerifyUser = (userId) => {
  const confirmationForm = document.querySelector('.verify-user-popup-textbox');

  // Clone the form to remove any previous submit listeners
  const newForm = confirmationForm.cloneNode(true);
  confirmationForm.replaceWith(newForm);

  // Now select the input from the new (current) form
  const confirmTextInput = newForm.querySelector('#verify-user-txt');

  newForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInput = confirmTextInput.value.trim();

    if (userInput !== 'CONFIRM') {
      popupAlert('warning', 'Input Required', 'Please type "CONFIRM" to proceed.');
      return;
    }

    try {
      const confirmationResponse = await api.patch(`/verify/${userId}`);

      if (confirmationResponse.status === 200) {
        popupAlert('success', 'Success!', 'User Verified successfully').then(() => {
          document.querySelector('.verify-user-popup-backdrop')?.classList.remove('show');
          handleRenderUsersTable();
        });
      }
    } catch (err) {
      const errMessage = err.response?.data?.message || err.response?.data?.error || 'Unknown error';
      popupAlert('error', 'Error!', errMessage);
    }
  });
};

// ======================================
// ==========Handle Reset User
// ======================================
const handleResetUser = async (userId) => {
    // Coming Soon
}

export {
    handleVerifyUser
}