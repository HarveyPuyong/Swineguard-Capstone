
const showChabox = () => {
  const usersList = document.querySelectorAll('.sidebar-chat-panel .chat-list__user');
  usersList.forEach(user => {
    user.addEventListener('click', () => {
      const chatboxConvo = document.querySelector('.chat-box__main-contents');
      const chatboxDescription = document.querySelector('.chat-box__description');
      chatboxDescription.style.display = 'none'
      chatboxConvo.style.display = 'block'
    });
  });
}


export default function messageFunctionality() {
  showChabox();
}
