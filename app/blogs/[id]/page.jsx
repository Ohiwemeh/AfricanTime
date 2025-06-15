'use client'
import { assets, blog_data } from '@/Assets/assets'
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, use } from 'react'
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'

// Add this function for App Router metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
  try {
    // You might need to adjust this API call based on your setup
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog?id=${resolvedParams.id}`);
    const data = await response.json();
    
    return {
      title: data.title,
      description: data.description,
      openGraph: {
        title: data.title,
        description: data.description,
        images: [
          {
            url: data.image,
            width: 1280,
            height: 720,
          }
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title,
        description: data.description,
        images: [data.image],
      },
    }
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post',
    }
  }
}

const Page = ({ params }) => {
   
    const resolvedParams = use(params);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Component mounted');
        console.log('Resolved Params:', resolvedParams);
        console.log('Blog data:', blog_data);
        
        if (!resolvedParams?.id) {
            setError('No ID provided');
            setLoading(false);
            return;
        }

        if (!blog_data || blog_data.length === 0) {
            setError('No blog data available');
            setLoading(false);
            return;
        }

        const fetchBlogData = async () => {
            try {
                const response = await axios.get('/api/blog', {
                    params: { id: resolvedParams.id }
                });
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching blog data:', err);
                setError('Failed to fetch blog data');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [resolvedParams?.id]);

    // Create the share URL
    const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/blog/${resolvedParams?.id}` 
        : '';

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">No data found</div>
            </div>
        );
    }

    return (
        <>
            <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
                <div className='flex justify-between items-center'>
                    <Link href='/' >
                        <Image src={assets.logo} alt='logo' width={180} className='w-[130px] sm:w-auto'/>
                    </Link>
                    <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
                        Get started <Image src={assets.arrow} alt=''/>
                    </button>
                </div>
                <div className='text-center my-24'>
                    <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
                    <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>Admin</p>
                </div>
            </div>
            
            <div className=' mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
                <Image className='border-4 border-white' src={data.image} width={1280} height={720} alt='' />
                <h1 className='my-8 text-[26px] font-semibold'>Introduction:</h1>
                <p>{data.description}</p>
             
                {/* Share Buttons Section */}
                <div className="mt-8 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Share this article:</h3>
                    <div className="flex gap-3 items-center">
                        <WhatsappShareButton
                            url={shareUrl}
                            title={data.title}
                            separator=" - "
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>

                        <FacebookShareButton
                            url={shareUrl}
                            quote={data.title}
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>

                        <TwitterShareButton
                            url={shareUrl}
                            title={data.title}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Page;