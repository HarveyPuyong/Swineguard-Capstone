import fetchUsers from '../../api/fetch-users.js';

async function handleRenderUsersTable() {
  try {
    const users = await fetchUsers();
    users.sort((a, b) => a.lastName.localeCompare(b.lastName));

    let clientHTML = '';

    users.forEach(client => {
      clientHTML += `
        <div class="user ${client.isRegistered ? 'verified' : 'not-verified'}"
          data-role="${client.roles}"
          data-verified="${client.isRegistered ? 'verified' : 'not-verified'}"
        >
          <p class="td last-name">${client.lastName}</p>
          <p class="td first-name">${client.firstName}</p>
          <p class="td middle-name">${client.middleName ? client.middleName.charAt(0) : ''}</p>
          <p class="td municipality">${client.municipality}</p>
          <p class="td barangay">${client.barangay}</p>
          <p class="td contact">${client.contactNum}</p>
          <p class="td email">${client.email}</p>
          
          <div class="td toggle-buttons">
            <i class="toggle-buttons-icon fas fa-ellipsis-v"></i>
            <div class="buttons-container">
              <button class="view-user-profile-btn" data-user-id="${client._id}">View</button>
              <button class="verify-user-btn" data-user-id="${client._id}">Verify</button>
              <button class="reset-user-credential-btn" data-user-id="${client._id}">Reset</button>
            </div>
          </div> 
        </div>
      `;
    });


    const userTableElement = document.querySelector('.users-table__tbody');

    if(userTableElement) userTableElement.innerHTML = clientHTML;

    document.dispatchEvent(new Event('renderUsersTable'));

  } catch (err) {
    console.error('Error rendering technicians:', err);
  }
}

export default handleRenderUsersTable;