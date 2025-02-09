
// export default connectDB;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Log the MongoDB URL to check if it's loaded correctly
console.log('MongoDB URL:', process.env.MONGO_URL);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error('MongoDB URL is not defined in .env file.');
            process.exit(1); // Exit if the URL is not defined
        }
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
  useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
        });
        console.log('MongoDB connected..now....');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
