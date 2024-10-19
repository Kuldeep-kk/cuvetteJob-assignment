'use client';
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import logo from '../../../assets/Navbar/logo.png';
import UserContext from '@/app/context/userContext';
import { IoMdArrowDropdown } from "react-icons/io";
import { logout } from '@/app/services/userservice';

import { useRouter } from 'next/navigation';

const Navbar = () => {
  
  const router=useRouter();
  const { user,setUser } = useContext(UserContext); // Destructure the user from context
  const [isOpen, setIsOpen] = useState(false);
  console.log(user);

  const verified=user?.emailVerified && user?.phoneVerified;


  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Framer motion variants for smooth dropdown transitions
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <nav className="fixed z-10 w-full p-6 bg-white shadow-lg">
      <div className="container flex items-center justify-between mx-auto">
        {/* Logo */}
        <Image
          src={logo}
          width={125}
          height={40}
          alt="Logo"
          className="object-contain"
        />

        {/* Navigation & User Dropdown */}
        <div className="relative flex items-center space-x-6">
          {/* Contact Button */}
          <button className="px-4 py-2 text-lg text-gray-600 transition duration-200 ease-in-out rounded hover:text-blue-600">
            Contact
          </button>

          {/* User Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-5 px-4 py-2 text-lg text-gray-600 transition duration-200 ease-in-out bg-gray-100 rounded hover:bg-gray-200"
              >
                <div className='w-6 h-6 rounded-full bg-slate-400'></div>
                {user?.name}
                <IoMdArrowDropdown
                  size={25}
                  className={`text-slate-500 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-0 w-48 p-2 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
                  >
                    <button
                      className="block w-full px-4 py-2 text-sm text-center text-gray-700 transition duration-200 ease-in-out hover:bg-gray-100"
                      onClick={() => console.log('My Job Posts')}
                    >
                      My Job Posts
                    </button>
                    <button
                      className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-center text-white transition duration-200 ease-in-out bg-red-400 rounded hover:bg-red-600"
                      onClick={async() => {await logout();setUser(undefined);  router.push('/signin')}}
                    >
                      Logout
                    </button>

                    {verified ? <h2 className='text-center text-slate-400'>Verified</h2> : <h2 className='text-center text-slate-400'>Not Verified</h2>}

                    
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
