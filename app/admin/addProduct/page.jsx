'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import axios from 'axios'
import { toast } from 'react-toastify'

// Dynamically load to prevent SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const page = () => {
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    title: " ",
    description: " ",
    category: "Poltics",
    author: "Admin",
    authorImg: assets.profile_icon,
    date: new Date(),   
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=> ({
      ...data,
      [name]: value
    }))
    console.log(data);
  }

  const onEditorChange = (value) => {
  setData((data) => ({
    ...data,
    description: value,
  }))
}

const onSubmitHandler = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", data.title);
  formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("author", data.author);
    formData.append("authorImg", data.authorImg);

    const response = await axios.post('/api/blog', formData);

    if (response.data.success) {
      toast.success("Blog created successfully"); 
        setImage(false);
        setData({
            title: " ",
            description: " ",
            category: "Poltics",})  
    }else{
        toast.error("Something went wrong, please try again later");
    }
}

  return (
    <>
      <form onSubmit={onSubmitHandler} className='pt-4 px-4 pb-8 sm:pt-12 sm:pl-16 sm:pr-8 max-w-full'>
        <p className='text-lg sm:text-xl font-medium mb-3'>Upload thumbnail</p>
        <label htmlFor="image" className='cursor-pointer block'>
          <Image 
            src={!image ? assets.upload_area : URL.createObjectURL(image)} 
            width={140} 
            height={70} 
            alt='' 
            className='rounded border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors' 
          />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />

        <p className='text-lg sm:text-xl font-medium mt-6 mb-3'>Blog Title</p>
        <input 
          name='title' 
          onChange={onChangeHandler} 
          value={data.title} 
          className='w-full max-w-full sm:max-w-[500px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base' 
          type="text" 
          placeholder='Type here' 
          required 
        />

        <p className='text-lg sm:text-xl font-medium mt-6 mb-3'>Blog Description</p>
        <div className="w-full max-w-full sm:max-w-[500px]">
          <MDEditor
            name='description'
            onChange={onEditorChange}
            value={data.description}
            height={250}
            placeholder="Write your blog content in markdown..."
            data-color-mode="light"
          />
        </div>

        <p className='text-lg sm:text-xl font-medium mt-6 mb-3'>Blog category</p>
        <select 
          name="category" 
          onChange={onChangeHandler} 
          value={data.category} 
          className='w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base'
        >
          <option value="Poltics">Poltics</option>
          <option value="Sport">Sport</option>
          <option value="LifeStyle">LifeStyle</option>
        </select>
        
        <button 
          type='submit' 
          className='mt-8 w-full sm:w-48 h-12 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base'
        >
          Publish
        </button>
      </form>
    </>
  )
}

export default page