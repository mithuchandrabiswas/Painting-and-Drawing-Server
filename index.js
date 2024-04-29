const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        // for id fetching
        app.get('/addcrafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftsCollection.findOne(query);
            res.send(result);
        })

        app.get('/categories', async (req, res) => {
            const cursor = categoriesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Update Data
        app.put('/addcrafts/:id', async (req, res) => {
            const id = req.params.id;
            // Create a filter for update craft
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCraft = req.body;
            const craft = {
                $set: {
                    image: updatedCraft.image,
                    craftName: updatedCraft.craftName,
                    subCategory: updatedCraft.subCategory,
                    shortDescription: updatedCraft.shortDescription,
                    price: updatedCraft.price,
                    rating: updatedCraft.rating,
                    customization: updatedCraft.customization,
                    processingTime: updatedCraft.processingTime,
                    stockStatus: updatedCraft.stockStatus
                },
            }

            // Update the first document that matches the filter
            const result = await craftsCollection.updateOne(filter, craft, options);
            res.send(result);
        })

        // Received data from client side and send to database
        app.post('/addcrafts', async (req, res) => {
            const newCrafts = req.body;
            console.log(newCrafts);
            const result = await craftsCollection.insertOne(newCrafts);
            res.send(result);   // result send to Database
        })

        // Delete Craft from database
        app.delete('/addcrafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            // console.log(query);
            const result = await craftsCollection.deleteOne(query);
            // console.log(object);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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