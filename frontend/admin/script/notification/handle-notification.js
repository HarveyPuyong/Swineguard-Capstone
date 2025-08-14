const handleNotification = () => {
    const notifBtn = document.querySelector('.header__notification');
    const notifContainer = document.querySelector('.notification');

    notifBtn.addEventListener('click', () => {
        notifContainer.classList.toggle('show');
        notifContainer.classList.toggle('hide');
    });
};


export default handleNotification;