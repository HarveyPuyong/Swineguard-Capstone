function formattedDate(date) {
   return new Date(date).toISOString().split('T')[0];
}


function formatTo12HourTime(time24) {
  if (!time24) return '';

  const [hourStr, minuteStr] = time24.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minuteStr} ${period}`;
}

export {formattedDate, formatTo12HourTime};
