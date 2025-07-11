function formattedDate(date) {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

function formatTo12HourTime(time24) {
  if (!time24) return '';

  const [hourStr, minuteStr] = time24.split(':');
  const hour = parseInt(hourStr);

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minuteStr.padStart(2, '0')} ${period}`;
}


export {formattedDate, formatTo12HourTime };
