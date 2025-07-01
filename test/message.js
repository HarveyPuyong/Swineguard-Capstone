const messageBox = document.querySelector('.convo-list');

async function getuserMsg() {
    try {
        const [messagesRes, usersRes] = await Promise.all([
            axios.get('http://localhost:2500/message/all'),
            axios.get('http://localhost:2500/data')
        ]);

        const messages = messagesRes.data;
        const users = usersRes.data;

        messageBox.innerHTML = ''; // Clear previous messages

        // ✅ Find Appointment Coordinator by checking role array
        const acStaff = users.find(user => user.roles.includes('appointmentCoordinator'));
        if (!acStaff) {
            messageBox.innerHTML = '<p>Appointment Coordinator not found.</p>';
            return;
        }

        const ACStaff_Id = acStaff._id;// Ito yung ID ng Appointment Coordinator

        // Get only users with role 'user' yung user lang kukunin dito
        const clients = users.filter(user =>
            user._id !== ACStaff_Id && user.roles.includes('user')
        );

        clients.forEach(client => {
            //  Filter messages only between this User and AC staff
            const conversation = messages.filter(msg =>
                (msg.sender === ACStaff_Id && msg.receiver === client._id) ||
                (msg.receiver === ACStaff_Id && msg.sender === client._id)
            );

            if (conversation.length === 0) return;

            const clientDiv = document.createElement('div');
            clientDiv.classList.add('message');

            const clientName = `${client.firstName} ${client.lastName}`;
            clientDiv.innerHTML = `<h3>Conversation with ${clientName}</h3>`;


            conversation.forEach(msg => {
                // Nakuha lamang yung name ng user using ID from messages collection tapos hahanapin sa users collection
                const sender = users.find(u => u._id === msg.sender);
                const senderName = sender ? `${sender.firstName} ${sender.lastName}` : msg.sender;

                clientDiv.innerHTML += `
                    <p><strong>${senderName}:</strong> ${msg.content}</p>
                    <p class="date">${new Date(msg.dateSend).toLocaleString()}</p>
                    <hr>
                `;
            });

            // Reply form ng Admin
            clientDiv.innerHTML += `
                <form class="reply-form" data-receiver="${client._id}">
                    <textarea class="admin-response" placeholder="Reply message..." required></textarea>
                    <button type="submit">Send</button>
                </form>
            `;

            // Ito yung part na pagsend ng response ng Appointment Coordinator
            clientDiv.querySelector('.reply-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;

                const reply = {
                    sender: ACStaff_Id,
                    receiver: form.dataset.receiver,
                    content: form.querySelector('.admin-response').value
                };

                try {
                    await axios.post('http://localhost:2500/message/send', reply);
                    alert('Message sent.');
                    form.querySelector('.admin-response').value = '';
                    getuserMsg(); // Refresh after send
                } catch (err) {
                    console.log('Failed to send message:', err);
                }
            });

            messageBox.appendChild(clientDiv);
        });

    } catch (err) {
        console.error('Error:', err);
    }
}

getuserMsg();
