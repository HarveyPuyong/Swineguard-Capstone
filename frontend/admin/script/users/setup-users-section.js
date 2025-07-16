import  handleRenderUsersTable from "./display-users-table.js";
import handleUserFullview from "./user-profile-fullview.js";
import { handleVerifyUser, handleResetUser } from "./reset-verify-remove-handler.js";
import fetchUsers from "../../api/fetch-users.js";


// ======================================
// ========== Toggle More Buttons
// ======================================
const toggleMoreButtons = () => {
  document.addEventListener('renderUsersTable', () => {
    const toggleIcons = document.querySelectorAll('.users-table .toggle-buttons-icon');

    toggleIcons.forEach(icon => {
      const buttonsContainer = icon.nextElementSibling;

      icon.addEventListener('click', () => {
        icon.classList.toggle('active');

        if (icon.classList.contains('active')) {
          buttonsContainer.classList.add('show');
        } else {
          buttonsContainer.classList.remove('show');
        }

        // Optional: Close other toggle buttons
        toggleIcons.forEach(otherIcon => {
          if (otherIcon !== icon) {
            otherIcon.classList.remove('active');
            otherIcon.nextElementSibling.classList.remove('show');
          }
        });
      });
    });
  });
};


// ======================================
// ========== Users Buttons Actions
// ======================================
const handleUsersButtonsAction = () => {
   document.addEventListener('renderUsersTable', async() => {
      const userTableContents = document.querySelector('#users-section .user-section__table-contents'); // User Table
      const userProfileContents = document.querySelector('#users-section .user-profile-full-view'); // Profile Form
      const verifyUserForm = document.querySelector('.verify-user-popup-backdrop'); // Verify Form
      const buttons = document.querySelectorAll('.users-table .buttons-container button');
      const userResetForm = document.querySelector('.reset-user-credentials-form'); // Reset Form

      const users = await fetchUsers();
      
      buttons.forEach(button => {
         const userId = button.dataset.userId;
         const matchedUser = users.find(user => user._id === userId);

         // Pre-check and disable before adding click listener
         if (button.classList.contains('verify-user-btn') && matchedUser?.isRegistered) {
            button.disabled = true;
            button.textContent = 'Verified';
            return; 
         }
         //console.log(userId)

         button.addEventListener('click', () => {
      
            if(button.classList.contains('view-user-profile-btn')){
               handleUserFullview(userId);
               userTableContents.classList.remove('show');
               userProfileContents.classList.add('show');
            }
            else if(button.classList.contains('verify-user-btn')){
               handleVerifyUser(userId);
               verifyUserForm.classList.add('show');

               const cancelVerifyBtn = document.querySelector('#cancel-verfiy-btn');
               if (cancelVerifyBtn) {
                  cancelVerifyBtn.addEventListener('click', () => {
                     verifyUserForm.classList.remove('show');
                  });
               }
            }
            else if(button.classList.contains('reset-user-credential-btn')){ 
               //alert('Working')
               handleResetUser(userId);
               userResetForm.classList.add('show');
            }

         });
      });

   });

   // Back Button
   const backToUserTableBtn = document.querySelector('.user-profile-full-view__back-btn');
   if (backToUserTableBtn) {
      backToUserTableBtn.addEventListener('click', () => {
            const userTableContents = document.querySelector('#users-section .user-section__table-contents');
            const userProfileContents = document.querySelector('#users-section .user-profile-full-view');

            userTableContents.classList.add('show');
            userProfileContents.classList.remove('show');
      });
   }
}




// ======================================
// ========== Main Function - Setup TUsers Section
// ======================================
export default function setupUsersSection() {
   handleRenderUsersTable();
   toggleMoreButtons();
   handleUsersButtonsAction();
}