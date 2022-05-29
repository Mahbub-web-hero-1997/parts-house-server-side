const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
app.use(cors())
app.use(express.json())
const stripe = require('stripe')('sk_test_51L4WwpDRe7DePKUJgqSYEOTpLMx6cBMusBtH5MG0gDexXteUsQtEEOvvjdAlWLfC7ck7fQl1GU54XBr6aUswYTKE00Rc8C7K4L');
const port = process.env.PORT || 5000;
// user : manufacturer_admin
// Password : rEP67IAoVyqgGzHH

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wkrlazh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('manufacturerProduct').collection('product');
        const orderCollection = client.db('manufacturerProduct').collection('order');
        const reviewCollection = client.db('manufacturerProduct').collection('review');
        const directorsCollection = client.db('manufacturerProduct').collection('directors');
        const paymentCollection = client.db('manufacturerProduct').collection('payment');
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

        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const query = orderCollection.find(filter);
            const result = await query.toArray();
            res.send(result);
        });

        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(filter);
            res.send(result);
        });

        // get user data for token 
        app.get('/get-payment/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await orderCollection.findOne(filter)
            res.send(result)
        })

        // get All review
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        // get All directors
        app.get('/director', async (req, res) => {
            const query = {}
            const cursor = directorsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        // payment intent 
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body
            const paymentIntent = await stripe.paymentIntents.create({
                amount: price * 100,
                currency: 'usd',
                payment_method_types: ['card']
            })
            res.send({ clientSecret: paymentIntent.client_secret })
        })
        // update user information and service data 
        app.post('/payment-complete', async (req, res) => {
            const body = req.body;
            const result = await paymentCollection.insertOne(body)
            res.send(result)
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