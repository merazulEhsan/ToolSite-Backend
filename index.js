const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhui8i0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("Tool_Site").collection("Products");
    const orderCollection = client.db("Tool_Site").collection("Orders");
    // Show product in home page
    app.get("/products", async (req, res) => {
      const query = {};
      const cursour = productCollection.find(query);
      const products = await cursour.toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleProduct = await productCollection.findOne(query);
      res.send(singleProduct);
    });
    
    app.post('/order', async(req,res)=>{
      const order = req.body;
      const result =await orderCollection.insertOne(order);
      res.send(result);
    })

    app.put('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const updateItem = req.body;
      const filter = {_id : ObjectId(id)};
      const option = {upsert : true};
      const updateDoc = {
        $set : updateItem
      };
      const result = await productCollection.updateOne(filter, updateDoc, option);
      res.send(result)

    });




  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("WELCOME TO TOOLSITE!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
