// ======================================
// ========== Show Conversation
// ======================================
const showConversation = () => {
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

      // Show convo in mobile view
      if (window.innerWidth <= 1100) {
        contactListContainer.classList.remove('show');
        chatboxContainer.classList.add('show');
        sectionHeading.style.display = 'none';
        backToContactListBtn.classList.add('show');

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
}


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  showConversation();
}