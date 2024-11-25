import express from "express";
import cors from "cors";
import { config } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const mockTimeSlots = [
  {
    id: 1,
    date: "2024-11-25",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: false,
  },
  {
    id: 2,
    date: "2024-11-25",
    start_time: "10:00",
    end_time: "11:00",
    is_booked: false,
  },
  {
    id: 3,
    date: "2024-11-26",
    start_time: "09:00",
    end_time: "10:00",
    is_booked: true,
  },
];

app.get("/", (req, res) => {
  res.json({ message: "Booking API Running" });
});

app.get("/api/availability", (req, res) => {
  res.json(mockTimeSlots);
});

app.post("/api/appointments", (req, res) => {
  res.status(201).json({
    message: "Appointment created",
    appointment: req.body,
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
