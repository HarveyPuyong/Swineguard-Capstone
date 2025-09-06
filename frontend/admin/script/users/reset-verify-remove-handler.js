import api from "../../utils/axiosConfig.js";
import handleRenderUsersTable from "./display-users-table.js";
import popupAlert from "../../utils/popupAlert.js";
import fetchUsers from "../../api/fetch-users.js";

// ======================================
// ==========Handle Verify User
// ======================================
const handleVerifyUser = (userId) => {
  Swal.fire({
    title: "Verify this user?",
    text: "This action will fully verified user",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#32dc4eff",
    cancelButtonColor: "#d63038ff",
    confirmButtonText: "Yes, Verify it!",
    cancelButtonText: "Cancel"
  }).then(async (result) => {
      if (result.isConfirmed) {
        try {
        const response = await api.patch(`/verify/${userId}`);

        if (response.status === 200) {
          Swal.fire("Success", "User Verified successfully", "success");
          handleRenderUsersTable(); // refresh list
        }
        } catch (err) {
          const errMessage =
            err.response?.data?.message || err.response?.data?.error || "Something went wrong.";
            popupAlert("error", "Error!", errMessage);
          }
      }
    });

};


// ======================================
// ==========Handle Reset User
// ======================================

const handleResetUser = async (userId) => {
  const resetUserForm = document.querySelector('#reset-user-form');

  // Clone to remove previous submit listeners
  const clonedForm = resetUserForm.cloneNode(true);
  resetUserForm.replaceWith(clonedForm);

  // Updated references after replacing the form
  const updatedForm = document.querySelector('#reset-user-form');
  const emailInput = updatedForm.querySelector('#user-email-input');
  const passwordInput = updatedForm.querySelector('#new-password-input');
  const confirmPasswordInput = updatedForm.querySelector('#confirm-password-input');

  // Get user data and set email field
  const users = await fetchUsers();
  const user = users.find(user => user._id === userId);
  if (user) {
    emailInput.value = user.email;
  }

  updatedForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const email = emailInput.value.trim();

    if (password !== confirmPassword) {
      popupAlert('warning', 'Password Mismatch', 'Please type matching passwords.');
      return;
    }

    const userData = { email, password };

    try {
      const response = await api.patch(`/reset/${userId}`, userData);

      if (response.status === 200) {
        popupAlert('success', 'Success', `Account "${email}" successfully reset.`).then(() => {
          updatedForm.reset();
          document.querySelector('.reset-user-credentials-form')?.classList.remove('show');
          handleRenderUsersTable();
        });
      }
    } catch (error) {
      const errMessage = error.response?.data?.message || 'Something went wrong.';
      popupAlert('error', 'Error!', errMessage);
    }
  });

  // Cancel button handler
  const cancelButton = document.querySelector('.cancel-btn');
  cancelButton.addEventListener('click', () => {
    updatedForm.reset();
    document.querySelector('.reset-user-credentials-form')?.classList.remove('show');
  });
};


export {
  handleVerifyUser,
  handleResetUser
}