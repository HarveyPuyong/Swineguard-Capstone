import setupHeader from "./header.js";
import sideNavFuntionality from "./sidenav.js";
import setupAppointmentSection from "./appointments/setup-appointment-section.js";
import setupMessagesSection from "./messages/setup-messages-section.js";
import messageHandler from "./messages/messageHandler.js"; 
import setupTechniciansSection from "./technicians/setup-technician-section.js";
import setupSettingsSection from "./setting/setup-setting-section.js";

setupHeader();
sideNavFuntionality();
setupAppointmentSection();
setupMessagesSection();
messageHandler();
setupTechniciansSection();
setupSettingsSection();