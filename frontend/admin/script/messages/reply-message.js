import popupAlert from '../../utils/popupAlert.js'

function setupResponseMessageHandler(senderId, receiverId) {
  const form = document.getElementById('message-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = document.querySelector('.chat-input-area__input-message').value;

    // Message inputs 
    if (!content || content.trim().length <= 2){
      popupAlert('warning', 'Warning!', 'Your message is too short.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      await axios.post('http://localhost:2500/message/send', {
        sender: senderId,
        receiver: receiverId,
        content: content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true 
      });

      popupAlert('success', 'Success!', 'Message sent.').then(() => window.location.reload());
      console.log('✅ Message sent!');

      // Clear input field after sending
      document.querySelector('.chat-input-area__input-message').value = '';
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  });
}

export default setupResponseMessageHandler;