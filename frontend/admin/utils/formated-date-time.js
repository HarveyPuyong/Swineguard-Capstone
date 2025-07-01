function formattedDate(date) {
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

// function formattedDate (date) {

//   // Convert date string to local date object
//   const dateObj = new Date(date);

//   // Format the date
//   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//   const formattedDate = dateObj.toLocaleDateString('en-US', options);

//   // Combine everything
//   const display = `Schedule: ${formattedDate} `;
//   console.log(display);
// }

export {formattedDate, formatTo12HourTime };
