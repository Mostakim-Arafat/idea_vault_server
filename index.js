const dns = require('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const express = require('express')
const app = express()
const port = 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://idea_vault:idea_vault2005@cluster0.6ivmdtk.mongodb.net/?appName=Cluster0";
const cors = require('cors');

app.use(cors());
app.use(express.json())

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const myDB = client.db("ideas_vault");
const myColl = myDB.collection("Ideas");
const myCollComment = myDB.collection('Comment')

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        app.post('/ideas', async (req, res) => {
            const data = await req.body
            const result = await myColl.insertOne(data)
            res.send(result)
        })

        app.get('/ideas', async (req, res) => {
            const result = await myColl.find().toArray()
            res.send(result)
        })


        app.get('/ideas/:id', async (req, res) => {
            const idnumber = req.params.id
            // console.log(idnumber)
            const querys = {
                _id: new ObjectId(idnumber)
            }
            const result = await myColl.findOne(querys)
            res.send(result)
        })

        app.patch('/ideas/:id', async(req,res) => {
            const bodyId = await req.params.id
            const bodys = req.body
            console.log(bodyId,bodys)
            const query = {
                _id : new ObjectId(bodyId)
            }
            const update = { $set: bodys };
            const result = await myColl.updateOne(query,update)
            console.log(result)
            res.send(result)
        })

        app.delete('/ideas/:id',async(req,res) => {
            const reqId = req.params.id
            const querys = {
                _id : new ObjectId(reqId)
            }
            const result = await myColl.deleteOne(querys)
            res.send(result)
        })

        app.post('/comment', async (req, res) => {
            const body = await req.body
            if (body.Data) {
                const result = await myCollComment.insertOne(body)
                res.send(result)
            }
        })

        app.get('/comment', async(req,res) => {
            const result = await myCollComment.find({}).toArray()
            res.send(result)
        })

        app.patch('/comment', async (req, res) => {
            const bodyTime = req.body.Time
            const bodysData = req.body.Data
            const bodysID = req.body.Commentid
            console.log(req.body)
            const query = { _id : new ObjectId(bodysID) };
            const update = { $set: { Data: bodysData , Time : bodyTime } };
            const options = { };
            const result = await myCollComment.updateOne(query, update, options);
            //console.log(result)
            res.send(result)
        })

        app.delete('/comment', async(req,res) => {
            const bodysID = req.body.commentID
            const qureys = {_id : new ObjectId(bodysID)}
            const result = await myCollComment.deleteOne(qureys)
            console.log(result)
            res.send(result)
        })

        app.delete('/comment/:IdeaId', async(req,res) => {
            const bodysID = await req.params.IdeaId
            const qureys = { IdeaPageid : bodysID }
            const result = await myCollComment.deleteMany(qureys)
            console.log(result)
            res.send(result)
        })

        app.get('/ideas/:id/comment', async (req, res) => {
            const idorginal = req.params.id
            console.log(idorginal)
            const querys = {
                IdeaPageid: idorginal
            }
            const result = await myCollComment.find(querys).toArray()
            // console.log(result)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("ideas_vault").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

