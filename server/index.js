require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db, init } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database
init();

// Example endpoint
app.get("/api/availability", (req, res) => {
  const availability = db.prepare("SELECT * FROM availability").all();
  res.json(availability);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
