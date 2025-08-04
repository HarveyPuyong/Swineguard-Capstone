
const popupAlert = (icon, title, text) => {
  return Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: '#3085d6',
    allowOutsideClick: false,   // optional: prevents closing without clicking OK
    allowEscapeKey: false       // optional: prevents closing with Escape
  });
};

export default popupAlert;