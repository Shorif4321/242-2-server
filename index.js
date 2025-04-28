const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = 7000;

const uri = "mongodb+srv://curd:jSjiGxnWwdS0bIgc@cluster0.3ftktcj.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// middleware
app.use(cors());
app.use(express.json())


async function databaseRun() {
    try {
        await client.connect();
        const database = client.db("CURD");
        const userCollection = database.collection('user')

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await userCollection.find(query).toArray()
            res.send(users)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const idFromBrowser = req.params.id;
            const query = { _id: new ObjectId(idFromBrowser) }
            const user = await userCollection.findOne(query);
            res.send(user)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            // 680cfbdece92cef06ee7eb9e
            // ObjectId("680cfbdece92cef06ee7eb9e")
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true };

            const updatedUser = req.body;
            const user = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    age: updatedUser.phone,
                    image: updatedUser.image
                }
            }
            const result = await userCollection.updateOne(filter, user, option)
            res.send(result)
        })


    } finally {

    }
}
databaseRun().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Backend World 242-1 for')
    // console.log(res);
})

app.listen(port, () => {
    console.log(`Our Backend Run on Port: ${port}`);
})