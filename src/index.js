import connnectDB from "./db/server.js";
import dotenv from "dotenv";

dotenv.config({
    path:"./env"
})

connnectDB();