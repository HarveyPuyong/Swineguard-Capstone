import fetchUser from '../auth/fetchUser.js';
import fetchMessages from './fetch-messages.js';
import fetchUsers from '../../api/fetch-users.js';
import handleReplyMessage from './handle-reply.js';

const renderConversation = async (clientId) => {
  const appointmentCoordinator = await fetchUser();
  const allMessages = await fetchMessages();
  const allUsers = await fetchUsers();

  const appointmentCoordinatorId = appointmentCoordinator._id;
  const clientUser = allUsers.find(user => user._id === clientId);

  if (!clientUser) {
    document.querySelector('#messages-section .chat-box__main-contents').innerHTML =
      `<p class="text-center text-red">Client not found.</p>`;
    return;
  }

  const conversation = allMessages.filter(msg =>
    (msg.sender === appointmentCoordinatorId && msg.receiver === clientId) ||
    (msg.receiver === appointmentCoordinatorId && msg.sender === clientId)
  );

  conversation.sort((a, b) => new Date(a.dateSend) - new Date(b.dateSend));

  // messages
  const messages = conversation.map(msg => {
    const isSentByAdmin = msg.sender === appointmentCoordinatorId;
    const timeSent = new Date(msg.dateSend).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isSentByAdmin) {
      return `
        <div class="convo-list__admin-chat">
          <p class="convo-list__admin-chat-time-sent time-sent">${timeSent}</p>
          <p class="convo-list__admin-chat-message chat-message">${msg.content}</p>
        </div>
      `;
    } else {
      return `
        <div class="convo-list__user-chat">
          <div class="convo-list__user-chat-time-sent time-sent">${timeSent}</div>
          <div class="convo-list__user-chat-details">
            <img class="convo-list__user-chat-details--img" src="${clientUser.profilePic || 'images-and-icons/images/example-user-profile-pic.jpg'}" alt="user-image">
            <p class="convo-list__user-chat-details--name">${clientUser.firstName}</p>
          </div>
          <p class="convo-list__user-chat-message chat-message">${msg.content}</p>
        </div>
      `;
    }
  }).join('');

  //full conversation container
  const chatHTML = `
    <div class="chat-box__header"> 
      <img class="chat-box__header-user-img" src="${clientUser.profilePic || 'images-and-icons/images/example-user-profile-pic.jpg'}" alt="user-img">
      <div class="chat-box__header-user-name-and-active-status">
        <p class="chat-box__header-user-name">${clientUser.firstName} ${clientUser.lastName}</p>
        <p class="chat-box__header-user-active-status">
          <span class="chat-box__header-user-active-status--dot"></span>
          <span class="chat-box__header-user-active-status--label">Active</span>
        </p>
      </div>
    </div>

    <div class="convo-list">${messages}</div>

    <form class="chat-box__chat-input-area" data-user-id${appointmentCoordinator._id}>
      <label for="input-file" class="chat-input-area__input-file" title="Attach a file">
        <i class="icon fas fa-paperclip"></i>
      </label>
      <input id="input-file" type="file" style="display: none;">

      <input class="chat-input-area__input-message" type="text" placeholder="Type a Message" required>             

      <label for="input-image" class="chat-input-area__input-image" title="Send an image">
        <i class="icon far fa-image"></i>
      </label>
      <input id="input-image" type="file" accept="image/*" style="display: none;">

      <button class="chat-box__send-btn" type="submit" id="send-chat-btn" title="Send message">
        <i class="icon fas fa-paper-plane"></i>
      </button>
    </form>
  `;

  document.querySelector('#messages-section .chat-box__main-contents').innerHTML = chatHTML;

  // para sa bottom ng convo unang ga show
  const convoList = document.querySelector('.convo-list');
  if (convoList) {
    convoList.scrollTop = convoList.scrollHeight;
  }

  document.dispatchEvent(new Event('renderConversation'));

  handleReplyMessage(clientUser._id)
};

export default renderConversation;
