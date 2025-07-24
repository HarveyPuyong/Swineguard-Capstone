import roleRidirectPage from "./../script/auth/role-redirect-page.js"
import setupHeader from "./header.js";
import sideNavFuntionality from './sidenav.js';
import setupDashboardSection from "./dashboards/setup-dashboard-section.js";
import setupUsersSection from "./users/setup-users-section.js";
import setupSwinesSection from "./swines/setup-swines-section.js";
import setupAppointmentSection from "./appointments/setup-appointment-section.js";
import setupInventorySection from "./inventory/setup-inventory-section.js"
import setupStaffSection from "./staff/setup-staff-section.js";
import setupServiceSection from "./service/setup-service-section.js";
import setupSettingsSection from './setting/setup-setting-section.js';

roleRidirectPage()
setupHeader();
sideNavFuntionality();
setupDashboardSection();
setupUsersSection();
setupSwinesSection();
setupAppointmentSection();
setupInventorySection();
setupStaffSection();
setupServiceSection();
setupSettingsSection();

