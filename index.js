import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
import { createRemoteJWKSet, jwtVerify } from 'jose';
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



const verifyToken = async(req,res,next)=>{
  const authHeader = req.headers.authorization;

  console.log("Authorization header exists:", !!authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send({ msg: "Missing Bearer token!" });
  }
  const token = authHeader.split(" ")[1];

  console.log("Bearer token exists:", !!token);

  if (!token) {
    return res.status(401).send({ msg: "Token is missing!" });
  }
   const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
  );
  console.log(JWKS)

  try {
    const { payload } = await jwtVerify(token, JWKS);

    console.log("JWT verified successfully:", true);

    req.user = payload;
    next();
  } catch (error) {
    // console.error("JWT verification failed:", error.message);
    console.error("JWT verification failed:");
console.error("Error name:", error.name);
console.error("Error code:", error.code);
console.error("Error message:", error.message);

    return res.status(401).send({ msg: "Invalid or expired token!" });
  }
}


app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.post('/create-event',verifyToken,async(req,res)=>{
const data = req.body;
console.log(data)
const result = await eventsCollection.insertOne(data);
res.send(result)
})


app.get('/create-event', async (req, res) => {
  const result = await eventsCollection.find()
    .sort({ date: 1 })
    .limit(6)
    .toArray();
      res.send(result)
})

app.get('/upcoming-events',async(req,res)=>{
const result = await eventsCollection.find({})
    .sort({ date: 1 })
    .toArray();
      res.json(result)
})


app.get('/upcoming-events/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid event ID",
      })
    }

    const result = await eventsCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!result) {
      return res.status(404).send({
        message: "Event not found",
      })
    }

    res.status(200).send(result)
  } catch (error) {
    console.error("Error fetching event:", error)

    res.status(500).send({
      message: "Failed to fetch event",
    })
  }
})


app.delete('/upcoming-events/:id',verifyToken,async(req,res)=>{
 const {id} = req.params;
     const result = await eventsCollection.deleteOne({_id: new ObjectId(id)})
res.json(result)
})

app.patch('/manage-event/:id',verifyToken,async(req,res)=>{
const {id} = req.params;
const data = req.body
const result = await eventsCollection.updateOne(
  {_id:new ObjectId(id)},
{$set: data});
res.send(result)

})

// app.post('/joined-event',verifyToken,async(req,res)=>{
// const data = req.body;
// console.log(data)
// const result = await myJoinedEventsCollection.insertOne(data);
// res.send(result)
// })

app.post('/joined-event', verifyToken, async (req, res) => {
  try {
    const data = req.body;

    if (req.user.email !== data.email) {
      return res.status(403).send({
        message: "You cannot join using another user's email."
      });
    }

    const result = await myJoinedEventsCollection.insertOne({
      ...data,
      joinedAt: new Date()
    });

    res.status(201).send({
      message: "Successfully joined the event!",
      insertedId: result.insertedId
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({
        message: "You have already joined this event!"
      });
    }

    console.error(error);
    res.status(500).send({
      message: "Failed to join event."
    });
  }
});

app.get('/joined-event/:email',verifyToken,async(req,res)=>{
   const {email} = req.params;
  console.log(email)
  const result = await myJoinedEventsCollection.find({email:email}).sort({ date: 1 }).toArray();
  res.send(result);
})

app.delete('/joined-event/:id',verifyToken,async(req,res)=>{
 const {id} = req.params;
const result = await myJoinedEventsCollection.deleteOne(    {_id : id,})
res.send(result)
})

app.get('/manage-event/:email',verifyToken, async (req, res) => {
  try {
    const { email } = req.params;

    const result = await eventsCollection
      .find({ creatorEmail: email })
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to fetch managed events",
    });
  }
});

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})




export default app;