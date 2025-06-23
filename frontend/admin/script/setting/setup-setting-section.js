import displaySetting from "./display-setting.js";
import editAdminDetails from "./edit-setting.js";


// ======================================
// ========== Main Function - Setup Settings Section
// ======================================
export default async function setupSettingsSection() {
  await displaySetting();

  document.addEventListener('DOMContentLoaded', () => {
    editAdminDetails();
  });
}
