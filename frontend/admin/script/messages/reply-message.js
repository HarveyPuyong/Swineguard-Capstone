// import popupAlert from '../../utils/popupAlert.js';
// import api from '../../utils/axiosConfig.js';
// import {showConvoBox} from './setup-messages-section.js'

// function setupResponseMessageHandler(senderId, receiverId) {
//   const form = document.getElementById('message-form');
//   if (!form) return;

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const content = document.querySelector('.chat-input-area__input-message').value;

//     // Message inputs 
//     if (!content || content.trim().length <= 2){
//       popupAlert('warning', 'Warning!', 'Your message is too short.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('accessToken');

//       await api.post('message/send', {
//         sender: senderId,
//         receiver: receiverId,
//         content: content
//       });

//       popupAlert('success', 'Success!', 'Message sent.').then(() => showConvoBox());
//       console.log('✅ Message sent!');

//       document.querySelector('.chat-input-area__input-message').value = '';
//     } catch (err) {
//       console.error('❌ Failed to send message:', err);
//     }
//   });
// }

// export default setupResponseMessageHandler;