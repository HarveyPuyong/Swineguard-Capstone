import displayContactList from "./display-contact-list.js";
import displayClientConversation from "./display-messages.js";

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
const viewProfilePopBox = () => {
  const profileBox = document.querySelector('.profile-view');
  profileHTML = `
    <img class="profile-view__user-image" src="images-and-icons/images/example-user-profile-pic.jpg" alt="user image" >
    <h2 class="profile-view__user-name">User Name</h2>
    <p class="profile-view__user-email">user@gmail.com</p>
    <button class="profile-view__back-btn">Back</button>
  `
}


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  displayContactList();
  showConversation();
}