import  handleRenderUsersTable from "./display-users-table.js";
import handleUserFullview from "./user-profile-fullview.js";


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
   document.addEventListener('renderUsersTable', () => {
      const userTableContents = document.querySelector('#users-section .user-section__table-contents');
      const userProfileContents = document.querySelector('#users-section .user-profile-full-view');
      const buttons = document.querySelectorAll('.users-table .buttons-container button');

      buttons.forEach(button => {
         button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            //console.log(userId)
      
            if(button.classList.contains('view-user-profile-btn')){
               handleUserFullview(userId);
               userTableContents.classList.remove('show');
               userProfileContents.classList.add('show');
            }
            else if(button.classList.contains('verify-user-btn')){ 
               // Call mo dito yung pag verify User na function
            }
            else if(button.classList.contains('reset-user-credential-btn')){ 
               // Call mo dito yung pag reset ng user credentials function
            }
            else if(button.classList.contains('remove-user-btn')){ 
               // Call mo dito yung pag remove user function
            }
         });
      });

   });

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