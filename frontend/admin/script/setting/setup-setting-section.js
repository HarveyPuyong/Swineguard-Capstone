import displaySetting from "./display-setting.js";
import editAdminDetails from "./edit-setting.js";
import handleLogout from "../auth/logout.js";


// ======================================
// ========== Main Function - Setup Settings Section
// ======================================
export default async function setupSettingsSection() {
  await displaySetting();
  editAdminDetails();

  document.querySelector('.settings-container__header-logout-btn')
    .addEventListener('click', async() => await handleLogout());
}
