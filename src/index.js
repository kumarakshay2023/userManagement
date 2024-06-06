require("dotenv").config();
const express = require('express');
const app = express();
const session = require('express-session')
const adminRouter = require("./routes/admin.route");
const cors = require('cors');
require("./models/index");


const PORT = process.env.PORT || 4040;

app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'hellow world',
    resave: false,
    saveUninitialized: true,
     cookie: {
        secure: true,
        maxAge: 60000
      }
  }));

app.use('/admin',adminRouter);

app.use((err, req, res, next) => {
    res.status(500).json({
        status:false,
        statusCode:err.statusCode||500,
        message:err.message
    })
})

app.use("/",(req,res)=>{
    res.send({status:false,statusCode:404})
})



app.listen(PORT,()=>{
    console.log('listening on port',PORT)
})