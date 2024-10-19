'use client';
import React, { useContext, useState } from 'react';
import AuthLayout from '../components/AuthLayout/AuthLayout';
import { FaUser, FaPhone, FaBuilding, FaEnvelope, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { checkUser, sendOtp, verifySMSOtp } from '../services/verificationservice';
import { toast } from 'react-toastify';
import { signup } from '../services/userservice';
import { useRouter } from "next/navigation";
import { BeatLoader } from 'react-spinners'; // Import BeatLoader
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import UserContext from '../context/userContext';
import Link from 'next/link';

const SignUp = () => {
  const router = useRouter();
  const context=useContext(UserContext);
  const [step, setStep] = useState(1); // Step to manage the current form step
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    companyName: '',
    companyEmail: '',
    employeeSize: ''
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState({
    emailOtp: '',
    phoneOtp: ''
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [emailOtpStatus, setEmailOtpStatus] = useState(null); // Verification status for email OTP
  const [phoneOtpStatus, setPhoneOtpStatus] = useState(null); // Verification status for phone OTP
  const [isLoading, setIsLoading] = useState(false); // State to manage loader
  const [isLoadingforOtp, setIsLoadingforOtp] = useState(false); // State to manage loader


  // Function to validate input fields
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value) error = 'Name is required';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Phone number must be 10 digits';
        break;
      case 'companyName':
        if (!value) error = 'Company name is required';
        break;
      case 'companyEmail':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email address is invalid';
        break;
      case 'employeeSize':
        if (!value) error = 'Employee size is required';
        else if (isNaN(value) || value <= 0) error = 'Employee size must be a positive number';
        break;
      default:
        break;
    }
    return error;
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
    const fieldError = validateField(name, value);
    setErrors({ ...errors, [name]: fieldError });
  };

  // Function to validate all fields before proceeding
  const validateStep1 = () => {
    const newErrors = {};
    Object.keys(userDetails).forEach((field) => {
      const error = validateField(field, userDetails[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  // Function to handle proceeding to verification step
  const handleProceed = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true); // Start loader
      try {
        const userExists = await checkUser(userDetails.companyEmail, userDetails.phone);
        if (!userExists.success) {
          toast.error('User already exists. Please log in instead.');
          setIsLoading(false); // Stop loader
          return;
        }
        const randomOtp = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(randomOtp);
        await sendOtp(userDetails.companyEmail, userDetails.phone, randomOtp);
        setStep(2); // Move to the OTP verification step
        setIsLoading(false); // Stop loader after API success
      } catch (e) {
        toast.error('An error occurred. Please try again.');
        setIsLoading(false); // Stop loader on error
      }
    } else {
      setErrors(validationErrors);
    }
  };

  // Function to handle email OTP verification
  const handleEmailVerify = (e) => {
    e.preventDefault();
    if (otp.emailOtp === generatedOtp.toString()) {
      setIsEmailVerified(true);
      setEmailOtpStatus(true); // Set status to true on successful verification
      toast.success('Email verified successfully!');
    } else {
      setEmailOtpStatus(false); // Set status to false on failure
      toast.error('Invalid email OTP. Please try again.');
    }
  };

  // Function to handle phone OTP verification
  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoadingforOtp(true);
      const result = await verifySMSOtp(userDetails.phone, otp.phoneOtp);
      if (result.status) {
        setIsLoadingforOtp(false);
        setPhoneOtpStatus(true); // Set status to true on successful verification
        toast.success('Phone number verified successfully!');
      } else {
        setPhoneOtpStatus(false); // Set status to false on failure
        toast.error('Invalid phone OTP. Please try again.');
      }
    } catch (e) {
      toast.error('Something went wrong!');
    }
  };

  // Function to handle signup
  const handleSignup = async () => {
    try {
      const result=await signup(userDetails, isEmailVerified, isPhoneVerified);
      toast.success('Signup successful! Redirecting to home...');

      context.setUser(result.createdUser);
      
      router.push('/home'); // Redirect to home after successful signup
    } catch (e) {
      toast.error('Signup failed. Please try again.');
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const isProceedEnabled = phoneOtpStatus && emailOtpStatus;

  return (
    <AuthLayout>
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-1 text-2xl font-bold text-center">Sign Up</h2>
          <p className="mb-5 text-sm text-center">Please fill in your details</p>

          <motion.form
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleProceed}
          >
            <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500">
                <FaUser className="ml-2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className="block w-full p-2 bg-transparent focus:outline-none"
                  placeholder="Name"
                  required
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </motion.div>

            <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500">
                <FaPhone className="ml-2 text-gray-500" />
                <input
                  type="text"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  className="block w-full p-2 bg-transparent focus:outline-none"
                  placeholder="Phone Number"
                  required
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </motion.div>

            <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500">
                <FaBuilding className="ml-2 text-gray-500" />
                <input
                  type="text"
                  name="companyName"
                  value={userDetails.companyName}
                  onChange={handleInputChange}
                  className="block w-full p-2 bg-transparent focus:outline-none"
                  placeholder="Company Name"
                  required
                />
              </div>
              {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
            </motion.div>

            <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500">
                <FaEnvelope className="ml-2 text-gray-500" />
                <input
                  type="email"
                  name="companyEmail"
                  value={userDetails.companyEmail}
                  onChange={handleInputChange}
                  className="block w-full p-2 bg-transparent focus:outline-none"
                  placeholder="Company Email"
                  required
                />
              </div>
              {errors.companyEmail && <p className="mt-1 text-sm text-red-500">{errors.companyEmail}</p>}
            </motion.div>

            <motion.div className="mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500">
                <FaUsers className="ml-2 text-gray-500" />
                <input
                  type="number"
                  name="employeeSize"
                  value={userDetails.employeeSize}
                  onChange={handleInputChange}
                  className="block w-full p-2 bg-transparent focus:outline-none"
                  placeholder="Number of Employees"
                  required
                />
              </div>
              {errors.employeeSize && <p className="mt-1 text-sm text-red-500">{errors.employeeSize}</p>}
            </motion.div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? <BeatLoader color="#fff" size={10} /> : 'Proceed'}
            </button>
          </motion.form>
        </motion.div>
      )}

{step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-1 text-2xl font-bold text-center">Verify Your Account</h2>
          <p className="mb-5 text-sm text-center">Check your email and phone for the verification code.</p>

          <form onSubmit={handleEmailVerify}>
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500 ">
              <input
                type="text"
                name="emailOtp"
                value={otp.emailOtp}
                onChange={(e) => setOtp({ ...otp, emailOtp: e.target.value })}
                className="w-full focus:outline-none"
                placeholder="Enter Email OTP"
                required
              />
              {emailOtpStatus === false && (
                <p className="mt-1 text-sm text-red-500">
                  <FaTimesCircle className="inline mr-1" />
                 
                </p>
              )}
              {emailOtpStatus === true && (
                <p className="mt-1 text-sm text-green-500">
                  <FaCheckCircle className="inline mr-1" />
                 
                </p>
              )}
            </div>
            {(emailOtpStatus == false || emailOtpStatus === null ) &&
            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Verify Email OTP
          </button>}
          </form>

          <form onSubmit={handlePhoneVerify} className="mt-4">
            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md focus-within:bg-white focus-within:border-blue-500 ">
              <input
                type="text"
                name="phoneOtp"
                value={otp.phoneOtp}
                onChange={(e) => setOtp({ ...otp, phoneOtp: e.target.value })}
                className="w-full focus:outline-none"
                placeholder="Enter Phone OTP"
                required
              />
              {phoneOtpStatus === false && (
                <p className="mt-1 text-sm text-red-500">
                  <FaTimesCircle className="inline mr-1" />
                  
                </p>
              )}
              {phoneOtpStatus === true && (
                <p className="mt-1 text-sm text-green-500">
                  <FaCheckCircle className="inline mr-1" />
                 
                </p>
              )}
            </div>
           

            {(phoneOtpStatus === false || phoneOtpStatus === null ) &&
            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
             {isLoading ? <BeatLoader color="#fff" size={10} /> : 'Verify Phone OTP'}
          </button>}
          </form>

          {isProceedEnabled && 
          <button className='w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600' onClick={handleSignup} >SignUp</button>
          }

          <button onClick={handleBack} className="w-full mt-2 text-center rounded-md text-slate-500">
            Back
          </button>
        </motion.div>
      )}
      <h2 className='text-sm text-center'>Already have an account?<Link href={'/signin'} className='text-blue-500'>SignIn</Link></h2>
    </AuthLayout>
  );
};

export default SignUp;
