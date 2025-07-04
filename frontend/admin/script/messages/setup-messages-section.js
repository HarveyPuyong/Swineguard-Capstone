import fetchUser from './../auth/fetchUser.js';
import displayContactList from './display-contact-list.js';
import renderConversation from './display-conversation.js';

// ======================================
// ========== Show Conversation
// ======================================
const showConversation = () => {
  document.addEventListener('renderContactList', () => {
    const contactList = document.querySelectorAll('.sidebar-chat-panel .chat-list__user');

    contactList.forEach(user => {
      console.log(user);
      user.addEventListener('click', () => {
        const chatboxConvo = document.querySelector('.chat-box__main-contents');
        const chatboxDescription = document.querySelector('.chat-box__description');
        chatboxDescription.style.display = 'none'
        chatboxConvo.style.display = 'block';

        const clientId = user.dataset.clientId;
        renderConversation(clientId)
      });
    });
  });
}





// ======================================
// ========== View Profile
// ======================================
const viewProfile = () => {
  document.addEventListener('renderConversation',  () => {
    const userProfile = document.querySelector('#messages-section .profile-view');
    const userImg = document.querySelector('.chat-box__header-user-img');
    const backBtn = document.querySelector('.profile-view__back-btn');

    if (userImg && userProfile) {
      userImg.addEventListener('click', () => userProfile.classList.add('show'));
    }

    if (backBtn && userProfile) {
      backBtn.addEventListener('click', () => userProfile.classList.remove('show'));
    }
  })
}


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  displayContactList();
  showConversation();
  viewProfile();
}

