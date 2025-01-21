import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app=express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
