import dotenv from "dotenv";
import connectDB from "./db/indexdb.js";

dotenv.config({
    path: './env'
})
connectDB