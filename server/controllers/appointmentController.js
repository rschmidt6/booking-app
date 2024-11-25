// server/controllers/appointmentController.js
import { db } from "../db.js";

export const getAppointments = (req, res) => {
  try {
    const appointments = db
      .prepare(
        `
      SELECT a.*, av.date, av.start_time, av.end_time
      FROM appointments a
      JOIN availability av ON a.availability_id = av.id
      ORDER BY av.date, av.start_time
    `
      )
      .all();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAppointment = (req, res) => {
  try {
    const {
      clientName,
      email,
      age,
      instagramHandle,
      budget,
      serviceDescription,
      availabilityId,
    } = req.body;

    const result = db.transaction(() => {
      // Update availability to booked
      db.prepare("UPDATE availability SET is_booked = 1 WHERE id = ?").run(
        availabilityId
      );

      // Create appointment
      return db
        .prepare(
          `
        INSERT INTO appointments (
          client_name, email, age, instagram_handle, 
          budget, service_description, availability_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          clientName,
          email,
          age,
          instagramHandle,
          budget,
          serviceDescription,
          availabilityId
        );
    })();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      email,
      age,
      instagramHandle,
      budget,
      serviceDescription,
    } = req.body;

    const result = db
      .prepare(
        `
      UPDATE appointments 
      SET client_name = ?, email = ?, age = ?, 
          instagram_handle = ?, budget = ?, service_description = ?
      WHERE id = ?
    `
      )
      .run(
        clientName,
        email,
        age,
        instagramHandle,
        budget,
        serviceDescription,
        id
      );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAppointment = (req, res) => {
  try {
    const { id } = req.params;

    const result = db.transaction(() => {
      // Get availability_id before deleting appointment
      const appt = db
        .prepare("SELECT availability_id FROM appointments WHERE id = ?")
        .get(id);

      // Delete appointment
      db.prepare("DELETE FROM appointments WHERE id = ?").run(id);

      // Update availability to not booked
      db.prepare("UPDATE availability SET is_booked = 0 WHERE id = ?").run(
        appt.availability_id
      );

      return { success: true };
    })();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
