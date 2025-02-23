import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI;
console.log("Mongo URI:", mongoUri);

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function startServer() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db(process.env.MONGO_DB || "test");
    const usersCollection = db.collection("users");

    app.post("/api/users", async (req, res) => {
      try {
        const { id, name, email, picture } = req.body;
        if (!id || !email) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await usersCollection.findOne({ googleId: id });
        let user;

        if (existingUser) {
          await usersCollection.updateOne(
            { googleId: id },
            { $set: { name, email, picture } }
          );
          user = await usersCollection.findOne({ googleId: id });
        } else {
          const newUser = {
            googleId: id,
            name,
            email,
            picture,
            createdAt: new Date(),
            wordlePts: 0,
            connectionsPts: 0,
          };
          const result = await usersCollection.insertOne(newUser);
          user = await usersCollection.findOne({ _id: result.insertedId });
        }

        res.status(200).json(user);
      } catch (error) {
        console.error("Error creating/updating user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.patch("/api/users/:id/increase-wordle-pts", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersCollection.findOneAndUpdate(
          { googleId: id },
          { $inc: { wordlePts: 1 } },
          { returnDocument: "after" }
        );
        if (!result.value) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result.value);
      } catch (error) {
        console.error("Error increasing wordle pts:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.patch("/api/users/:id/increase-connections-pts", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersCollection.findOneAndUpdate(
          { googleId: id },
          { $inc: { connectionsPts: 1 } },
          { returnDocument: "after" }
        );
        if (!result.value) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result.value);
      } catch (error) {
        console.error("Error increasing connections pts:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/api/wordleLeaderboard", async (req, res) => {
      try {
        const leaderboard = await usersCollection
          .find({}, { projection: { name: 1, wordlePts: 1 } })
          .sort({ wordlePts: -1 })
          .toArray();
        res.status(200).json(leaderboard);
      } catch (error) {
        console.error("Error fetching wordle leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/api/connectionsLeaderboard", async (req, res) => {
      try {
        const leaderboard = await usersCollection
          .find({}, { projection: { name: 1, connectionsPts: 1 } })
          .sort({ connectionsPts: -1 })
          .toArray();
        res.status(200).json(leaderboard);
      } catch (error) {
        console.error("Error fetching connections leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();
