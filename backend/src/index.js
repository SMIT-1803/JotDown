import connnectDB from "./db/server.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
})

connnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("Server is running on port: ", 8000)
    })
})
.catch((error)=>{
    console.log("MongoDB connection FAILED!!",error)
})