'use client';
import React, { useContext, useState } from 'react';
import AuthLayout from '../components/AuthLayout/AuthLayout';
import { sendEamilOtp } from '../services/verificationservice';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners'; // Import BeatLoader
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import success and error icons
import { signin } from '../services/userservice';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import UserContext from '../context/userContext';
import Link from 'next/link';

const SignIn = () => {
  const context=useContext(UserContext);
  const router = useRouter();
  const [otpVisible, setOtpVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false); // Loading state for sending OTP
  const [loadingVerify, setLoadingVerify] = useState(false); // Loading state for verifying OTP
  const [verificationStatus, setVerificationStatus] = useState(null); // Status of OTP verification

  const handleSendOtp = async () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(randomOtp);
    setLoadingOtp(true); // Set loading state to true

    try {
      const result = await sendEamilOtp(email, randomOtp);
      setOtpVisible(true);
      toast.success('OTP sent to your email!'); // Success message
      console.log(result);
    } catch (e) {
      toast.error('Failed to send OTP! Please try again.'); // Error message
      console.log(e);
    } finally {
      setLoadingOtp(false); // Reset loading state
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await signin(email);
      context?.setUser(result.user);
      toast.success('Successfully signed in!'); // Success message
      router.push('/home');
    } catch (e) {
      toast.error('Sign in failed! Please check your credentials.'); // Error message
      console.log(e);
    }
  };

  const handleVerifyOtp = async () => {
    setLoadingVerify(true); // Set loading state to true
    if (otp === generatedOtp.toString()) {
      setIsOtpVerified(true);
      setVerificationStatus('success'); // Set verification status to success
      toast.success('OTP verified successfully!'); // Success message
    } else {
      setIsOtpVerified(false);
      setVerificationStatus('error'); // Set verification status to error
      toast.error('Invalid OTP! Please try again.'); // Error message
    }
    setLoadingVerify(false); // Reset loading state
  };

  return (
    <AuthLayout>
      <ToastContainer /> {/* Add ToastContainer */}
      <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <div className="flex items-center">
            <input
              type="email"
              className="w-full h-10 p-2 mt-1 border border-gray-300 rounded-md"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isOtpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="h-10 px-2 ml-2 text-white bg-blue-600 rounded-md whitespace-nowrap hover:bg-blue-500"
              >
                {loadingOtp ? <BeatLoader size={8} color="#fff" /> : 'Send OTP'}
              </button>
            )}
          </div>
        </div>

        {otpVisible && (
          <div className="mb-6">
            <label className="block text-gray-700">Enter OTP</label>
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500">
              <input
                type="text"
                className="w-full focus:outline-none"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {verificationStatus === 'success' && (
                <div className="mt-2 text-green-600">
                  <FaCheckCircle className="inline mr-1" />
                </div>
              )}
              {verificationStatus === 'error' && (
                <div className="mt-2 text-red-600">
                  <FaTimesCircle className="inline mr-1" />
                </div>
              )}
            </div>
            {isOtpVerified === false && otpVisible === true && (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="h-10 px-2 mt-2 text-white bg-green-600 rounded-md hover:bg-green-500"
              >
                {loadingVerify ? <BeatLoader size={8} color="#fff" /> : 'Verify OTP'}
              </button>
            )}
          </div>
        )}

        {isOtpVerified && ( // Conditionally render the "Proceed" button
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            Proceed
          </button>
        )}
      </form>

      <h2 className='text-sm text-center'>Create an account?<Link href={'/signup'} className='text-blue-500'>SignUp</Link></h2>
    </AuthLayout>
  );
};

export default SignIn;
