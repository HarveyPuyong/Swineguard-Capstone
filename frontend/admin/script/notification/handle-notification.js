import { fetchAppointments } from "../../api/fetch-appointments.js";
import { formatTo12HourTime, formattedDate } from "../../utils/formated-date-time.js";
import { getServiceName } from "../../api/fetch-services.js";
import fetchUsers from "../../api/fetch-users.js";
import { getTechnicianName } from "../../api/fetch-technicians.js";
import fetchInventory from "../../api/fetch-inventory.js";
import { fetchInventoryStocks } from "../../api/fetch-inventory-stock.js";
import fetchSwines from "../../api/fetch-swines.js";


// Current Date:
const currentDate = new Date();
const currentDay = currentDate.getDate(); // et the day

// ASF infected Swine
const swines = await fetchSwines();
const asfCases = swines.filter((sw) => sw.cause.toLowerCase() === "asf");


const handleNotification = () => {
    const notifBtn = document.querySelector('.header__notification');
    const notifContainer = document.querySelector('.notification');

    notifBtn.addEventListener('click', () => {
        notifContainer.classList.toggle('show');
        notifContainer.classList.toggle('hide');
    });
};


const displayAdminNotificationList = async() => {
    const users = await fetchUsers();
    const filteredUserAccount = users.filter(user => !user.isRegistered);

    let notificationHTML = '';
    let notifCount = '';

    if (filteredUserAccount.length === 0) {  
        notificationHTML = `
            <div class="notif">
                <p class="notif-title">No Notification</p>
            </div>
        `;
        notifCount = ''; 
        
    } else {
        for (const user of filteredUserAccount) {
            notificationHTML += `
                <div class="notif">
                    <p class="notif-title">New user account created</p>
                    <p class="notif-short-text">New account created named <strong>${user.firstName}</strong></p>
                </div>
            `;
        }
        notifCount = filteredUserAccount.length;

        // ASF alert notifications
        const { asfHTML, asfCount } = await generateASFNotifications(users);
        notificationHTML += asfHTML;
        notifCount += asfCount;
    }

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount;
    document.dispatchEvent(new Event('renderAdminNotification'));
}


const displayACNotificationList = async () => {
    const appointments = await fetchAppointments();
    const users = await fetchUsers(); 
    const filteredAppointment = appointments.filter(appt => appt.appointmentStatus === 'pending');

    let notificationHTML = '';
    let notifCount = 0;

    // Pending appointment notifications
    if (filteredAppointment.length > 0) {
        for (const appt of filteredAppointment) {
            const serviceName = await getServiceName(appt.appointmentService);
            notificationHTML += `
            <div class="notif">
                <p class="notif-title">New Pending Appointment</p>
                <p class="notif-short-text">Raiser request <strong>${serviceName}</strong> services on ${formattedDate(appt.appointmentDate)} at ${formatTo12HourTime(appt.appointmentTime)}</p>
                <p class="notif-short-text">Requested by <strong>${appt.clientFirstname}</strong></p>
            </div>
            `;
        }
        notifCount += filteredAppointment.length;
    }

    // ASF alert notifications (always check)
    const { asfHTML, asfCount } = await generateASFNotifications(users);
    notificationHTML += asfHTML;
    notifCount += asfCount;

    // If still empty
    if (notifCount === 0) {
        notificationHTML = `
            <div class="notif">
            <p class="notif-title">No Notification</p>
            </div>
        `;
    }

    // Render to DOM
    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount || '';
    document.dispatchEvent(new Event('renderACNotification'));
};



const LOW_STOCK_THRESHOLD = 20;
const displayICNotificationList = async () => {
    const medicines = await fetchInventory();       // all medicines
    const stocks = await fetchInventoryStocks();    // all stock entries

    let notificationHTML = '';
    let notifCount = 0;

    const today = new Date(); // Date today

    // Summarize total quantity per medicine
    const stockSummary = medicines.map(med => {
        const relatedStocks = stocks.filter(s => s.medicineId === med._id);
        const totalQuantity = relatedStocks.reduce((sum, s) => sum + s.quantity, 0);
        // expired count
        const expiredCount = relatedStocks.filter(s => new Date(s.expiryDate) < today).length;

        return { 
            name: med.itemName, 
            quantity: totalQuantity,
            expired: expiredCount
        };
    });

    // Categorize
    const lowStocks = stockSummary.filter(item => item.quantity > 0 && item.quantity < LOW_STOCK_THRESHOLD);
    const outOfStocks = stockSummary.filter(item => item.quantity === 0);
    const expired = stockSummary.filter(item => item.expired > 0);

    // Notifications
    if (lowStocks.length > 0) {
        notificationHTML += `
            <div class="notif">
            <p class="notif-title">⚠️ Low Stock Alert</p>
            <p class="notif-short-text">There are <strong>${lowStocks.length}</strong> items running low.</p>
            </div>
        `;
        notifCount++;
    }

    if (outOfStocks.length > 0) {
        notificationHTML += `
            <div class="notif">
            <p class="notif-title">❌ Out of Stock</p>
            <p class="notif-short-text">There are <strong>${outOfStocks.length}</strong> items out of stock.</p>
            </div>
        `;
        notifCount++;
    }

    if (expired.length > 0) {
        notificationHTML += `
            <div class="notif">
            <p class="notif-title">⏰ Expired Stock</p>
            <p class="notif-short-text">There are <strong>${expired.length}</strong> items with expired stocks.</p>
            </div>
        `;
        notifCount++;
    }
    

    // No notifications
    if (notifCount === 0) {
        notificationHTML = `
            <div class="notif">
            <p class="notif-title">No Notification</p>
            </div>
        `;
    }

    // Render
    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount || '';
    document.dispatchEvent(new Event('renderICNotification'));
};



const displayVetNotification = async(staffId) => {
    
    const appointments = await fetchAppointments();
    const users = await fetchUsers(); 
    const filteredAppointment = appointments.filter(appointment => appointment.vetPersonnel === staffId && (appointment.appointmentStatus === 'accepted' || appointment.appointmentStatus === 'reschedule'));

    let notificationHTML = '';
    let notifCount = '';

    if (filteredAppointment.length === 0) {  
        notificationHTML = `
            <div class="notif">
                <p class="notif-title">No Notification</p>
            </div>
        `;
        notifCount = ''; 
        
    } else {
        for (const appointment of filteredAppointment) {
            const serviceName = await getServiceName(appointment.appointmentService);
            notificationHTML += `
                <div class="notif">
                    <p class="notif-title">New Appointment Schedule</p>
                    <p class="notif-short-text">Raiser request <strong>${serviceName}</strong> services on ${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</p>
                    <p class="notif-short-text">Requested by <strong>${appointment.clientFirstname}</strong></p>                
                </div>
            `;
        }
        notifCount = filteredAppointment.length;

        // ASF alert notifications
        const { asfHTML, asfCount } = await generateASFNotifications(users);
        notificationHTML += asfHTML;
        notifCount += asfCount;
    }

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount;
    document.dispatchEvent(new Event('renderVetNotification'));
}


const displayClientNotificationList = async (userId) => {
    const appointments = await fetchAppointments();
    const users = await fetchUsers();

    const filteredAppointment = appointments.filter(
    (appt) =>
        (appt.appointmentStatus === "accepted" ||
        appt.appointmentStatus === "reschedule") &&
        appt.clientId === userId
    );


    let notificationHTML = "";
    let notifCount = 0;

    // Appointment notifications
    for (const appt of filteredAppointment) {
        const serviceName = await getServiceName(appt.appointmentService);
        const vet = await getTechnicianName(appt.vetPersonnel);

        notificationHTML += `
            <div class="notif">
            <p class="notif-title">Your Appointment has been ${
                appt.appointmentStatus.charAt(0).toUpperCase() +
                appt.appointmentStatus.slice(1)
            }</p>
            <p class="notif-short-text">
                Appointment Service <strong>${serviceName}</strong> on 
                ${formattedDate(appt.appointmentDate)} at 
                ${formatTo12HourTime(appt.appointmentTime)}
            </p>
            <p class="notif-short-text">Personnel: <strong>${vet}</strong></p>
            </div>
        `;
        notifCount++;
    }

    // ASF alert notifications
    const { asfHTML, asfCount } = await generateASFNotifications(users);
    notificationHTML += asfHTML;
    notifCount += asfCount;

    // If no notifications at all
    if (notifCount === 0) {
        notificationHTML = `
            <div class="notif">
            <p class="notif-title">No Notification</p>
            </div>
        `;
    }

    // Inject into DOM
    document.querySelector(".notification .notif-list").innerHTML = notificationHTML;
    document.querySelector(".header__notification-label").textContent =
    notifCount > 0 ? notifCount : "";
    document.dispatchEvent(new Event("renderClientNotification"));
};


// 🔥 ASF Notification Function
const generateASFNotifications = async (users) => {
  const swines = await fetchSwines();
  const asfCases = swines.filter((sw) => sw.cause?.toLowerCase() === "asf");

  let asfHTML = "";
  let asfCount = 0;

  const now = new Date();

  for (const sw of asfCases) {
    const swineOwner = users.find((u) => u._id === sw.clientId);
    if (!swineOwner) continue;

    const updatedAt = new Date(sw.updatedAt);
    const diffInDays = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));

    // Show only within 15 days
    if (diffInDays <= 15) {
      asfHTML += `
        <div class="notif notif--danger">
          <p class="notif-title notif-title--danger">🚨 ASF Alert!</p>
          <p class="notif-short-text">
            There is a case of ASF (African Swine Fever) at 
            <strong>${swineOwner.barangay}, ${swineOwner.municipality}</strong>.
          </p>
        </div>
      `;
      asfCount++;
    }
  }

  return { asfHTML, asfCount };
};



export {
    handleNotification,
    displayACNotificationList,
    displayAdminNotificationList,
    displayVetNotification,
    displayClientNotificationList,
    displayICNotificationList
};