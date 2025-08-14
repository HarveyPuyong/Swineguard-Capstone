import setupHeader from './header.js';
import sideNavFuntionality from './side-nav.js';
import setupProfile from './profile.js';
import setupSwinesSection from './swines/setup-swine-section.js';
import setupAppointmentSection from './appointments/setup-appointment-section.js';
import setupMessagesSection from './messages/setup-messages-section.js';
import setupServicesSection from './services/setup-services-section.js';
import displayDashboardGraphs from './dashboard/graph.js';
import displayUpcomingAppointments from './dashboard/upcoming-appointments.js';
import handleNotification from '../../admin/script/notification/handle-notification.js';

setupHeader();
sideNavFuntionality();
setupProfile();
setupSwinesSection();
setupAppointmentSection();
setupMessagesSection();
setupServicesSection();
displayDashboardGraphs();
displayUpcomingAppointments();
handleNotification();

