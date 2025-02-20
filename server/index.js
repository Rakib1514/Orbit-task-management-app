const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {

    const userCollection = client.db("Orbit").collection("users");
    const taskCollection = client.db("Orbit").collection("task");
    
    
    
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
