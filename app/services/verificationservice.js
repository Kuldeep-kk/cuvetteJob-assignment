import { httpAxios } from "../helper/httpHelper";

export const checkUser = async (email, phone) => {
    try {
        const result = await httpAxios.put(`/api/users/checkuser`, { email, phone });
        return result.data;
    } catch (error) {
        console.error('Error checking user:', error);
        throw error;
    }
};

export const sendOtp = async (email, phone, otp) => {
    try {
        const result = await httpAxios.post(`/api/verification`, { email, phone, otp });
        return result.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export const verifySMSOtp = async (phone, code) => {
    try {
        console.log(`Verifying phone number: ${phone}`);
        const result = await httpAxios.post(`/api/smsverify`, { phone, code });
        return result.data;
    } catch (error) {
        console.error('Error verifying SMS OTP:', error);
        throw error;
    }
};

export const sendEamilOtp = async (email, otp) => {
    try {
        
        const result = await httpAxios.post(`/api/signin/otpverify`, { email, otp });
        return result.data;
    } catch (error) {
        console.error('Error verifying SMS OTP:', error);
        throw error;
    }
};
