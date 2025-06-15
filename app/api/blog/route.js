import { connectDB } from "@/lib/config/db";
import { writeFile } from "fs/promises";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("id");

  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs });
  }
}

export async function POST(request) {
  await connectDB();

  const formData = await request.formData();
  const timeStamp = Date.now();

  const image = formData.get("image");
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);

  const extension = image.name.split('.').pop();
  const safeFileName = `${timeStamp}_${Math.random().toString(36).substring(2)}.${extension}`;
  const path = `./public/${safeFileName}`;
  const imgUrl = `/${safeFileName}`;

  await writeFile(path, buffer);

  const blogData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    author: formData.get("author"),
    image: imgUrl,
    authorImg: formData.get("authorImg"),
  };

  await BlogModel.create(blogData);
  return NextResponse.json({ success: true, msg: "Blog created successfully" });
}


//Api endpoint to delete a blog post
export async function DELETE(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("id");

  if (!blogId) {
    return NextResponse.json({ success: false, msg: "Blog ID is required" }, { status: 400 });
  }

  const deletedBlog = await BlogModel.findByIdAndDelete(blogId);

  if (!deletedBlog) {
    return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, msg: "Blog deleted successfully" });
}