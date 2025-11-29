import api from "../../utils/axiosConfig.js";
import handleRenderUsersTable from "./display-users-table.js";
import popupAlert from "../../utils/popupAlert.js";
import fetchUsers from "../../api/fetch-users.js";
import fetchVerificationImages from "../../api/fetch-verification-images.js";


// ======================================
// ==========Handle Verify User
// ======================================
// const handleVerifyUser = async (userId) => {
//   try {
//     // 1. Fetch all verification images from backend
//     const images = await fetchVerificationImages();

//     // 2. Get user’s uploaded permit
//     const filterUser = images.find(img => img.userId === userId);

//     if (!filterUser) {
//       return Swal.fire({
//         icon: "error",
//         title: "No Verification Image",
//         text: "This user has not uploaded their permit yet."
//       });
//     }

//     const imageOfPermit = filterUser.imageUrl;
//     const fullPermitImageUrl = `/uploads/${filterUser.imageUrl}`;

//     // 3. SweetAlert dialog with preview of the uploaded permit
//     Swal.fire({
//       title: "Verify this user?",
//       html: `
//         <p>This user uploaded the following permit:</p>
//         <img src="${fullPermitImageUrl}" 
//              style="width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; margin-top: 10px;" />
//         <p style="margin-top:10px;">Proceed with verification?</p>
//       `,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#32dc4eff",
//       cancelButtonColor: "#d63038ff",
//       confirmButtonText: "Yes, Verify User",
//       cancelButtonText: "Cancel"
//     }).then(async (result) => {

//       if (result.isConfirmed) {
//         try {
//           // 4. Backend PATCH request
//           const response = await api.patch(`/verify/${userId}`);

//           if (response.status === 200) {
//             Swal.fire("Success", "User has been verified.", "success");
//             handleRenderUsersTable(); // refresh list
//           }

//         } catch (err) {
//           const errMessage =
//             err.response?.data?.message ||
//             err.response?.data?.error ||
//             "Something went wrong.";

//           popupAlert("error", "Error!", errMessage);
//         }
//       }
//     });

//   } catch (err) {
//     Swal.fire({
//       icon: "error",
//       title: "Error fetching user permit",
//       text: err.message
//     });
//   }
// };


const handleVerifyUser = async (userId) => {
  try {
    const images = await fetchVerificationImages();
    const filterUser = images.find(img => img.userId === userId);

    if (!filterUser) {
      return Swal.fire({
        icon: "error",
        title: "No Verification Image Found",
        text: "This user has not uploaded any permit image."
      });
    }

    const imageUrl = `/uploads/${filterUser.imageUrl}`;

    Swal.fire({
      title: "Verify this user?",
      html: `
        <p>This user uploaded the following permit:</p>

        <!-- CLICKABLE IMAGE THAT OPENS IN NEW TAB -->
        <a href="${imageUrl}" target="_blank">
          <img 
            src="${imageUrl}" 
            style="width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; cursor: pointer; margin-top: 10px;"
          />
        </a>

        <p style="margin-top: 10px;">Click the image to view it in full size.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#32dc4eff",
      cancelButtonColor: "#d63038ff",
      confirmButtonText: "Yes, Verify User",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.patch(`/verify/${userId}`);

          if (response.status === 200) {
            Swal.fire("Success", "User verified successfully!", "success");
            handleRenderUsersTable();
          }
        } catch (err) {
          const errMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Something went wrong.";

          popupAlert("error", "Error!", errMessage);
        }
      }
    });

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message
    });
  }
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