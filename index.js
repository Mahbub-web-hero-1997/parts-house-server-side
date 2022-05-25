const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;
// user : manufacturer_admin
// Password : rEP67IAoVyqgGzHH

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wkrlazh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('manufacturerProduct').collection('product');
        const reviewCollection = client.db('manufacturerProduct').collection('review');
        // Get All Parts from Database
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const product = await cursor.toArray()
            res.send(product)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result)
        })
        // get All review
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('This is New World')
})



app.listen(port, () => {
    console.log('The Port is Listening to', port);
})