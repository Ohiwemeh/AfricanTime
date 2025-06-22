import BlogPage from './BlogPage';
import { blog_data } from '@/Assets/assets';

export async function generateMetadata({ params }) {
     const { id } = await params
 const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/blog`)

const blogData = await response.json()
  const blog = blogData.blogs.find(item => item._id === id);

  
  

  if (!blog) return {};

  console.log(blog);
  

  return {
    title: blog.title,
    description: blog.description?.slice(0, 150),
    openGraph: {
      title: blog.title,
      description: blog.description?.slice(0, 150),
      images: blog.image,
      url: `${process.env.NEXT_PUBLIC_BASEURL}/blogs/${id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description?.slice(0, 150),
      images: blog.image,
    },
  };
 }
 
export default async function Page({ params }) {
  try{
const { id: i } = await params;

 const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/blog`)


const blogData = await response.json()


  const blog = blogData.blogs.find(item => item._id === i);

  


 if (!blog) return <div>Not Found</div>;

  return <BlogPage blog={blog} />;
  }catch(error){
    console.log(error)
  }
   
 


 
}
