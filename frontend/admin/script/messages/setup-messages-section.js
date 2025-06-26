// ======================================
// ========== Show Convo Box
// ======================================
// const showConvoBox = () => {
//   const usersList = document.querySelectorAll('.sidebar-chat-panel .chat-list__user');
//   usersList.forEach(user => {
//     user.addEventListener('click', () => {
//       const chatboxConvo = document.querySelector('.chat-box__main-contents');
//       const chatboxDescription = document.querySelector('.chat-box__description');
//       chatboxDescription.style.display = 'none'
//       chatboxConvo.style.display = 'block'
//     });
//   });
// }

import fetchUser from './../auth/fetchUser.js';
import { fetchMessages, fetchClient } from '../auth/fetchMessage.js';

const showConvoBox = () => {
  const chatListContainer = document.querySelector('.chat-list');

  chatListContainer.addEventListener('click', async (e) => {
    const userDiv = e.target.closest('.chat-list__user');
    if (!userDiv) return;

    const clientId = userDiv.dataset.clientId;
    if (!clientId) return;

    // Show conversation box
    const chatboxConvo = document.querySelector('.chat-box__main-contents');
    const chatboxDescription = document.querySelector('.chat-box__description');
    const convoList = document.querySelector('.convo-list');

    chatboxDescription.style.display = 'none';
    chatboxConvo.style.display = 'block';

    // Fetch everything needed
    const [coordinator, messages, clients] = await Promise.all([
      fetchUser(),
      fetchMessages(),
      fetchClient()
    ]);

    const acId = coordinator._id;
    const client = clients.find(c => c._id === clientId);
    const fullName = `${client.firstName} ${client.middleName} ${client.lastName}`;
    const profileImage = 'images-and-icons/images/example-user-profile-pic.jpg'; // or from DB

    // Filter messages between AC and that client
    const conversation = messages
      .filter(msg =>
        (msg.sender === acId && msg.receiver === clientId) ||
        (msg.sender === clientId && msg.receiver === acId)
      )
      .sort((a, b) => new Date(a.dateSend) - new Date(b.dateSend));


      // Clear existing text
      document.querySelector('.chat-box__header').innerHTML = '';

      // Client header Name:
      const headerDetails = `
        <img class="chat-box__header-user-img" src="images-and-icons/images/example-user-profile-pic.jpg" alt="user-img">
        <div class="chat-box__header-user-name-and-active-status">
          <p class="chat-box__header-user-name">${client.firstName} ${client.middleName} ${client.lastName}</p>
          <p class="chat-box__header-user-active-status">
            <span class="chat-box__header-user-active-status--dot"></span>
            <span class="chat-box__header-user-active-status--label">Active</span>
          </p>
        </div>
        <div class="chat-box__header-icons-container">
          <i class="chat-box__header-icon fas fa-phone"></i>
          <i class="chat-box__header-icon fas fa-ellipsis-v"></i> 
        </div>
      `;
      document.querySelector('.chat-box__header').innerHTML = headerDetails;


    // Render the conversation
    convoList.innerHTML = ''; // Clear previous

    conversation.forEach(msg => {
      const time = new Date(msg.dateSend).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (msg.sender === acId) {
        convoList.innerHTML += `
          <div class="convo-list__admin-chat">
            <p class="convo-list__admin-chat-time-sent time-sent">${time}</p>
            <p class="convo-list__admin-chat-message chat-message">${msg.content}</p>
          </div>
        `;
      } else {
        convoList.innerHTML += `
          <div class="convo-list__user-chat">
            <div class="convo-list__user-chat-time-sent time-sent">${time}</div>
            <div class="convo-list__user-chat-details">
              <img class="convo-list__user-chat-details--img" src="${profileImage}" alt="user-image">
              <p class="convo-list__user-chat-details--name">${fullName}</p>
            </div>
            <p class="convo-list__user-chat-message chat-message">${msg.content}</p>
          </div>
        `;
      }
    });
  });
};




// ======================================
// ========== View Profile
// ======================================
// const viewProfile = () => {
//   const userProfile = document.querySelector('#messages-section .profile-view');

//   const userImg = document.querySelector('.chat-box__header-user-img')
//     .addEventListener('click', () => userProfile.classList.add('show'));

//   const profileviewBackBtn = document.querySelector('.profile-view__back-btn')
//     .addEventListener('click', () => userProfile.classList.remove('show'))
// }

const viewProfile = () => {
  const userProfile = document.querySelector('#messages-section .profile-view');
  const userImg = document.querySelector('.chat-box__header-user-img');
  const backBtn = document.querySelector('.profile-view__back-btn');

  if (userImg && userProfile) {
    userImg.addEventListener('click', () => userProfile.classList.add('show'));
  }

  if (backBtn && userProfile) {
    backBtn.addEventListener('click', () => userProfile.classList.remove('show'));
  }
}


// ======================================
// ========== Main Function - Setup Messages Section
// ======================================
export default function setupMessagesSection() {
  showConvoBox();
  viewProfile();
}
