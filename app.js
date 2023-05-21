const express = require('express');
const mongoos = require('mongoose');
const body_parser = require('body-parser')
const http = require('http');
const ejs  = require('ejs');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

// const multer = require('multer');
// const upload = multer();
const app = express();
const DB = 'mongodb+srv://amrh18039:TiOdQeAAfLqOqbkq@cluster0.tyrtmnv.mongodb.net/handzz'
const indexroute = require("./routes/route")
port = 4000

app.use(express.json())
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}));
// app.use(upload.array());
app.set('Template engine','ejs')
app.set('views','temp')

app.use('/static',express.static('public'))
app.use("/",indexroute);


mongoos.connect(DB,{
useNewUrlParser:true,
useUnifiedTopology:true,
}).then(()=>{
    console.log("connection success")
}).catch((err)=>{
    console.log(err);
})
app.use(helmet({
    contentSecurityPolicy:false,
    frameguard:false
}));
app.use(cors());
app.use(xss());

httpserver = http.createServer(app);
httpserver.listen(port,'127.0.0.1',()=>{
    console.log("server running...")
})
