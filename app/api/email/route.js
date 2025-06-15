import { connectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";







const LoadDb = async () => {
    await connectDB();

}

LoadDb();

export async function POST(request) {
    const formData = await request.formData();
    const emailData = {
      
        email: `${formData.get('email')}`, 
       
    };
    await EmailModel.create(emailData);
    return NextResponse.json({ success: true, msg: "Email Subcribed" });


}

export async function GET(request) {
    const emails = await EmailModel.find({});
    return NextResponse.json({ emails });
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const mongoId = searchParams.get("id");

    if (!mongoId) {
        return NextResponse.json({ success: false, msg: "Mongo ID is required" }, { status: 400 });
    }

    await EmailModel.findByIdAndDelete(mongoId);
    return NextResponse.json({ success: true, msg: "Email deleted successfully" });
}