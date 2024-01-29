require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express'); 
const cors = require('cors');

// initailization
const app = express();

// declaration
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjslrno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Coffee CRUD RUNNING');
})


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    // user collection
    const myDB = client.db("user");
    const myCol = await myDB.collection("userCollection");
    // coffes
    const coffCol = await client.db("coffees").collection("coffeeCollection")

    app.get('/users', async(req, res) => {
      const cursor = myCol.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    })

    app.get('/coffees', async(req, res) => {
      const cursor = coffCol.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    })

    app.get('/users/:id', async(req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await myCol.findOne(query);
      res.send(result);
    })

    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await coffCol.findOne(query);
      res.send(result);
    })

    app.post('/coffees', async(req, res) => {
      const coffees = req.body;
      console.log(coffees);
      const result = await coffCol.insertOne(coffees);
      res.send(result);
    })

    app.post('/users', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await myCol.insertOne(user);
      res.send(result);
    })

    app.put("/users/:id", async(req, res) => {
      const id = req.params.id;
      const user = req.body;
      // console.log(updatedUser);
      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true }

      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }

      const result = await myCol.updateOne(filter, updatedUser, options);

      res.send(result);
    })


    app.delete("/users/:id", async(req, res) => {
      const id = req.params.id;
      // console.log("please delete from database: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await myCol.deleteOne(query);
      res.send(result);
    })

    app.delete("/coffees/:id", async(req, res) => {
      const id = req.params.id;
      // console.log("please delete from database: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await coffCol.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Coffee CRUD is running on port, ${port}`);
})