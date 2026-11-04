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
const myJoinedEventsCollection = db.collection('joined-event')

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.post('/create-event',async(req,res)=>{
const data = req.body;
console.log(data)
const result = await eventsCollection.insertOne(data);
res.send(result)
})
// app.post("/create-event", async (req, res) => {
//     try {
//         const eventData = req.body

//         const result = await eventsCollection.insertOne({
//             ...eventData,
//             createdAt: new Date(),
//         })

//         res.status(201).send({
//             success: true,
//             message: "Event created successfully",
//             insertedId: result.insertedId,
//         })
//     } catch (error) {
//         res.status(500).send({
//             message: "Failed to create event",
//         })
//     }
// })

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

app.delete('/upcoming-events/:id',async(req,res)=>{
 const {id} = req.params;
     const result = await eventsCollection.deleteOne({_id: new ObjectId(id)})
res.json(result)
})

app.patch('/upcoming-events/:id',async(req,res)=>{
const {id} = req.params;
const data = req.body
const result = await eventsCollection.updateOne(
  {_id:new ObjectId(id)},
{$set: data});
res.send(result)

})
app.post('/joined-event',async(req,res)=>{
const data = req.body;
console.log(data)
const result = await myJoinedEventsCollection.insertOne(data);
res.send(result)
})

app.get('/joined-event/:email',async(req,res)=>{
   const {email} = req.params;
  console.log(email)
  const result = await myJoinedEventsCollection.find({email:email}).toArray();
  res.send(result);
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})




export default app;