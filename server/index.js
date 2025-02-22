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

    // Get all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
    });

    // Get all tasks sorted by order
    app.get("/tasks/:uid", async (req, res) => {
      const { uid } = req.params;
      const tasks = await taskCollection
        .find({ uid })
        .sort({ order: 1 })
        .toArray();

      res.send(tasks);
    });

    // Update order and category for tasks (drag and drop)
    app.put("/tasks/update-order", async (req, res) => {
      const { tasks } = req.body;
      console.log(tasks);
      try {
        if (!tasks || !Array.isArray(tasks)) {
          return res.status(400).json({ error: "Invalid data format" });
        }

        const bulkOps = tasks
          .map((task) => {
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
                update: {
                  $set: { order: task.order, category: task.category },
                },
              },
            };
          })
          .filter(Boolean);

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

    // Add a new task
    app.post("/tasks", async (req, res) => {
      try {
        const { uid, title, description, category, order, createdAt } =
          req.body;
        if (
          !uid ||
          !title ||
          !description ||
          !category ||
          order === undefined ||
          !createdAt
        ) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newTask = { uid, title, description, category, order, createdAt };
        const result = await taskCollection.insertOne(newTask);
        res.json({
          message: "Task added successfully",
          taskId: result.insertedId,
        });
      } catch (error) {
        console.error("Failed to add task:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Update (edit) an existing task
    app.put("/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { title, description, category } = req.body;
        if (!title || !description || !category) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, description, category } }
        );

        if (result.modifiedCount === 1) {
          res.json({ message: "Task updated successfully" });
        } else {
          res.status(404).json({ error: "Task not found or no changes made" });
        }
      } catch (error) {
        console.error("Failed to update task:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Delete a task
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await taskCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.json({ message: "Task deleted successfully" });
        } else {
          res.status(404).json({ error: "Task not found" });
        }
      } catch (error) {
        console.error("Failed to delete task:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } finally {
    // Uncomment the next line to close the connection after operations if needed
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
