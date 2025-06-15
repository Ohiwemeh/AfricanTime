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
      <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16 '>
        <p className='text-xl'>Upload thumbnail</p>
        <label htmlFor="image">
          <Image src={!image ? assets.upload_area : URL.createObjectURL(image)} width={140} height={70} alt='' className='mt-4' />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />

        <p className='text-xl mt-4'>Blog Title</p>
        <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='Type here' required />

        <p className='text-xl mt-4'>Blog Description</p>
        <div className="w-full sm:w-[500px] mt-4">
          <MDEditor
            name='description'
            onChange={onEditorChange}
            value={data.description}
            height={300}
            placeholder="Write your blog content in markdown..."
          />
        </div>

        <p className='text-xl mt-4'>Blog category</p>
        <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-4 border text-gray-500'>
          <option value="Poltics">Poltics</option>
          <option value="Sport">Sport</option>
          <option value="LifeStyle">LifeStyle</option>
        </select>
        <br />
        <button type='submit' className='mt-8 w-40 h-12 bg-black text-white'>Publish</button>
      </form>
    </>
  )
}

export default page
