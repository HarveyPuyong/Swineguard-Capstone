import displayContactList from './display-contact-list.js';
import renderConversation from './handle-display-conversation.js';

// ======================================
// ========== Show Conversation
// ======================================
const showConversation = () => {
  document.addEventListener('renderContactList', () => {
    const sectionHeading = document.querySelector('#messages-section .section__heading')
    const chatboxContainer = document.querySelector('.chat-box');
    const backToContactListBtn = document.querySelector('.back-to-contact-list-btn');
    const chatboxConvo = document.querySelector('.chat-box__main-contents');
    const chatboxDescription = document.querySelector('.chat-box__description');
    const contactListContainer = document.querySelector('.sidebar-chat-panel');
    const contactList = document.querySelectorAll('.sidebar-chat-panel .chat-list__user');

    contactList.forEach(user => {
      user.addEventListener('click', () => {
        chatboxDescription.style.display = 'none'
        chatboxConvo.style.display = 'block';

        const clientId = user.dataset.clientId;
        renderConversation(clientId);

        // Show convo in mobile view
        if (window.innerWidth <= 1100) {
          contactListContainer.classList.remove('show');
          chatboxContainer.classList.add('show');
          sectionHeading.style.display = 'none';
          backToContactListBtn.classList.add('show');
          renderConversation(clientId);
        }
      });
    });

    
    // Back to contact-list and hide convo in mobile view
    backToContactListBtn.addEventListener('click', () => {
      if (window.innerWidth <= 1100) {
        contactListContainer.classList.add('show');
        chatboxContainer.classList.remove('show');
        sectionHeading.style.display = 'block';
        backToContactListBtn.classList.remove('show');
      }
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

