const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(express.json())
app.use(cors());
app.use(express.static('./'))
mongoose.connect(process.env.MONGODB_URI)
  .then(()=> console.log('connected to DB'))
  .catch((error)=>console.log(error))

const games = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true,
    min:0,
    max:10000
  }
})

const gamesModel = mongoose.model('game',games);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/data',async (req,res)=>{
  if(!req.body){
    res.status(404).send("Something went wrong");
    return;
  }
  const {title, category, price} = req.body
  const insertIntoDb =new gamesModel({
    title:title,
    category:category,
    price:price
  })

  const save =await insertIntoDb.save()
  res.send("Saved")
})

app.get('/games',async (req,res)=>{
  const getData = await gamesModel.find()

  if(!getData){
    res.status(404).send('Something went wrong')
    return;
  }

  res.status(200).send(getData)
})

app.listen(4000, ()=>{
  console.log("Server started");
})
