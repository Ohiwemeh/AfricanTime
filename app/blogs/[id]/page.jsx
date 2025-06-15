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
} from 'next-share'



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
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching blog data:', err);
                setError('Failed to fetch blog data');
                setData(null);
            } finally {
                setLoading(false); // This was missing!
            }
        };

        fetchBlogData();
    }, [resolvedParams?.id]);

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
                    {/* <Image className='mx-auto mt-6 border border-white rounded-full' src={data.author_img} width={60} height={60} alt=''/> */}
                    <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>Admin</p>
                </div>
            </div>
            <div className=' mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
                <Image className='border-4 border-white' src={data.image} width={1280} height={720} alt='' />
                <h1 className='my-8 text-[26px] font-semibold'>Introduction:</h1>
                <p>{data.description}</p>
             
               <WhatsappShareButton
  url={'https://github.com/next-share'}
  title={'next-share is a social share buttons for your next React apps.'}
  separator=":: "
>
  <WhatsappIcon size={32} round />
</WhatsappShareButton>
            </div>
            <Footer/>
        </>
    );
};

export default Page;