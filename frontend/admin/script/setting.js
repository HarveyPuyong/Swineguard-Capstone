const editAdminDetails = () => {
  const editableDetails = document.querySelectorAll('.settings-container__details-list .admin-detail.editable');

  editableDetails.forEach(detail => {
    const editBtn = detail.querySelector('.edit-btn');
    const saveBtn = detail.querySelector('.save-btn');
    const cancelBtn = detail.querySelector('.cancel-btn');
    const detailInput = detail.querySelector('.admin-detail-value');

    editBtn.addEventListener('click', () => {
      editBtn.classList.remove('show');
      saveBtn.classList.add('show');
      cancelBtn.classList.add('show');
      detailInput.removeAttribute('readonly');
      detailInput.classList.add('editable');
    });

    cancelBtn.addEventListener('click', () => {
      editBtn.classList.add('show');
      saveBtn.classList.remove('show');
      cancelBtn.classList.remove('show');
      detailInput.setAttribute('readonly', 'readonly')
      detailInput.classList.remove('editable')
    });
    
    saveBtn.addEventListener('click', () => {
      // Gawin ito kapag may backend na
    });

  });
}

export default function handleSettingsFunctionality() {
  editAdminDetails();
}