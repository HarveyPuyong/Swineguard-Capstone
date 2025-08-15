import fetchUser from "../script/auth/fetchUser.js";

const header = async() => {
    try {
        const user = await fetchUser();
        const { _id, firstName, middleName, lastName,
                contactNum, email, barangay, municipality
            } = user;

        const headerHTML = `
            <img src="${user.profileImage ? '/uploads/' + user.profileImage : 'images-and-icons/icons/default-profile.png'}" alt="admin-picture" class="header__admin-profile-pic">
            <p class="header__admin-profile-label">${user.roles}</p>
            <i class="header__toggle-logout-btn drop-down-icon fas fa-chevron-down"></i>
            <button class="header__logout-btn">Logout</button>
        `;

        document.querySelector('.header__admin-profile').innerHTML = headerHTML;
        document.dispatchEvent(new Event('renderAdminHeader'));

    } catch (err) {
        console.error("Error loading user info:", err);
    }

}


export default header;