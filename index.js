import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
const app = express()
const port = process.env.PORT || 8000;

const client = new MongoClient(process.env.MONGODB_URL);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.use(cors())
app.use(express.json())
const mongoClient = await connectToMongoDB();
const db = mongoClient.db('kindora_resources')
const eventsCollection = db.collection('events')

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.post('/create-event',async(req,res)=>{
const data = req.body;
console.log(data)
const result = await eventsCollection.insertOne(data);
res.send(result)
})

app.get('/create-event',async(req,res)=>{
const result = await eventsCollection.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();
      res.json(result)
})

app.get('/upcoming-events',async(req,res)=>{
const result = await eventsCollection.find({})
    .sort({ createdAt: -1 })
    .toArray();
      res.json(result)
})
app.get('/upcoming-events/:id',async(req,res)=>{
  const {id} = req.params;
    const result = await eventsCollection.findOne({_id: new ObjectId(id)})
    res.send(result)
})
app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})

export default app;