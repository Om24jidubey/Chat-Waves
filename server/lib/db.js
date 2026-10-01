import mongoose from "mongoose";

//Function to connect to mongodb database
export const connectDB=async()=>{
        try {
            await mongoose.connect(process.env.MONGODB_URI)
            mongoose.connection.on('connected',()=>console.log('Database Connected'));
        } catch (error) {
            console.log(error);
            
        }
}