import fetchUser from './../auth/fetchUser.js';

const displaySetting = async() => {
  try {
    const {
      _id, firstName, middleName, lastName,
      contactNum, email,
      barangay, municipality
    } = await fetchUser();

    const settingHTML = `
      <div class="settings-container__header">
        <p class="settings-container__header-heading">Profile</p>
        <button class="settings-container__header-logout-btn">Logout</button>
      </div>
      <form class="settings-container__details-list">
        <div class="admin-image detail">
          <img src="images-and-icons/images/money-admin-profile.jpg" alt="Profile Picture" />
          <label class="admin-image__upload-btn">
            <input type="file" hidden />
            <i class="fas fa-upload"></i> Upload
          </label>
        </div>
        <div class="admin-detail detail">
          <p class="admin-detail-label">ID:</p>
          <p class="admin-detail-value">${_id}</p>
        </div>

        <div class="admin-detail detail editable">
          <p class="admin-detail-label">Name:</p>
          <input class="admin-detail-value" value="${firstName} ${middleName} ${lastName}" readonly />
          <div class="admin-detail__btns-container">
            <button type="button" class="edit-btn show">Edit ✏️</button>
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </div>

        <div class="admin-detail detail editable">
          <p class="admin-detail-label">Contact:</p>
          <input class="admin-detail-value" value="${contactNum}" readonly />
          <div class="admin-detail__btns-container">
            <button type="button" class="edit-btn show">Edit ✏️</button>
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </div>

        <div class="admin-detail detail editable">
          <p class="admin-detail-label">Address:</p>
          <input class="admin-detail-value" value="${barangay}, ${municipality}, Marinduque" readonly />
          <div class="admin-detail__btns-container">
            <button type="button" class="edit-btn show">Edit ✏️</button>
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </div>

        <div class="admin-detail detail editable">
          <p class="admin-detail-label">Email:</p>
          <input class="admin-detail-value" value="${email}" readonly />
          <div class="admin-detail__btns-container">
            <button type="button" class="edit-btn show">Edit ✏️</button>
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </div>

        <div class="admin-detail detail editable">
          <p class="admin-detail-label">Password:</p>
          <input class="admin-detail-value" value="Admin Password" readonly />
          <div class="admin-detail__btns-container">
            <button type="button" class="edit-btn show">Edit ✏️</button>
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </form>
    `;

    document.querySelector('.settings-container').innerHTML = settingHTML;

  } catch (err) {
    console.error("Error loading user info:", err);
  }
};


export default displaySetting;