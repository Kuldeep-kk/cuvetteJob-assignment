'use client';
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import SideNav from '../components/Navbar/SideNav';

const MainLayout = ({ children }) => {
  return (
    <div className='overflow-hidden'>
      {/* Fixed Navbar */}
      <Navbar />

      {/* Flex container for SideNav and main content */}
      <div className="flex">
        {/* SideNav (fixed) */}
        <SideNav />

        {/* Main content area */}
        <main className="flex-grow p-8 mt-16 ml-20">
          {/* The content passed to this layout */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
