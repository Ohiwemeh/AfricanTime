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
                
                // Update meta tags dynamically for better social sharing
                if (response.data) {
                    updateMetaTags(response.data);
                }
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

    // Function to update meta tags dynamically
    const updateMetaTags = (blogData) => {
        if (typeof window === 'undefined') return;
        
        // Ensure we have absolute URLs for images
        const getAbsoluteImageUrl = (imageUrl) => {
            if (!imageUrl) return '';
            if (imageUrl.startsWith('http')) return imageUrl;
            // Convert relative URLs to absolute URLs
            const baseUrl = window.location.origin;
            return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
        };

        const absoluteImageUrl = getAbsoluteImageUrl(blogData.image);
        
        // Update page title
        document.title = `${blogData.title} | AfricanTimes`;
        
        // Update or create meta tags
        const updateMetaTag = (property, content) => {
            let metaTag = document.querySelector(`meta[property="${property}"]`) || 
                         document.querySelector(`meta[name="${property}"]`);
            
            if (!metaTag) {
                metaTag = document.createElement('meta');
                if (property.startsWith('og:') || property.startsWith('twitter:')) {
                    metaTag.setAttribute('property', property);
                } else {
                    metaTag.setAttribute('name', property);
                }
                document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', content);
        };

        // Basic meta tags
        updateMetaTag('description', blogData.description);
        
        // Open Graph tags (Facebook, WhatsApp)
        updateMetaTag('og:title', blogData.title);
        updateMetaTag('og:description', blogData.description);
        updateMetaTag('og:image', absoluteImageUrl);
        updateMetaTag('og:url', window.location.href);
        updateMetaTag('og:type', 'article');
        updateMetaTag('og:site_name', 'AfricanTimes');
        updateMetaTag('og:image:width', '1200');
        updateMetaTag('og:image:height', '630');
        updateMetaTag('og:image:alt', blogData.title);
        
        // Twitter tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', blogData.title);
        updateMetaTag('twitter:description', blogData.description);
        updateMetaTag('twitter:image', absoluteImageUrl);
        updateMetaTag('twitter:image:alt', blogData.title);
        updateMetaTag('twitter:site', '@AfricanTimes');
        updateMetaTag('twitter:creator', '@AfricanTimes');
    };

    // Share functionality with better URL encoding
    const shareOnFacebook = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(data.title);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
    };

    const shareOnTwitter = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`${data.title} - Check out this article from AfricanTimes!`);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    };

    const shareOnLinkedIn = () => {
        if (!data) return;
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    };

    const shareOnWhatsApp = () => {
        if (!data) return;
        
        // Create a more detailed message for WhatsApp
        const message = `📰 *${data.title}*\n\n${data.description}\n\n🔗 Read the full article here:\n${window.location.href}\n\n#AfricanTimes #News`;
        const encodedMessage = encodeURIComponent(message);
        
        // For better sharing, we can also try the WhatsApp Business API format
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
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
                    text: data.description || 'Check out this article from AfricanTimes!',
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
                    
                    {/* Enhanced Share Section - Focused on 3 platforms */}
                    <div className='flex flex-wrap gap-6 items-center justify-center sm:justify-start'>
                        {/* Facebook */}
                        <button 
                            onClick={shareOnFacebook}
                            className='flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200 p-3 rounded-lg hover:bg-blue-50'
                            title='Share on Facebook'
                        >
                            <Image src={assets.facebook_icon} alt='Share on Facebook' width={50} className='cursor-pointer'/>
                            <span className='text-sm text-gray-600'>Facebook</span>
                        </button>
                        
                        {/* Twitter */}
                        <button 
                            onClick={shareOnTwitter}
                            className='flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200 p-3 rounded-lg hover:bg-blue-50'
                            title='Share on Twitter'
                        >
                            <Image src={assets.twitter_icon} alt='Share on Twitter' width={50} className='cursor-pointer'/>
                            <span className='text-sm text-gray-600'>Twitter</span>
                        </button>
                        
                        {/* WhatsApp */}
                        <button 
                            onClick={shareOnWhatsApp}
                            className='flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-200 p-3 rounded-lg hover:bg-green-50'
                            title='Share on WhatsApp'
                        >
                            <div className='bg-green-500 rounded-lg p-2'>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
                                </svg>
                            </div>
                            <span className='text-sm text-gray-600'>WhatsApp</span>
                        </button>
                    </div>
                    
                    {/* Sharing Tips */}
                    <div className='mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded'>
                        <h4 className='font-semibold text-yellow-800 mb-2'>📱 Sharing Tips:</h4>
                        <ul className='text-sm text-yellow-700 space-y-1'>
                            <li>• <strong>Facebook & Twitter:</strong> Rich previews with image and title will appear automatically</li>
                            <li>• <strong>WhatsApp:</strong> Link preview with image may take a few seconds to load</li>
                            <li>• <strong>Not seeing the preview?</strong> Try sharing again after a few minutes</li>
                        </ul>
                    </div>

                    {/* Debug Information - Remove in production */}
                    <div className='mt-6 p-4 bg-blue-50 rounded-lg text-sm'>
                        <p className='font-semibold text-blue-800 mb-2'>🔧 Technical Info (Debug):</p>
                        <div className='grid grid-cols-1 gap-2 text-blue-700'>
                            <p><strong>Title:</strong> {data.title}</p>
                            <p><strong>Description:</strong> {data.description?.substring(0, 100)}...</p>
                            <p><strong>Image URL:</strong> {data.image}</p>
                            <p><strong>Article URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
                        </div>
                        <div className='mt-3 text-xs text-blue-600 bg-white p-2 rounded'>
                            <strong>To test sharing:</strong><br/>
                            • Facebook: <a href="https://developers.facebook.com/tools/debug/" target="_blank" className="underline">Facebook Sharing Debugger</a><br/>
                            • Twitter: <a href="https://cards-dev.twitter.com/validator" target="_blank" className="underline">Twitter Card Validator</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Page;