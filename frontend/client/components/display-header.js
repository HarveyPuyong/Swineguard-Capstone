import fetchClient from "../script/auth/fetch-client.js";


const dipslayHeaderProfileImg = async() => {
  const user = await fetchClient();
  const { _id } = user;
  //const user = users.filter(user => user._id === _id);

  const profileImg = document.querySelector('.header__profile').innerHTML = `
    <img class="header__profile-pic" src="${user.profileImage ? '/uploads/' + user.profileImage : './images-and-icons/icons/default-profile.png'}" alt="picture">
  `;
  document.dispatchEvent(new Event('renderClientProfileImage'));

}

export default dipslayHeaderProfileImg;