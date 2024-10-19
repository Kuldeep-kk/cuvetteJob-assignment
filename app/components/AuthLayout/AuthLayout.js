// components/AuthLayout.js
import React from 'react';

const AuthLayout = ({ children }) => {
  const gradientBorderStyle = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderImage: 'linear-gradient(to right, #3b82f6, #9333ea) 1',
  }; 

  return (
    <div className="flex flex-col min-h-screen bg-white md:flex-row"> {/* Stack on mobile, side by side on md+ */}
      {/* Left Side Text */}
      <div className="flex items-center justify-center flex-1 p-6 md:p-10">
        <div className="w-full max-w-lg">
          <h1 className="mt-20 mb-4 text-3xl font-extrabold text-gray-800 md:mt-0 md:text-4xl">Welcome to Our Platform</h1>
          <p className="text-base text-gray-600 md:text-lg">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley.
          </p>
        </div>
      </div>

      {/* Right Side Form Box */}
      <div className="flex items-center justify-center flex-1 p-6 md:p-10">
        <div
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg" // Use Tailwind for rounded corners
          style={gradientBorderStyle} // Apply gradient border styles here
        >
          {children} {/* Render the sign-up or sign-in form here */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
