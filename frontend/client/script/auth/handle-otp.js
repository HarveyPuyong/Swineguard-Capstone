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
const verifyOtp = async(clientEmail, clientOtp) => {
  if (!clientEmail || !clientOtp) {
    popupAlert('error', 'Error', 'OTP and Email cannot be empty.');
    return;
  }

  try {
    const response = await api.post('/auth/verify-otp',  { email: clientEmail, otp: clientOtp });
    await createAccount();
    popupAlert('success', 'Success', 'OTP verified successfully');
  } catch (error) {
    console.log(error);
    const errMessage = error.response?.data?.message || error.response?.data?.error;
    popupAlert('error', 'Error!', errMessage);
  }
}

export {
  sendOtp,
  verifyOtp
};
