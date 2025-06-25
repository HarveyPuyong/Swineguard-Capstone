const popupAlert = (type, title, text) => {
  return Swal.fire({
    icon: type,       // 'success' | 'error' | 'warning' | 'info' | 'question'
    title: title,
    text: text,
    confirmButtonText: 'OK'
  });
}

export default popupAlert;