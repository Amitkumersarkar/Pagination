const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqgbxlh.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //  Connect and test connection
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(" Connected to MongoDB successfully!");

    // Database & collection
    const productCollection = client.db('emaJohnDB').collection('products');

    // Routes
    app.get('/products', async (req, res) => {
      try {
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        const result = await productCollection.find().skip(page * size).limit(size).toArray();
        res.send(result);


      } catch (err) {
        console.error(" Error fetching products:", err);
        res.status(500).send({ message: "Server Error" });
      }
    });

    app.get('/productsCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    })

  } catch (err) {
    console.error(" MongoDB connection failed:", err.message);
  }
}

run().catch(err => console.error(" Top-level run() error:", err.message));

app.get('/', (req, res) => {
  res.send('john is busy shopping');
});

app.listen(port, () => {
  console.log(` ema john server is running on port: ${port}`);
});
