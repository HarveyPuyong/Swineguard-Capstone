import fetchUser from '../auth/fetchUser.js';
import fetchSenderReceiver from './fetch-sender-receiver.js'
import fetchMessages from './fetch-messages.js';

const Messages = async () => {
  try {
    const coordinator = await fetchUser();
    const messages = await fetchMessages();
    const users = await fetchSenderReceiver();

    const chatListContainer = document.querySelector('.chat-list');

    const acId = coordinator._id;

    const clientUsers = users.filter(u => u.roles.includes('user'));

    const relevantMessages = messages.filter(msg =>
      clientUsers.some(client => (
        (msg.sender === client._id && msg.receiver === acId) ||
        (msg.receiver === client._id && msg.sender === acId)
      ))
    );

    if (relevantMessages.length === 0) {
      chatListContainer.innerHTML = `<p class="text-center">No client messages found.</p>`;
      return;
    }

    const latestMessages = [];

    clientUsers.forEach(client => {
      const conversation = messages.filter(msg =>
        (msg.sender === client._id && msg.receiver === acId) ||
        (msg.sender === acId && msg.receiver === client._id)
      );

      if (conversation.length === 0) return;

      conversation.sort((a, b) => new Date(b.dateSend) - new Date(a.dateSend));

      latestMessages.push({
        client,
        lastMsg: conversation[0],
        count: conversation.filter(msg => msg.sender === client._id).length
      });
    });

    latestMessages.forEach(({ client, lastMsg, count }) => {
      const fullName = `${client.firstName} ${client.middleName} ${client.lastName}`;
      const shortMsg = lastMsg.content.length > 40
        ? lastMsg.content.slice(0, 40) + '...'
        : lastMsg.content;
      const timeSent = new Date(lastMsg.dateSend).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      const chatHTML = `
        <div class="chat-list__user" data-client-id="${client._id}">
          <img class="chat-list__user-image" src="images-and-icons/images/example-user-profile-pic.jpg" alt="user-image">
           <p class="chat-list__user-name-and-message">
            <span class="chat-list__user-name">${fullName}</span>
            <span class="chat-list__user-message">${shortMsg}</span>
          </p>  
          <p class="chat-list__user-last-active-time">${timeSent}</p>
          <p class="chat-list__user-number-of-message">${count}</p>
        </div>
      `;

      chatListContainer.insertAdjacentHTML('beforeend', chatHTML);
    });

  } catch (err) {
    console.error("❌ Error loading messages:", err);
    document.querySelector('.chat-list').innerHTML = `<p class="text-center text-red">Failed to load messages.</p>`;
  }
};

export default Messages;
