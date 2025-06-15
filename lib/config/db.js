import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ohiwemeh:yiDk50J7RputPbwy@cluster0.b8mx4pq.mongodb.net/africantimes');
    console.log('MongoDB connected');

}
    