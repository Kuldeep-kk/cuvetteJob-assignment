'use client';
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/MainLayout';
import { postNewJob } from '../services/postsservice';
import UserContext from '../context/userContext';
import { useRouter } from 'next/navigation';
import { sendjobmails } from '../services/emailservice';

const NewInterviewPosts = () => {

    const context=useContext(UserContext);
    const router=useRouter();
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    experienceLevel: '',
    candidateEmails: [], // Start with an empty array for emails
    endDate: '',
  });

  const [errors, setErrors] = useState({});
  const [inputType, setInputType] = useState('text');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for the specific field
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const addEmail = (email) => {
    if (validateEmail(email)) {
      setFormData((prevData) => ({
        ...prevData,
        candidateEmails: [...prevData.candidateEmails, email],
      }));
    }
  };

  const removeEmail = (emailToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      candidateEmails: prevData.candidateEmails.filter(email => email !== emailToRemove),
    }));
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent the default behavior of adding a space or a new line
      const email = e.target.value.trim();
      if (email) {
        addEmail(email);
        e.target.value = ''; // Clear the input after adding
      }
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        candidateEmails: 'Invalid email format',
      }));
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!formData.jobDescription) newErrors.jobDescription = 'Job Description is required';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience Level is required';
    if (!formData.endDate) newErrors.endDate = 'End Date is required';

    return newErrors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else
     {
        try{

            const result =await sendjobmails(formData.candidateEmails,formData.jobTitle,formData.experienceLevel);
            console.log(result,"-----result for sending mails");

        }
        catch(e){
            console.log(e);

        }
        
        try {


      
        const result = await postNewJob(context?.user._id, formData,formData.candidateEmails); // Ensure userId is defined
        console.log('Job post submitted successfully:', result);

        context.setUser(result.jobPosts);
        router.push('/home');
        
    } catch (error) {
        console.error('Error submitting job post:', error);
    }
    }
  };

  return (
    <MainLayout>
      <form onSubmit={handleSubmit} className="w-1/2 p-4 mx-auto ">
        

        {/** Job Title Field */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-end gap-2 mb-4 "
        >
          <label htmlFor="jobTitle" className="text-lg font-medium text-gray-700 whitespace-nowrap ">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder='Enter Job Title'
            className={`mt-1 p-2 border rounded-md w-3/4 ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
          />
         
        </motion.div>
        {errors.jobTitle && <h2 className="w-full text-sm text-right text-red-500">{errors.jobTitle}</h2>}

        {/** Job Description Field */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-start justify-end gap-2 mb-4"
        >
          <label htmlFor="jobDescription" className="text-lg font-medium text-gray-700 whitespace-nowrap ">Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={8}
            placeholder='Enter Job Description'
            className={`mt-1 p-2 border rounded-md w-3/4 ${errors.jobDescription ? 'border-red-500' : 'border-gray-300'}`}
          />
          
        </motion.div>
        {errors.jobDescription && <h2 className="w-full text-sm text-right text-red-500">{errors.jobDescription}</h2>}

        {/** Experience Level Field */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-end gap-2 mb-4"
        >
          <label htmlFor="experienceLevel" className="text-lg font-medium text-gray-700 whitespace-nowrap">Experience Level</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className={`mt-1 p-2 border rounded-md w-3/4 ${errors.experienceLevel ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Experience Level</option>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
          
        </motion.div>
        {errors.experienceLevel && <h2 className="w-full text-sm text-right text-red-500">{errors.experienceLevel}</h2>}

        {/** Candidate Emails Field */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-start justify-end gap-2 mb-4"
        >
          <label className="pt-2 text-lg font-medium text-gray-700 whitespace-nowrap">Candidate Emails</label>
          <div className={`flex w-3/4 flex-wrap mb-2 border rounded-md border-gray-300`}>
            {formData.candidateEmails.map((email, index) => (
              <div key={index} className="flex items-center px-3 py-1 mb-2 mr-2 text-blue-800 bg-blue-100 rounded-full">
                <span>{email}</span>
                <button type="button" onClick={() => removeEmail(email)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
              </div>
            ))}
         
          <input
            type="text"
            onKeyDown={handleEmailKeyDown}
            className={`w-full mt-1 p-2  focus:outline-none`}
            placeholder={` ${formData.candidateEmails.length>0 ? '' :'Enter email and press Enter or space'}`}
            
          />
           </div>
          
        </motion.div>
       

        {/** End Date Field */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-end gap-2 mb-6"
        >
          <label htmlFor="endDate" className="text-lg font-medium text-gray-700 whitespace-nowrap">End Date</label>
          <input
      type={inputType}
      name="endDate"
      placeholder="Select a Date"
      value={formData.endDate}
      onChange={handleChange}
      onFocus={() => setInputType('date')}
      onBlur={() => setInputType('text')}
      min={new Date().toISOString().split('T')[0]}
      className={`mt-1 p-2 border rounded-md w-3/4 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
    />

          
        </motion.div>
        {errors.endDate && <h2 className="w-full text-sm text-right text-red-500">{errors.endDate}</h2>}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }} className='flex justify-end w-full'>
        <button type="submit" className="w-40 py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700">
          Send
        </button>
        </motion.div>
      </form>
    </MainLayout>
  );
};

export default NewInterviewPosts;
