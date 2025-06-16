import { connectDB } from "@/lib/config/db";
import { v2 as cloudinary } from "cloudinary";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary API key:", process.env.CLOUDINARY_API_KEY);

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
  const image = formData.get("image");

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const base64Image = `data:${image.type};base64,${imageBuffer.toString("base64")}`;

  try {
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "blog-thumbnails",
    });

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: uploadResult.secure_url,
      authorImg: formData.get("authorImg"),
    };

    await BlogModel.create(blogData);
    return NextResponse.json({ success: true, msg: "Blog created successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, msg: "Upload failed" }, { status: 500 });
  }
}

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
