import { assets } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SideBar = ({ closeSidebar }) => {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full w-64 bg-slate-100 flex flex-col border-r border-black">
      {/* Logo Section */}
      <div className="px-6 py-4 border-b border-black">
        <Image src={assets.logo} alt="logo" width={120} />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col p-6 gap-4">
        <Link
          href="/admin/addProduct"
          onClick={handleClick}
          className="flex items-center gap-3 border border-black font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
        >
          <Image src={assets.add_icon} alt="Add" width={28} />
          <p>Add Blog</p>
        </Link>

        <Link
          href="/admin/blogList"
          onClick={handleClick}
          className="flex items-center gap-3 border border-black font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
        >
          <Image src={assets.blog_icon} alt="Blog List" width={28} />
          <p>Blog Lists</p>
        </Link>

        <Link
          href="/admin/subscriptions"
          onClick={handleClick}
          className="flex items-center gap-3 border border-black font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
        >
          <Image src={assets.email_icon} alt="Subscription" width={28} />
          <p>Subscription</p>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
