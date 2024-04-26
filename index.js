const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpk7gxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        // const spotCollection = client.db("tourismSpot").collection("places");
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const spotCollection = client.db("tourismSpot").collection("places");
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
         
        app.get('/AddTouristSpot', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        
        app.post("/AddTouristSpot", async (req, res) => {
            console.log(req.body);
            const result = await spotCollection.insertOne(req.body);
            console.log(result);
            res.send(result)
        })
        app.get("/myList/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await spotCollection.find({user_email: req.params.email}).toArray();
            res.send(result)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism management server is running')
});

app.listen(port, () => {
    console.log(`Server is ruuning on PORT: ${port}`)
})
