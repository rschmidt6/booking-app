// server/index.js
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { init } from "./db.js";
import * as appointmentController from "./controllers/appointmentController.js";
import * as availabilityController from "./controllers/availabilityController.js";
import * as flashController from "./controllers/flashController.js";
import * as emailController from "./controllers/emailController.js";

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database
init();

// Appointment routes
app.get("/api/appointments", appointmentController.getAppointments);
app.post("/api/appointments", appointmentController.createAppointment);
app.put("/api/appointments/:id", appointmentController.updateAppointment);
app.delete("/api/appointments/:id", appointmentController.deleteAppointment);

// Availability routes
app.get("/api/availability", availabilityController.getAvailability);
app.post("/api/availability", availabilityController.addAvailability);
app.post("/api/availability/bulk", availabilityController.addBulkAvailability);
app.delete("/api/availability/:id", availabilityController.deleteAvailability);

// Flash routes
app.get("/api/flash", flashController.getFlashImages);
app.post("/api/flash", flashController.uploadImage);
app.delete("/api/flash/:id", flashController.deleteImage);

// Email routes
app.post("/api/subscribe", emailController.subscribeEmail);
app.post("/api/unsubscribe", emailController.unsubscribeEmail);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
