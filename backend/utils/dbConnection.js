import mongoose from "mongoose"

const URI = process.env.MONGO_URI || ""
const connectDb = async ()=>{
    try{
        await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to DB successfully")
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}
connectDb()