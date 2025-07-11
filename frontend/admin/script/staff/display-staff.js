import fetchUsers from "../../api/fetch-users.js";


async function handleRenderStaff() {
  try {
    const users = await fetchUsers();

    const staff = users.filter(user => !user.roles.includes('user'));

    let stafCardHTLML = '';

    staff.forEach(person => {
      const staffFullname = `${person.firstName} ${person.middleName} ${person.lastName}`;
      const staffAdress = `${person.barangay} ${person.municipality}`

      stafCardHTLML += `
        <div class="staff-card">
          <img class="staff-card__img" src="images-and-icons/images/example-user-profile-pic.jpg" alt="staff-image">
          <div class="staff-card__details-container">
            <div class="staff-card__detail">
              <span class="staff-card__detail--label">Name:</span>
              <span class="staff-card__detail--value">${staffFullname}</span>
            </div>
            <div class="staff-card__detail">
              <span class="staff-card__detail--label">Position:</span>
              <span class="staff-card__detail--value">${person.roles[0]}</span>
            </div>
            <div class="staff-card__detail">
              <span class="staff-card__detail--label">Contact:</span>
              <span class="staff-card__detail--value">${person.contactNum}</span>
            </div>
            <div class="staff-card__detail">
              <span class="staff-card__detail--label">Adress:</span>
              <span class="staff-card__detail--value">${staffAdress}</span>
            </div>
          </div>
        </div>
        `;
    });

    const staffCardsList = document.querySelector('.staff-section__staff-card-list');
    
    if(staffCardsList) staffCardsList.innerHTML = stafCardHTLML;

  } catch (error) {
    console.log(error)
  }
}


export default handleRenderStaff;