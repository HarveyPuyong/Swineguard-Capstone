import fetchUser from "./fetchUser.js";
import setupHeader from "./header.js";
import sideNavFuntionality from "./sidenav.js";
import setupAppointmentSection from "./appointments-script/setup-appointment-section.js";
import setupMessagesSection from "./messages-script/setup-messages-section.js";
import setupTechniciansSection from "./technicians-script/setup-technician-section.js";
import setupSettingsSection from "./setting-script/setup-setting-section.js";

console.log(await fetchUser());
setupHeader();
sideNavFuntionality();
setupAppointmentSection();
setupMessagesSection();
setupTechniciansSection();
setupSettingsSection();