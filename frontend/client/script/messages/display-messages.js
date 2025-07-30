import fetchMessages from './fetch-messages.js';
import fetchUsers from '../../../admin/api/fetch-users.js';
import fetchClient from '../auth/fetch-client.js';

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const displayClientConversation = async (staffId) => {
  const client = await fetchClient();
  const allMessages = await fetchMessages();
  const allUsers = await fetchUsers();

  const clientId = client._id;
  const vetStaff = allUsers.find(user => user._id === staffId);

  if (!vetStaff) {
    document.querySelector('#messages-section .chat-box__main-contents').innerHTML =
      `<p class="text-center text-red">Staff not found.</p>`;
    return;
  }

  const conversation = allMessages.filter(msg =>
    (msg.sender === clientId && msg.receiver === staffId) ||
    (msg.receiver === clientId && msg.sender === staffId)
  );

  conversation.sort((a, b) => new Date(a.dateSend) - new Date(b.dateSend));

  // messages
  const messages = conversation.map(msg => {
    const isSentByClient = msg.sender === clientId;
    const timeSent = new Date(msg.dateSend).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isSentByClient) {
      return `
        <div class="convo-list__user-chat">
          <p class="convo-list__user-chat-time-sent time-sent">${timeSent}</p>
          <p class="convo-list__user-chat-message chat-message">${msg.content}</p>
        </div>
      `;
    } else {
      return `
        <div class="convo-list__vetStaff-chat">
          <div class="convo-list__vetStaff-chat-time-sent time-sent">${timeSent}</div>
          <div class="convo-list__vetStaff-chat-details">
            <img class="convo-list__vetStaff-chat-details--img" src="${vetStaff.profilePic || 'images-and-icons/images/example-user-profile-pic.jpg'}" alt="user-image">
            <p class="convo-list__vetStaff-chat-details--name">${capitalize(vetStaff.firstName)}</p>
          </div>
          <p class="convo-list__vetStaff-chat-message chat-message">${msg.content}</p>
        </div>
      `;
    }
  }).join('');

  // Header
  const chatHTML = `
    <img class="chat-box__header-user-img" src="${vetStaff.profilePic || 'images-and-icons/images/example-user-profile-pic.jpg'}" alt="user-img">
    <div class="chat-box__header-user-name-and-active-status">
        <p class="chat-box__header-user-name">${capitalize(vetStaff.firstName)} ${capitalize(vetStaff.lastName)}</p>
        <p class="chat-box__header-user-active-status">
            <span class="chat-box__header-user-active-status--dot"></span>
            <span class="chat-box__header-user-active-status--label">Active</span>
        </p>
    </div>
  `;

  // Reply Form
  const replyFormHTML = `
    <form id="client-reply-form" class="chat-box__chat-input-area" data-receiver-id="${staffId}"> 
        <label for="input-file" class="chat-input-area__input-file" title="Attach a file">
            <i class="icon fas fa-paperclip"></i>
        </label>
        <input id="input-file" type="file" style="display: none;">
        <input id="client-reply-message-input" class="chat-input-area__input-message" type="text" placeholder="Type a Message" required>    
        <button class="chat-box__send-btn" type="submit" id="send-chat-btn" title="Send message">
            <i class="icon fas fa-paper-plane"></i>
        </button>
    </form>
  `;

  document.querySelector('#client-message-box .chat-box__header').innerHTML = chatHTML;
  document.querySelector('#client-convo-list .convo-list').innerHTML = messages;
  document.querySelector('#client-convo-list .chat-box__form-container').innerHTML = replyFormHTML;

  const convoList = document.querySelector('#client-convo-list .convo-list');
  if (convoList) {
    convoList.scrollTop = convoList.scrollHeight;
  }

  document.dispatchEvent(new Event('renderClientConversation'));
};

export default displayClientConversation;
