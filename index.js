const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Config
const app = express();
const port = process.env.PORT || 5010;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2bu9h7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//https://i.ibb.co/bm32RsT/img20240427-12245804.png
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // Create database and collection
        const craftsCollection = client.db("craftsDB").collection("crafts");
        const categoriesCollection = client.db("categoriesDB").collection("categories")


        // Data Received from Database
        app.get('/addcrafts', async (req, res) => {
            const cursor = craftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/categories', async(req,res) => {
            const cursor = categoriesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Received data from client side and send to database
        app.post('/addcrafts', async (req, res) => {
            const newCrafts = req.body;
            console.log(newCrafts);
            const result = await craftsCollection.insertOne(newCrafts);
            res.send(result);   // result send to Database
        })

        // app.post('/add_coffee', async (req, res) => {
        //     const addedNewCoffee = req.body;
        //     console.log(addedNewCoffee);
        //     // Insert the defined document into the "coffeeCollection" collection
        //     const result = await coffee.insertOne(addedNewCoffee);
        //     res.send(result);
        // })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('Server Running')
})

app.listen(port, () => {
    console.log(`Server is running port no. ${port}`);
})