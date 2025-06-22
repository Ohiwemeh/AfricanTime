'use client'
import { assets } from "@/Assets/assets";
import SideBar from "@/Components/AdminComponents/SideBar";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark"/>
        
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
          md:block
        `}>
          <SideBar closeSidebar={closeSidebar} />
        </div>
        
        <div className="flex flex-col w-full md:w-auto md:flex-1">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-4 md:px-12 border-b border-black">
            <div className="flex items-center">
              {/* Hamburger Menu Button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Toggle sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h3 className="font-medium">Admin Panel</h3>
            </div>
            <Image src={assets.profile_icon} width={40} alt="profile" />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}