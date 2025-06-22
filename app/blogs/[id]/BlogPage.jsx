'use client';
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Correct import for App Router
import React from 'react';

const BlogPage = ({ blog }) => {
  const params = useParams();
  
  // Use the blog ID from params if blog.id isn't available
  const blogId = blog?.id || params?.id;
  
  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blogs/${blogId}`
    : `https://african-time-five.vercel.app/blogs/${blogId}`;

  // Add debugging to see what's happening
  console.log('Blog ID:', blogId);
  console.log('Full URL:', fullUrl);

  return (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src={assets.logo} alt="logo" width={180} className="w-[130px] sm:w-auto" />
          </Link>
          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
            Get started <Image src={assets.arrow} alt="" />
          </button>
        </div>

        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">{blog.title}</h1>
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">Admin</p>
        </div>
      </div>

      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image className="border-4 border-white" src={blog.image} width={1280} height={720} alt="" />
        <h1 className="my-8 text-[26px] font-semibold">Introduction:</h1>
        <p>{blog.description}</p>

        {/* Share Section */}
        <div className="my-24">
          <p className="text-black font font-semibold my-4">Share this Article on social media</p>
          <div className="flex items-center gap-4">
            {/* Twitter */}
            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `${blog.title} - ${fullUrl}`
                )}`;
                window.open(url, '_blank');
              }}
            >
              <Image src={assets.twitter_icon} alt="twitter" width={50} className="cursor-pointer" />
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => {
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${blog.title} - ${fullUrl}`
                )}`;
                window.open(url, '_blank');
              }}
            >
              <Image src={assets.whatsapp_icon} alt="whatsapp" width={34} className="cursor-pointer" />
            </button>

            {/* Copy Link */}
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fullUrl);
                  alert(`Link copied: ${fullUrl}`); // Show what was copied for debugging
                } catch (err) {
                  alert('Failed to copy link.');
                }
              }}
            >
              <Image src={assets.copy_icon} alt="copy link" width={34} className="cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;