import displayContactList from "./display-contact-list.js";
import displayClientConversation from "./display-messages.js";
import fetchUsers from "../../../admin/api/fetch-users.js";

// ======================================
// ========== Show Conversation
// ======================================
const showConversation = () => {
  const sectionHeading = document.querySelector('#messages-section .section__heading');
  const chatboxContainer = document.querySelector('.chat-box');
  const backToContactListBtn = document.querySelector('.back-to-contact-list-btn');
  const chatboxConvo = document.querySelector('.chat-box__main-contents');
  const preHeading = document.querySelector('.pre-heading-text');
  const chatHeader = document.querySelector('.chat-box__header');
  const convoList = document.querySelector('.convo-list');
  const contactListContainer = document.querySelector('.sidebar-chat-panel');

  document.addEventListener('renderContactList', () => {
    document.querySelectorAll('.chat-list__user').forEach(user => {
      user.addEventListener('click', () => {
        const staffId = user.getAttribute('data-client-id');
        displayClientConversation(staffId); // Load messages

        // Hide the pre-heading text and show the convo parts
        preHeading.classList.add('hide');
        preHeading.classList.remove('show');

        chatHeader.classList.remove('hide');
        convoList.classList.remove('hide');

        // Mobile view adjustments
        if (window.innerWidth <= 1100) {
          contactListContainer.classList.remove('show');
          chatboxContainer.classList.add('show');
          sectionHeading.style.display = 'none';
          backToContactListBtn.classList.add('show');
        }
      });

      if (window.innerWidth <= 1100) {
        contactListContainer.classList.add('show');
        chatboxContainer.classList.remove('show');
        sectionHeading.style.display = 'block';
        backToContactListBtn.classList.remove('show');
      }
    });
  });

  // Back to contact list
  backToContactListBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1100) {
      contactListContainer.classList.add('show');
      chatboxContainer.classList.remove('show');
      sectionHeading.style.display = 'block';
      backToContactListBtn.classList.remove('show');
    }
  });
};


// ======================================
// ========== Profile view click even
// ======================================
const viewProfilePopBox = async(staffId) => {
  const profileBox = document.querySelector('.profile-view');

  const users = await fetchUsers();
  const vetStaff = users.find(user => user._id === staffId);

  const profileHTML = `
    <img class="profile-view__user-image" src="${vetStaff.profileImage ? '/uploads/' + vetStaff.profileImage : 'images-and-icons/icons/default-profile.png'}" alt="user image" >
    <h2 class="profile-view__user-name">${vetStaff?.firstName || 'User'} ${vetStaff?.lastName || 'Name'}</h2>
    <p class="profile-view__user-email">${vetStaff?.email || 'user email'}</p>
    <button class="profile-view__back-btn">Back</button>
  `;

  document.querySelector('.profile-view').innerHTML = profileHTML;
  document.dispatchEvent(new Event('renderProfilePopUpView'));

}



// ======================================
// ========== Profile view click even
// ======================================
const toggleProfileView = () => {
  const profileImage = document.querySelector('.chat-box__header .chat-box__header-user-img');
  const popUpProfileView = document.querySelector('.profile-view');
  const vetId =  profileImage.dataset.vetId;

  profileImage.addEventListener('click', () => {
    popUpProfileView.classList.remove('hide');
    popUpProfileView.classList.add('show');
    viewProfilePopBox(vetId);
  });

  // Wait until profile HTML is rendered
  document.addEventListener('renderProfilePopUpView', () => {
    const profileViewBackBtn = document.querySelector('.profile-view .profile-view__back-btn');
    if (profileViewBackBtn) {
      profileViewBackBtn.addEventListener('click', () => {
        popUpProfileView.classList.remove('show');
        popUpProfileView.classList.add('hide');
      });
    }
  });

}



document.addEventListener('renderClientConversation', () => {
  toggleProfileView();
})


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  displayContactList();
  showConversation();
}