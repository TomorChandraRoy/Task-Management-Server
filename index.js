const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//MidileWare
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.octeyq5.mongodb.net/?retryWrites=true&w=majority`;

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

    //DatabaseName and CollectionName
    const addTaskCollcetion = client.db("addTasksPostDB").collection("addTasks");

     // Tasks  FORM aer data save mongodb 
    app.post('/addTasks', async (req, res) => {
        const addTasks = req.body;
        console.log(addTasks);
        const result = await addTaskCollcetion.insertOne(addTasks);
        res.send(result);
      });

    //Tasks  FORM aer data load 
    app.get('/addTasks', async(req,res) =>{
      const result = await addTaskCollcetion.find().toArray();
      res.send(result);
    });

 
    

   //Tasks  FORM aer single Email data load 
    app.get('/userTasks', async (req, res) => {
      try {
          console.log(req.query.email);
          let query = {};
          if (req.query?.email) {
              console.log(req.query?.email)
              query = { email: req.query.email };
          }
          const result = await addTaskCollcetion.find(query).toArray();
          console.log(result)
          res.send(result);
      } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
      }
  });


  app.delete('/usertasks/:id', async(req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await addTaskCollcetion.deleteOne(query);
    res.send(result);
  })

  app.get('/usertasks/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await addTaskCollcetion.findOne(query);
    res.send(result);
  })


  app.put('/usertasks/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = { upsert: true };
    const updatedItem = req.body;
    const item ={
      $set: {
        name: updatedItem.name,
        email: updatedItem.email,
        priority: updatedItem.priority,
        notes: updatedItem.notes,
        customerName: updatedItem.name,
        title: updatedItem.title,
        time: updatedItem.time,
        
      }
    };
    const result = await addTaskCollcetion.updateOne(filter, item, options);
    res.send(result);
  });

    // await client.connect();
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
  res.send('Tasks Server Runing')
})

app.listen(port, () => {
  console.log(`Task app listening on port ${port}`)
})