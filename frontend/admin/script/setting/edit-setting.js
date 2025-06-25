const editAdminDetails = () => {
  const container = document.querySelector('.settings-container__details-list');

  container.addEventListener('click', (e) => {
    const detail = e.target.closest('.admin-detail');
    if (!detail) return;

    const editBtn = detail.querySelector('.edit-btn');
    const saveBtn = detail.querySelector('.save-btn');
    const cancelBtn = detail.querySelector('.cancel-btn');
    const detailInput = detail.querySelector('.admin-detail-value');

    // Handle edit button
    if (e.target.closest('.edit-btn')) {
      detailInput.dataset.original = detailInput.value;

      editBtn.classList.remove('show');
      saveBtn.classList.add('show');
      cancelBtn.classList.add('show');
      detailInput.removeAttribute('readonly');
      detailInput.classList.add('editable');
    }

    // Handle cancel button
    if (e.target.closest('.cancel-btn')) {
      detailInput.value = detailInput.dataset.original;

      editBtn.classList.add('show');
      saveBtn.classList.remove('show');
      cancelBtn.classList.remove('show');
      detailInput.setAttribute('readonly', 'readonly');
      detailInput.classList.remove('editable');
    }
  });
};

export default editAdminDetails;
