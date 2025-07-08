import { formatTo12HourTime } from '../../utils/formated-date-time.js';
import fetchUser from '../auth/fetchUser.js';
import fetchUsers from '../../api/fetch-users.js';
import fetchMessages from './fetch-messages.js';

const displayContactList = async () => {
  try {
    const appointmentCoordinator = await fetchUser();
    const allUsers = await fetchUsers();
    const allMessages = await fetchMessages();

    const appointmentCoordinatorId = appointmentCoordinator._id;
    const chatListContainer = document.querySelector('.chat-list');
    chatListContainer.innerHTML = '';

    const clientUsers = allUsers.filter(user => user.roles.includes('user'));

    const conversationsMap = new Map();

    allMessages.forEach(msg => {
      // Get the other party's ID
      const isCoordinatorSender = msg.sender === appointmentCoordinatorId;
      const clientId = isCoordinatorSender ? msg.receiver : msg.sender;

      if (clientId === appointmentCoordinatorId) return; // skip if somehow same

      if (!conversationsMap.has(clientId)) {
        conversationsMap.set(clientId, []);
      }

      conversationsMap.get(clientId).push(msg);
    });

    for (const [clientId, messages] of conversationsMap.entries()) {
      const client = clientUsers.find(user => user._id === clientId);
      if (!client) continue;

      messages.sort((a, b) => new Date(b.dateSend) - new Date(a.dateSend));
      const lastMessage = messages[0];

      const unseenCount = messages.filter(
        msg => msg.sender === clientId && msg.receiver === appointmentCoordinatorId && !msg.seen
      ).length;

      const fullName = `${client.firstName} ${client.middleName} ${client.lastName}`;
      const previewMessage = lastMessage.content.length > 40
        ? `${lastMessage.content.slice(0, 40)}...`
        : lastMessage.content;
      const formattedTime = formatTo12HourTime(lastMessage.dateSend);

      const chatHTML = `
        <div class="chat-list__user" data-client-id="${client._id}">
          <img class="chat-list__user-image" src="${client.profilePic || 'images-and-icons/images/example-user-profile-pic.jpg'}" alt="user image">
          <p class="chat-list__user-name-and-message">
            <span class="chat-list__user-name">${fullName}</span>
            <span class="chat-list__user-message">${previewMessage}</span>
          </p>
          <p class="chat-list__user-last-active-time">${formattedTime}</p>
          <p class="chat-list__user-number-of-message">${unseenCount}</p>
        </div>
      `;

      chatListContainer.insertAdjacentHTML('beforeend', chatHTML);
    }

    document.dispatchEvent(new Event('renderContactList'));

  } catch (err) {
    console.error("Error displaying client messages:", err);
    document.querySelector('.chat-list').innerHTML = `
      <p class="text-center text-red">Failed to load messages.</p>`;
  }
};


export default displayContactList;
