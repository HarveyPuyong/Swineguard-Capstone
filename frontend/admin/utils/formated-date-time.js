function formattedDate(date) {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

function formatedDateForCalendar(date) {
  return new Date(date).toISOString().split('T')[0]; 
}

function formatTo12HourTime(time24) {
  if (!time24) return '';

  const [hourStr, minuteStr] = time24.split(':');
  const hour = parseInt(hourStr);

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minuteStr.padStart(2, '0')} ${period}`;
}



function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}


function formatedQuantity(quantity) {
  return quantity.toFixed(1); 
}

function getMonthText(monthNum) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return months[monthNum];
}


export { formatedDateForCalendar, 
         formattedDate, 
         formatTo12HourTime, 
         formatDate, 
         formatedQuantity,
         getMonthText };
