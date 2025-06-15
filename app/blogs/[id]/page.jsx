import { blog_data } from '@/Assets/assets';
import BlogPage from './BlogPage'; // your actual component from above

export async function generateMetadata({ params }) {
  const blog = blog_data.find(item => item.id === params.id);

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.description?.slice(0, 150),
    openGraph: {
      title: blog.title,
      description: blog.description?.slice(0, 150),
      images: [blog.image],
      url: `https://african-time-five.vercel.app/blogs/${params.id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description?.slice(0, 150),
      images: [blog.image],
    },
  };
}

export default function Page({ params }) {
  return <BlogPage params={params} />;
}
