const express=require("express")
const app=express()

require("dotenv").config();
require("./startup/cors")(app)
require("./startup/routes")(app)
require("./startup/db")()

const port=process.env.PORT||3900
app.listen(port,()=>console.log(`Listening to port ${port}`))