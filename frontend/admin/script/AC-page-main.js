import setupHeader from "./header.js";
import sideNavFuntionality from "./sidenav.js";
import setupDashboardSection from "./dashboards/setup-dashboard-section.js";
import setupAppointmentSection from "./appointments/setup-appointment-section.js";
import {setupMessagesSection} from "./messages/setup-messages-section.js";
import setupTechniciansSection from "./technicians/setup-technician-section.js";
import setupSettingsSection from "./setting/setup-setting-section.js";

setupHeader();
sideNavFuntionality();
setupDashboardSection();
setupAppointmentSection();
setupMessagesSection();
setupTechniciansSection();
setupSettingsSection();