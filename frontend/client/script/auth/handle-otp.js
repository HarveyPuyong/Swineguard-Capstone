import api from "../../client-utils/axios-config.js";
import popupAlert from "../../../admin/utils/popupAlert.js";
import createAccount from "./sigup.js";

const sendOtp = async(clientEmail) => {
  if (!clientEmail) return;
  try {
    const response = await api.post('/auth/send-otp',  { email: clientEmail });
    popupAlert('success', 'Success', `OTP sent successfully to '${clientEmail}'`);
  } catch (error) {
    console.log(error);
    const errMessage = error.response?.data?.message || error.response?.data?.error;
    popupAlert('error', 'Error!', errMessage);
  }
}



// ======================================
// ========== Verify OTP
// ======================================
const verifyOtp = async (clientEmail, clientOtp) => {
  if (!clientEmail || !clientOtp) {
    popupAlert('error', 'Error', 'OTP and Email cannot be empty.');
    return false;
  }

  try {
    const response = await api.post('/auth/verify-otp', {
      email: clientEmail,
      otp: clientOtp
    });

    popupAlert('success', 'Success', 'OTP verified successfully');
    await createAccount(); // Automatic creating account after verified is successful
    return true;

  } catch (error) {
    console.log(error);
    const errMessage = error.response?.data?.message || error.response?.data?.error || "Verification failed";
    popupAlert('error', 'Error!', errMessage);
    return false;
  }
};

export {
  sendOtp,
  verifyOtp
};
