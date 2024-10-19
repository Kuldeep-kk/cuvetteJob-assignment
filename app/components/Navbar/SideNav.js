'use client';
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaPenSquare } from 'react-icons/fa';
import UserContext from '@/app/context/userContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation

const SideNav = () => {
  const path = usePathname();
  const { user } = useContext(UserContext); // Get the user from context

  return (
    <>
      {/* Render Side Navbar only if user is logged in */}
      {user && (
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed left-0 w-20 h-full pt-20 bg-white shadow-lg top-16"
        >
          {/* Navigation Menu */}
          <nav className="flex flex-col gap-10">
            {/* Home Link */}
            <Link href="/home">
              <div className={`flex items-center justify-center ${path ==='/home' ? 'text-blue-400':' text-slate-400'} hover:scale-105`}>
                <FaHome size={35} />
               
              </div>
            </Link>

            {/* Posts Link */}
            <Link href="/posts">
            <div className={`flex items-center justify-center ${path ==='/posts' ? 'text-blue-400':' text-slate-400'} hover:scale-105`}>
                <FaPenSquare size={35} />
              </div>
            </Link>
          </nav>
        </motion.aside>
      )}
    </>
  );
};

export default SideNav;
