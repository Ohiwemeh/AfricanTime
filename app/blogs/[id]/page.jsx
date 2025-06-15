'use client'
import { assets, blog_data } from '@/Assets/assets'
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, use } from 'react'

const Page = ({ params }) => {
   
    const resolvedParams = use(params);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

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

    // Share functionality
    const shareOnFacebook = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(data.title);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
    };

    const shareOnTwitter = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this article: ${data.title}`);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    };

    const shareOnLinkedIn = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(data.title);
        const summary = encodeURIComponent(data.description || '');
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank', 'width=600,height=400');
    };

    const shareOnWhatsApp = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this article: ${data.title} - ${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareViaWebAPI = async () => {
        if (!data) return;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.title,
                    text: data.description || 'Check out this article!',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copy link
            copyToClipboard();
        }
    };

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
             
                <div className='my-24'>
                    <p className='text-black font-semibold my-4'>Share this Article on social media</p>
                    
                    {/* Enhanced Share Section */}
                    <div className='flex flex-wrap gap-4 items-center'>
                        {/* Facebook */}
                        <button 
                            onClick={shareOnFacebook}
                            className='hover:scale-110 transition-transform duration-200'
                            title='Share on Facebook'
                        >
                            <Image src={assets.facebook_icon} alt='Share on Facebook' width={50} className='cursor-pointer'/>
                        </button>
                        
                        {/* Twitter */}
                        <button 
                            onClick={shareOnTwitter}
                            className='hover:scale-110 transition-transform duration-200'
                            title='Share on Twitter'
                        >
                            <Image src={assets.twitter_icon} alt='Share on Twitter' width={50} className='cursor-pointer'/>
                        </button>
                        
                        {/* LinkedIn */}
                        <button 
                            onClick={shareOnLinkedIn}
                            className='hover:scale-110 transition-transform duration-200 bg-blue-600 rounded-lg p-2'
                            title='Share on LinkedIn'
                        >
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </button>
                        
                        {/* WhatsApp */}
                        <button 
                            onClick={shareOnWhatsApp}
                            className='hover:scale-110 transition-transform duration-200 bg-green-500 rounded-lg p-2'
                            title='Share on WhatsApp'
                        >
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
                            </svg>
                        </button>
                        
                        {/* Copy Link */}
                        <button 
                            onClick={copyToClipboard}
                            className={`hover:scale-110 transition-all duration-200 px-4 py-2 rounded-lg border-2 ${
                                copied 
                                    ? 'bg-green-500 text-white border-green-500' 
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                            title='Copy link to clipboard'
                        >
                            {copied ? (
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                    Copied!
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                    </svg>
                                    Copy Link
                                </div>
                            )}
                        </button>
                        
                        {/* Native Share (for mobile) */}
                        <button 
                            onClick={shareViaWebAPI}
                            className='hover:scale-110 transition-transform duration-200 bg-blue-500 text-white px-4 py-2 rounded-lg md:hidden'
                            title='Share'
                        >
                            <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                </svg>
                                Share
                            </div>
                        </button>
                    </div>
                    
                    {/* Share URL Display */}
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-2'>Article URL:</p>
                        <div className='flex items-center gap-2'>
                            <input 
                                type="text" 
                                value={typeof window !== 'undefined' ? window.location.href : ''}
                                readOnly 
                                className='flex-1 p-2 text-sm bg-white border border-gray-300 rounded'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Page;