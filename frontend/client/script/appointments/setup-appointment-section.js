import { fetchServices } from "../../../admin/api/fetch-services.js";
import addressesData from "../../../admin/static-data/addresses.js";
import fetchClient from "../auth/fetch-client.js";
import displaySwineList from "./display-client-swine-list.js";
import sendRequestAppointment from "./request-appointment.js";
import displayAppointmentCardList from "./display-appointment-list.js";
import popupAlert from "../../client-utils/client-popupAlert.js";

// ======================================
// ========== Toggle Appointment More Details
// ======================================
const toggleAppointmentMoreDetails = () => {
  const appointmentsCard = document.querySelectorAll('.appointment-card');

  appointmentsCard.forEach(appointment => {
    const moreDetails = appointment.querySelector('.appointment-card__more-details-container');
    const toggleBtn = appointment.querySelector('.appointment-card__toggle-more-details-btn');

    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');

      if(toggleBtn.classList.contains('active')){
        toggleBtn.innerText = 'View Less';
        moreDetails.classList.add('show')
      } else {
        toggleBtn.innerText = 'View More';
        moreDetails.classList.remove('show')
      }

    });
  });
}


// ======================================
// ========== Setup Reqest Appointments Form
// ======================================
const setupRequestAppointmentForm = async () => {
  const selectAllSwinesCheckbox = document.querySelector('#request-appointment-form #select-all-swines');

  selectAllSwinesCheckbox?.addEventListener('change', () => {
    const swineCheckboxes = document.querySelectorAll('input[name="swines"]');
    swineCheckboxes.forEach(checkbox => {
      checkbox.checked = selectAllSwinesCheckbox.checked;
    });
  });

  const serviceSelect = document.querySelector("#select-appointment-service");

  // Populate Service Options
  const services = await fetchServices();
  if (serviceSelect) {
    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service._id;
      option.textContent = service.serviceName;
      serviceSelect.appendChild(option);
    });
  }


  const serviceTypeInput = document.querySelector('#select-appointment-type');

  // When the user selects a service
  serviceSelect.addEventListener("change", async () => {
    const selectedService = services.find(service => service._id === serviceSelect.value);

    const serviceType = selectedService ? selectedService.serviceType : "Not set";
    serviceTypeInput.value = serviceType;

    toggleClinicalSigns(selectedService.withClinicalSigns);
    
  });

  

};



// ======================================
// ========== Toggle Request Appointment Form
// ======================================
const toggleRequestAppointmentForm = async() => {
  const form = document.querySelector('#request-appointment-form');

  const showFormBtn = document.querySelector('.request-appointment-btn').
    addEventListener('click', () => {  
      form.classList.add('show');
    });

  const closeFormBtn = document.querySelector('.request-appointment-form__back-btn').
    addEventListener('click', () => {
      form.classList.remove('show'); form.reset();
    });
}



// ======================================
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderClientAppointmentList', () => {
  toggleAppointmentMoreDetails(); 
});


// ======================================
// Handle Clinical sign toggle
// ======================================
const toggleClinicalSigns = (BoolValue) => {
  const clinicalSignContainer = document.querySelector('#form-detail__clinical-signs');
  
  clinicalSignContainer.style.display = BoolValue ? 'block' : 'none';
}


// ======================================
// Handle Clinical Sign Image toggle
// ======================================
const toggleImageClinicalSign = () => {
  const overlay = document.querySelector('.clinical-signs-overlay');
  const popup = document.querySelector('.popUp-image__clinical-sign-container');
  const clinicalSignImages = document.querySelectorAll('.clinical-signs__images');
  const hideBtn = document.querySelector('.hide-btn__clinical-sign');

  clinicalSignImages.forEach(img => {
    img.addEventListener('click', () => {
      overlay.classList.add('show');
    });
  });

  hideBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
  });

  // Optional: clicking outside popup closes it
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
};


// ======================================
// ========== Pre Display user Swine image input
// ======================================
const preDisplaySwineImg = () => {
  const swineImgInput = document.querySelector('#clinical-sign__swine-image-input');
  const swineImgPreDisplay = document.querySelector('.clinical-signs__images');
  const popUp_Image = document.querySelector('.popUp-image__clinical-sign-container .clinical-signs__images');

  //if (!swineProfileImgInput || !swineProfileImg) return; // prevent error

  swineImgInput.addEventListener('change', function () {
    const file = this.files[0];

    if (!file) {
      swineImgPreDisplay.src = 'images-and-icons/icons/default-img__clinical-sign.png';
      return;
    }

    // ✅ Allowed file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // ✅ Validate file type
    if (!allowedTypes.includes(file.type)) {
      popupAlert('error', 'Error' ,'Invalid image extension! Please upload a JPG, JPEG, or PNG file.');
      this.value = ''; // clear the input
      swineImgPreDisplay.src = 'images-and-icons/icons/default-img__clinical-sign.png';
      popUp_Image.src = 'images-and-icons/icons/default-img__clinical-sign.png';
      return;
    }

    // ✅ Preview the image if valid
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      swineImgPreDisplay.src = reader.result;
      popUp_Image.src = reader.result;
    });
    reader.readAsDataURL(file);

  });
};



// ======================================
// ========== Main Function - Setup Appointment Section
// ======================================
export default function setupAppointmentSection() {
  displayAppointmentCardList();
  toggleRequestAppointmentForm();
  setupRequestAppointmentForm();
  displaySwineList();
  sendRequestAppointment();
  toggleImageClinicalSign();
  preDisplaySwineImg();
}