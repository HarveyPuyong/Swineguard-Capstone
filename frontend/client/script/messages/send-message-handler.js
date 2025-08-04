import api from '../../client-utils/axios-config.js';
import fetchClient from '../auth/fetch-client.js';
import displayClientConversation from './display-messages.js';

const handleReplyMessage = async (receiverId) => {
    const form = document.querySelector('#client-reply-form');
    const input = form.querySelector('#client-reply-message-input');

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = input.value.trim();
    if (!content) return;

    try {
      const client = await fetchClient();

      await api.post('/message/send', {
        sender: client._id,
        receiver: receiverId,
        content
      });

      input.value = '';

      await displayClientConversation(receiverId); 
      
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Failed to send message');
    }
  });
};

export default handleReplyMessage;
