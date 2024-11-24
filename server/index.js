import express from "express";
import cors from "cors";
import { db, init } from "./db.js";
import { config } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database
init();

// Example endpoint
app.get("/api/availability", (req, res) => {
  const availability = db.prepare("SELECT * FROM availability").all();
  res.json(availability);
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
