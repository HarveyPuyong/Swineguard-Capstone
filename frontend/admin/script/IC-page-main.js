import roleRidirectPage from "./../script/auth/role-redirect-page.js"
import setupHeader from './header.js';
import sideNavFuntionality from './sidenav.js';
import setupDashboardSection from './dashboards/setup-dashboard-section.js';
import setupInventorySection from './inventory/setup-inventory-section.js';
import setupSettingsSection from './setting/setup-setting-section.js';


roleRidirectPage();
setupHeader();
sideNavFuntionality();
setupDashboardSection();
setupInventorySection();
setupSettingsSection();