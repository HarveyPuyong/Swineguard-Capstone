import fetchUser from './../auth/fetchUser.js';
import displayContactList from './display-contact-list.js';
import renderConversation from './handle-display-conversation.js';

// ======================================
// ========== Show Conversation
// ======================================
const showConversation = () => {
  document.addEventListener('renderContactList', () => {
    const contactList = document.querySelectorAll('.sidebar-chat-panel .chat-list__user');

    contactList.forEach(user => {
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
// ========== Search Contact List
// ======================================
const searchContactList = () => {
  document.addEventListener('renderContactList', () => {
    const searchInput = document.querySelector('#messages-section .sidebar-chat-panel__search-input');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const usersList = document.querySelectorAll('#messages-section .chat-list__user');

      usersList.forEach(user => {
        const name = user.querySelector('.chat-list__user-name')?.textContent.toLowerCase() || '';

        if (name.includes(searchTerm)) {
          user.style.display = '';
        } else {
          user.style.display = 'none';
        }
      });
    });
  });
};


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  displayContactList();
  searchContactList();
  showConversation();
  viewProfile();
}

