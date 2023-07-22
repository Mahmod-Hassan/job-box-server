const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const port = process.env.PORT || 5000;

//  middlewares
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcblope.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      // Connect the client to the server
      await client.connect();
      const userCollection = client.db('jobBox').collection('users');
      const jobCollection = client.db('jobBox').collection('jobs');
     
      app.post('/user', async (req, res) => {
          const user = req.body;
          const result = await userCollection.insertOne(user);
          res.send(result);
      })
      app.get('/user/:email', async (req, res) => {
        const email = req.params.email;
        const result = await userCollection.findOne({email:email});
        if(result?.email){
          return res.send({status: true, data: result})
        }else{
         return res.send({email: email})
        }
      })
      app.post('/job', async (req, res) => {
        const job = req.body;
        console.log(job);
        const result = await jobCollection.insertOne(job);
        res.send(result);
      })
    } 
    
    finally {
    //   await client.close();
    }
  }
  run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('server is running');
})
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
