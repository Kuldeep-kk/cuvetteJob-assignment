'use client';
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import UserContext from '../context/userContext';
import MainLayout from '../components/MainLayout';
import Link from 'next/link';

function Home() {
  const { user } = useContext(UserContext);
  const posts = user?.jobPosts || []; // Fetch user's posts from context

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Delay based on index for staggered animation
      },
    }),
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center w-full">
        {/* Create Interview button */}
        <div className="flex justify-end w-full mb-4">
          <Link
            href={'/newinterviewpost'}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Create Interview
          </Link>
        </div>

        {/* Recent Posts Header */}
        <h2 className='w-full mb-4 text-2xl text-left border-b-2 text-slate-500'>
          Recent Posts
        </h2>

        {/* Job Post Cards */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <h2 className="text-xl font-semibold text-blue-500">{post.jobTitle}</h2>
                <p className="mt-2 text-gray-700"><strong>Job Description:</strong> {post.jobDescription}</p>
                <p className="mt-2 text-gray-700"><strong>Experience Level:</strong> {post.experienceLevel}</p>
                <p className="mt-2 text-gray-700"><strong>End Date:</strong> {new Date(post.endDate).toLocaleDateString()}</p>
                <div className="mt-2 text-gray-700">
                  <strong>Added Candidates:</strong>
                  <ul className="list-disc list-inside">
                    {post.addCandidate.map((email, idx) => (
                      <li key={idx} className="text-gray-600">{email}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center w-full mt-8'>
              <p className="mt-4 text-center text-gray-500">No posts available</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
