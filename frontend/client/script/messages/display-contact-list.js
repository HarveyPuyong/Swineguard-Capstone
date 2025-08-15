import { formatTo12HourTime } from '../../../admin/utils/formated-date-time.js';
import fetchClient from '../auth/fetch-client.js';
import fetchUsers from '../../../admin/api/fetch-users.js';
import fetchMessages from './fetch-messages.js';
import displayClientConversation from './display-messages.js';
import handleReplyMessage from './send-message-handler.js';


const displayContactList = async () => {
  try {
    const user = await fetchClient();
    const allUsers = await fetchUsers();
    const allMessages = await fetchMessages();

    const clientId = user._id;
    const chatListContainer = document.querySelector('.chat-list');
    chatListContainer.innerHTML = '';

    // Filter staff users only (AC and Veterinarians)
    const staffUsers = allUsers.filter(u =>
      u.roles.includes('appointmentCoordinator') || u.roles.includes('veterinarian')
    );

    const conversationsMap = new Map();

    allMessages.forEach(msg => {
      // Check if the current user is part of the conversation
      const isParticipant = msg.sender === clientId || msg.receiver === clientId;
      if (!isParticipant) return;

      // Get the other party's ID
      const otherUserId = msg.sender === clientId ? msg.receiver : msg.sender;

      // Skip if the other user is a client (prevent client-to-client)
      const otherUser = allUsers.find(u => u._id === otherUserId);
      if (!otherUser || otherUser.roles.includes('user')) return;

      // Group messages by other user's ID
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, []);
      }

      conversationsMap.get(otherUserId).push(msg);
    });

    // Generate chat list UI
    staffUsers.forEach(userInfo => {
      const messages = conversationsMap.get(userInfo._id) || [];

      let lastMessage = null;
      let previewMessage = 'Start a conversation...';
      let formattedTime = '';
      let unseenCount = 0;

      if (messages.length > 0) {
        messages.sort((a, b) => new Date(b.dateSend) - new Date(a.dateSend));
        lastMessage = messages[0];

        previewMessage = lastMessage.content.length > 40
          ? `${lastMessage.content.slice(0, 40)}...`
          : lastMessage.content;

        formattedTime = formatTo12HourTime(lastMessage.dateSend);

        unseenCount = messages.filter(
          msg => msg.sender === userInfo._id && msg.receiver === clientId && !msg.seen
        ).length;
      }

      const fullName = `${userInfo.firstName} ${(userInfo.middleName).charAt(0).toUpperCase()}. ${userInfo.lastName}`;

      const chatHTML = `
        <div class="chat-list__user" data-client-id="${userInfo._id}">
          <img class="chat-list__user-image" src="${userInfo.profileImage ? '/uploads/' + userInfo.profileImage : 'images-and-icons/icons/default-profile.png'}" alt="user image">
          <p class="chat-list__user-name-and-message">
            <span class="chat-list__user-name">${fullName}</span>
            <span class="chat-list__user-message">${previewMessage}</span>
          </p>
          <p class="chat-list__user-last-active-time">${formattedTime}</p>
          ${unseenCount > 0 ? `<p class="chat-list__user-number-of-message">${unseenCount}</p>` : ''}
        </div>
      `;

      chatListContainer.insertAdjacentHTML('beforeend', chatHTML);
    });
    

    document.dispatchEvent(new Event('renderContactList'));

  } catch (err) {
    console.error("Error displaying client messages:", err);
    document.querySelector('.chat-list').innerHTML = `
      <p class="text-center text-red">Failed to load messages.</p>`;
  }
};

// Render conversation
document.addEventListener('renderContactList', () => {
  document.querySelectorAll('.chat-list__user').forEach(user => {
    user.addEventListener('click', () => {
      const staffId = user.getAttribute('data-client-id');
      displayClientConversation(staffId);
    });
  });
});

// Reply Form
document.addEventListener('renderClientConversation', (e) => {
  const receiverId = document.querySelector('#client-reply-form').dataset.receiverId;
  handleReplyMessage(receiverId);
});


export default displayContactList;
