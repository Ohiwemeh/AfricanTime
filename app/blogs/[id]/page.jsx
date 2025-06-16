import BlogPage from './BlogPage';
import { blog_data } from '@/Assets/assets';

// export async function generateMetadata({ params }) {
//      const { id } = await params
//   // const blog = blog_data.find(item => item.id === id);

  

//   if (!blog) return {};

//   console.log(blog);
  

//   return {
//     title: blog.title,
//     description: blog.description?.slice(0, 150),
//     openGraph: {
//       title: blog.title,
//       description: blog.description?.slice(0, 150),
//       images: [blog.image],
//       url: `https://african-time-five.vercel.app/blogs/${params.id}`,
//       type: 'article',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: blog.title,
//       description: blog.description?.slice(0, 150),
//       images: [blog.image],
//     },
//   };
// }

export default async function Page({ params }) {
  try{
const { id: i } = await params;
 const response = await fetch('http://localhost:3000/api/blog')

const blogData = await response.json()
  const blog = blogData.blogs.find(item => item._id === i);

console.log(blog);

 if (!blog) return <div>Not Found</div>;

  return <BlogPage blog={blog} />;
  }catch(error){
    console.log(error)
  }
   
 


 
}
