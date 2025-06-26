// // Ito yung part na pagsend ng response ng Appointment Coordinator
// clientDiv.querySelector('.reply-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const form = e.target;

//     const reply = {
//         sender: ACStaff_Id,
//         receiver: form.dataset.receiver,
//         content: form.querySelector('.admin-response').value
//     };

//     try {
//         await axios.post('http://localhost:2500/message/send', reply);
//         alert('Message sent.');
//         form.querySelector('.admin-response').value = '';
//         getuserMsg(); // Refresh after send
//     } catch (err) {
//         console.log('Failed to send message:', err);
//     }
// });


document.querySelector('.chat-box__chat-input-area').addEventListener('submit', async (e) => {
  e.preventDefault();

  const senderId = document.getElementById('hidden-ac-id').value;
  const receiverId = document.getElementById('hidden-client-id').value;
  const messageContent = document.querySelector('.chat-input-area__input-message').value;

  // Now use senderId, receiverId, and messageContent to POST to your backend
  console.log({ senderId, receiverId, messageContent });

  // Optionally clear the input field
  document.querySelector('.chat-input-area__input-message').value = '';
});