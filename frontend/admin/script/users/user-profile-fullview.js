import fetchUsers from "../../api/fetch-users.js"
import fetchSwines from "../../api/fetch-swines.js";
import { calculateSwineAge, calculateUserAge } from "../../utils/calculate-months-years.js";
import { handleResetUser } from "./reset-verify-remove-handler.js";


// ======================================
// ========== Users Details
// ======================================

const handleUserFullview = async (userId) => {
    
    try {
        const users = await fetchUsers();
        const allSwines = await fetchSwines();
        const swines = allSwines.filter(swine => swine.clientId === userId); // ✅ FIXED
        const userSwineCount = swines.length; 
        
        if (!users) {
            console.log('No user data found.');
            return;
        }

        const user = users.find(user => user._id === userId);
        if (!user) {
            console.log(`User with ID ${userId} not found.`);
            return;
        }

        // Main Info Container
        const mainInfoHTML = `
            <div class="main-info-container__user-pic">
                <img class="main-info-container__user-pic--img" src="images-and-icons/icons/default-profile.png" alt="user-picture">
                <label class="main-info-container__user-pic--upload" title="change photo">
                    <input type="file" hidden />
                    <i class="fas fa-camera icon"></i> 
                </label>
                </div>

                <div class="main-info-container__details">
                <h4 class="main-info-container__user-name">${user.firstName} ${user.middleName?.charAt(0).toUpperCase() || ''}. ${user.lastName} ${user.suffix || ''}</h4>
                <p class="main-info-container__user-id">${user._id}</p>
                <p class="main-info-container__user-email">${user.email}</p>
            </div>

            <button class="reset-user-credential-btn">Reset Credentials</button>
        `; 
        document.querySelector('.main-info-container').innerHTML = mainInfoHTML;

        const resetBtn = document.querySelector('.main-info-container .reset-user-credential-btn');
        const userResetForm = document.querySelector('.reset-user-credentials-form'); // Reset Form
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                handleResetUser(user._id);
                userResetForm.classList.add('show');
            });
        } else {
            console.warn('Reset button not found in DOM.');
        }


        // Personal Info Contianer
        const personalInfoContainerHTML = `
            <h2 class="user-profile-full-view__container-heading">Personal Information</h2>
            <div class="personal-info-container__details user-details">
                <p class="detail">
                    <span class="detail-label">Full Name:</span>
                    <span class="detail-value">${user.firstName} ${user.middleName}. ${user.lastName} ${user.suffix || ''}</span>
                </p>
                <p class="detail">
                    <span class="detail-label">Sex:</span>
                    <span class="detail-value">${user.sex ? user.sex.charAt(0).toUpperCase() + user.sex.slice(1).toLowerCase() : 'Not set'}</span>
                </p>
                <p class="detail">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">
                        ${calculateUserAge(user.birthday)}
                    </span>
                </p>
                <p class="detail">
                    <span class="detail-label">Phone Number:</span>
                    <span class="detail-value">${user.contactNum}</span>
                </p>
                <p class="detail">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${user.email}</span>
                </p>
                <p class="detail">
                    <span class="detail-label">Total Swines:</span>
                    <span class="detail-value">${userSwineCount}</span>
                </p>
            </div>
        `;
        document.querySelector('.personal-info-container').innerHTML = personalInfoContainerHTML;


        // Address Info Container
        const addressInfoContainerHTML = `
            <h2 class="user-profile-full-view__container-heading">Adress</h2>
            <div class="address-info-container__details user-details">
                <p class="detail">
                    <span class="detail-label">Province:</span>
                    <span class="detail-value">Marinduque</span>
                </p>
                <p class="detail">
                    <span class="detail-label">Municipality:</span>
                    <span class="detail-value">${user.municipality}</span>
                </p>
                <p class="detail">
                    <span class="detail-label">Barangay:</span>
                    <span class="detail-value">${user.barangay}</span>
                </p>
            </div>
        `;
        document.querySelector('.address-info-container').innerHTML = addressInfoContainerHTML;


        // Swine Info Container
        let userSwineHTML = '';

        for (const swine of swines) {
            const swineAgeInMonths = calculateSwineAge(swine.birthdate);
            const clientName = `${user.firstName} ${user.middleName?.charAt(0).toUpperCase() || ''}. ${user.lastName} ${user.suffix || ''}`;

            userSwineHTML += `
                <div class="swine">
                    <div class="swine__details">
                        <p class="td type">${swine.type}</p>
                        <p class="td breed">${swine.breed}</p>
                        <p class="td age">${swineAgeInMonths} month(s)</p>
                        <p class="td sex">${swine.sex}</p>
                        <p class="td weight">${swine.weight} kg</p>
                        <p class="td health-status">${swine.status}</p>
                        <p class="td owner">${clientName}</p>
                        <p class="td created-date">${new Date(swine.createdAt).toLocaleDateString()}</p>
                        <p class="td updated-date">${new Date(swine.updatedAt).toLocaleDateString()}</p>
                        <button class="td toggle-more-details-btn">View</button> 
                    </div>
                    <div class="swine__more-details">
                        <div class="swine__more-details-heading">Swine Details:</div>
                            <div class="swine__more-details-columns">
                            <div class="column left">
                                <p class="column__detail"><span class="column__detail-label">Swine ID:</span><span class="column__detail-value">${swine._id}</span></p>
                                <p class="column__detail"><span class="column__detail-label">Type:</span><span class="column__detail-value">${swine.type}</span></p>
                                <p class="column__detail"><span class="column__detail-label">Breed:</span><span class="column__detail-value">${swine.breed}</span></p>
                                <p class="column__detail"><span class="column__detail-label">Age:</span><span class="column__detail-value">${swineAgeInMonths} month(s)</span></p>
                                <p class="column__detail"><span class="column__detail-label">Sex:</span><span class="column__detail-value">${swine.sex}</span></p>
                            </div>
                            <div class="column right">
                                <p class="column__detail"><span class="column__detail-label">Health Status:</span><span class="column__detail-value">${swine.status}</span></p>
                                <p class="column__detail"><span class="column__detail-label">Weight:</span><span class="column__detail-value">${swine.weight} kg</span></p>
                                <p class="column__detail"><span class="column__detail-label">Owner:</span><span class="column__detail-value">${clientName}</span></p>
                                <p class="column__detail"><span class="column__detail-label">Location:</span><span class="column__detail-value">${user.barangay}, ${user.municipality}, Marinduque</span></p>
                                <p class="column__detail"><span class="column__detail-label">Medication:</span><span class="column__detail-value">Deworming</span></p>
                            </div>
                        </div>
                    </div>
                </div>    
            `;
        }
        document.querySelector('.swines-table__tbody').innerHTML = userSwineHTML;


        const viewButtons = document.querySelectorAll('.toggle-more-details-btn');

        viewButtons.forEach(button => {
            button.addEventListener('click', function () {
                const swineDetails = this.closest('.swine').querySelector('.swine__more-details');
                swineDetails.classList.toggle('show');
                this.textContent = swineDetails.classList.contains('show') ? 'Hide' : 'View';
            });
        });

    } catch (error) {
        console.log(error);
    }
}


export default handleUserFullview


