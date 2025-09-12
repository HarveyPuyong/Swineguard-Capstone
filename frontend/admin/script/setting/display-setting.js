import fetchUser from './../auth/fetchUser.js';

const displaySetting = async() => {
  try {
    const user = await fetchUser();
    const { _id, firstName, middleName, lastName,
            contactNum, email, barangay, municipality
           } = user;


    const settingHTML = `
        <div class="setting-form__header">
          <p class="setting-form__header-heading">Profile</p>
          <div class="setting-form__header-btns-container">
            <button class="setting-form__header-edit-btn show" type="button">Edit</button>
            <button class="setting-form__header-cancel-btn" type="button">Cancel</button>
            <button class="setting-form__header-save-btn" type="submit" data-user-id=${_id}>Save</button>
          </div>
        </div>
        <div class="setting-form__details-list">
          <div class="admin-image detail">
            <img src="${user.profileImage ? '/uploads/' + user.profileImage : 'images-and-icons/icons/default-profile.png'}" id="appointment-coordinator__profile-image" alt="Profile Picture" />
            <label class="admin-image__upload-btn">
              <input type="file" id="admin__profile-image-input" hidden />
              <i class="fas fa-upload"></i> Upload
            </label>
          </div>
          <div class="admin-detail detail">
            <p class="admin-detail-label">ID:</p>
            <p class="admin-detail-value">${_id}</p>
          </div>

          <div class="admin-detail detail editable">
            <p class="admin-detail-label">Name:</p>
            <div class="name-input-field">
              <input class="admin-detail-value name" id="admin-profile__firstName-input" value="${firstName}" readonly />
              <input class="admin-detail-value name" id="admin-profile__middleName-input" value="${middleName}" readonly/>
              <input class="admin-detail-value name" id="admin-profile__lastName-input" value="${lastName}" readonly/>
            </div>
          </div>

          <div class="admin-detail detail editable">
            <p class="admin-detail-label">Contact:</p>
            <input
              class="admin-detail-value"
              id="admin-profile__contact-input"
              type="tel"
              maxlength="11"
              pattern="09[0-9]{9}"
              placeholder="09xxxxxxxxx"
              oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11)"
              value="${contactNum}"
              readonly
            />
          </div>

          <div class="admin-detail detail editable">
            <p class="admin-detail-label">Address:</p>
            <select name="select-municipal" id="admin-profile__select-municipal" class="admin-detail-value address" disabled>
              <option value="${municipality}">${municipality}</option>
            </select>
            <select name="select-barangay" id="admin-profile__select-barangay" class="admin-detail-value address" disabled>
              <option value="${barangay}">${barangay}</option>
            </select>
          </div>

          <div class="admin-detail detail editable">
            <p class="admin-detail-label">Email:</p>
            <input class="admin-detail-value email" id="admin-profile__email-input" value="${email}" readonly />
          </div>

          <div class="admin-detail detail editable">
            <p class="admin-detail-label">Password:</p>
            <input class="admin-detail-value email" value="Admin Password" readonly />
          </div>
        </div>
        
    `;

    document.querySelector('#setting-form').innerHTML = settingHTML;

    document.dispatchEvent(new Event('renderSettings')); 

  } catch (err) {
    console.error("Error loading user info:", err);
  }
};


export default displaySetting;