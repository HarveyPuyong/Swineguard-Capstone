// ======================================
// ========== Show Convo Box
// ======================================
const showConvoBox = () => {
  const usersList = document.querySelectorAll('.sidebar-chat-panel .chat-list__user');
  usersList.forEach(user => {
    user.addEventListener('click', () => {
      const chatboxConvo = document.querySelector('.chat-box__main-contents');
      const chatboxDescription = document.querySelector('.chat-box__description');
      chatboxDescription.style.display = 'none'
      chatboxConvo.style.display = 'block'
    });
  });
}

// ======================================
// ========== View Profile
// ======================================
const viewProfile = () => {
  const userProfile = document.querySelector('#messages-section .profile-view');

  const userImg = document.querySelector('.chat-box__header-user-img')
    .addEventListener('click', () => userProfile.classList.add('show'));

  const profileviewBackBtn = document.querySelector('.profile-view__back-btn')
    .addEventListener('click', () => userProfile.classList.remove('show'))
}


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  showConvoBox();
  viewProfile();
}
