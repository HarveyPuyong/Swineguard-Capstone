import fetchClient from "../auth/fetch-client.js";

const displayClientProfileSetting = async() => {
  try {
    const user = await fetchClient();

    if (!user) {
    throw new Error("Client not found or not logged in.");
    }
    
    const { _id, firstName, middleName, lastName,
            contactNum, email, barangay, municipality
           } = user;


    const settingHTML = `
        <div class="profile-image detail">
            <img src="images-and-icons/images/money-admin-profile.jpg" alt="Profile Picture" />
            <label class="profile-image__upload-btn show">
                <input type="file" hidden />
                <i class="fas fa-upload"></i> Upload
            </label>
        </div>
        <div class="profile-detail detail">
            <p class="profile-detail-label">ID:</p>
            <p class="profile-detail-value">${_id}</p>
        </div>

        <div class="profile-detail detail editable">
            <p class="profile-detail-label">Name:</p>
            <div class="profile-detail__name-inputs-group">
                <input class="profile-detail-value" id="profile-detail__firstname-input" value="${firstName}" readonly/>
                <input class="profile-detail-value" id="profile-detail__middlename-input" value="${middleName.charAt(0).toUpperCase()}" readonly/>
                <span class="group-seperator">,</span>
                <input class="profile-detail-value" id="profile-detail__lastname-input" value="${lastName}" readonly/>
            </div>
        </div>

        <div class="profile-detail detail editable">
            <p class="profile-detail-label">Contact:</p>
            <input
                class="profile-detail-value"
                id="profile-detail__contact-input"
                type="tel"
                maxlength="11"
                pattern="09[0-9]{9}"
                placeholder="09xxxxxxxxx"
                oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11)"
                value="${contactNum}"
                readonly
            />
        </div>

        <div class="profile-detail detail editable">
            <p class="profile-detail-label">Address:</p>
            <div class="profile-detail__select-group">
                <select name="select-municipal" id="profile-detail__select-municipal" class="profile-detail-value">
                <option value="">${municipality}</option>
                </select>
                <span class="group-seperator">,</span>
                <select name="select-barangay" id="profile-detail__select-barangay" class="profile-detail-value">
                <option value="">${barangay}</option>
                </select>
            </div>
        </div>

        <div class="profile-detail detail editable">
            <p class="profile-detail-label">Email:</p>
            <input class="profile-detail-value" id="email-input" value="${email}" readonly />
        </div>

        <div class="profile-details-list__buttons-container">
        <button class="profile-details-list__edit-btn enable-edit-mode-button" type="button">Edit</button>
        <button class="profile-details-list__cancel-btn disable-edit-mode-button " type="button">Cancel</button>
        <button class="profile-details-list__save-btn" type="submit" data-user-id=${_id}>Save</button>
        </div>
    
    `;

    document.querySelector('#profile-details-form').innerHTML = settingHTML;

    document.dispatchEvent(new Event('renderClientProfile')); 

  } catch (err) {
    console.error("Error loading user info:", err);
  }
};

const displayClientName = async() => {
    try {
        const user = await fetchClient();

        if (!user) {
        throw new Error("Client not found or not logged in.");
        }
        
        const { firstName, lastName } = user;

        const clientName = document.querySelector('.dashboard-section__top-content .dashboard-section__name');
        const currentDate = document.querySelector('.dashboard-section__top-content .dashboard-section__current-date');
        clientName.textContent = `${firstName} ${lastName}`;
        const date = new Date();
        const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        };

        let formattedDate = date.toLocaleString('en-US', options)
        .replace(',', '')                           // remove comma
        .replace(/(\d+):(\d+)\s(AM|PM)/, (_, h, m, ampm) => {
            return `${String(h).padStart(2, '0')}:${m}${ampm}`; // ensure 2-digit hour
        });

        currentDate.textContent = formattedDate;

    } catch (err) {
    console.error("Error loading user info:", err);
  }
}


export {
    displayClientName,
    displayClientProfileSetting
};