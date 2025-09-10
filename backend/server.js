import express from "express";
import cors from "cors"
import connectDB from "./config/connectDB.js";

import "dotenv/config"



const app = express()
// port number where our server is going to run
const PORT = 8080 || process.env.PORT;

//middle ware
app.use(cors())


app.use(express.json())
app.use(express.urlencoded({extended: true}))





//routes
app.get("/", (req,res) =>{
    res.send("Api is working")
})


//here calling the connect db function
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
  });
});
