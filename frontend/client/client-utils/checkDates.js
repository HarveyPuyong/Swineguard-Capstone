import popupAlert from './client-popupAlert.js'

const checkAppointmentDate = (date) => {
    const today = new Date();

    // Normalize both dates to remove time part
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (date < today) {
        popupAlert('error', 'Error', 'Please select a date today or in the future.');
        return false;
    }
    return true;
}

const checkTime = (time) => {

    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    const minTime = 7 * 60 + 30;  // 7:30 AM => 450
    const maxTime = 16 * 60 + 30; // 4:30 PM => 990

    if (totalMinutes < minTime || totalMinutes > maxTime) {
        popupAlert('error', 'Error', 'Please select a time between 7:30 AM and 4:30 PM.');
        return false;
    }
    return true;
}

const formatDate = (dateInput) => {
  const date = new Date(dateInput);

  // Array of month short names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  return `${month}-${day}-${year}`;
}

export {
    checkAppointmentDate,
    checkTime,
    formatDate
};