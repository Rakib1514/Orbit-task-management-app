const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); 
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

    app.get("/users", async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
    });

    app.get("/tasks", async (req, res) => {
      const tasks = await taskCollection.find({}).sort({ order: 1 }).toArray();
      res.send(tasks);
    });
    
    app.put("/tasks/update-order", async (req, res) => {
      const { tasks } = req.body;
      console.log(tasks);
      try {
        if (!tasks || !Array.isArray(tasks)) {
          return res.status(400).json({ error: "Invalid data format" });
        }
  
        const bulkOps = tasks.map((task) => {
          if (
            !task._id ||
            typeof task.order !== "number" ||
            typeof task.category !== "string"
          ) {
            console.error("Invalid task format:", task);
            return null;
          }
          return {
            updateOne: {
              filter: { _id: new ObjectId(task._id) },
              update: { $set: { order: task.order, category: task.category } },
            },
          };
        }).filter(Boolean);
  
        if (bulkOps.length === 0) {
          return res.status(400).json({ error: "No valid tasks to update" });
        }
  
        const result = await taskCollection.bulkWrite(bulkOps);
        console.log("Updated tasks:", result);
  
        res.json({ message: "Order and category updated successfully" });
      } catch (error) {
        console.error("Failed to update tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } finally {
    // Optional: Uncomment to close the client after operations
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
