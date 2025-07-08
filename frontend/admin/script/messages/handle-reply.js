import api from '../../utils/axiosConfig.js';
import fetchUser from '../auth/fetchUser.js';
import renderConversation from './handle-display-conversation.js';

const handleReplyMessage = async (clientId) => {
  const form = document.querySelector('.chat-box__chat-input-area');
  const input = form.querySelector('.chat-input-area__input-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = input.value.trim();
    if (!content) return;

    try {
      const appointmentCoordinator = await fetchUser();

      await api.post('/message/send', {
        sender: appointmentCoordinator._id,
        receiver: clientId,
        content
      });

      input.value = '';

      await renderConversation(clientId); 
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Failed to send message');
    }
  });
};

export default handleReplyMessage;
