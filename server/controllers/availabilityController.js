// server/controllers/availabilityController.js
import { db } from "../db.js";

export const getAvailability = (req, res) => {
  try {
    const availability = db
      .prepare(
        `
      SELECT * FROM availability 
      WHERE date >= date('now') 
      ORDER BY date, start_time
    `
      )
      .all();
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addAvailability = (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const result = db
      .prepare(
        `
      INSERT INTO availability (date, start_time, end_time, is_booked)
      VALUES (?, ?, ?, 0)
    `
      )
      .run(date, startTime, endTime);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addBulkAvailability = (req, res) => {
  try {
    const { slots } = req.body;
    const insert = db.prepare(`
      INSERT INTO availability (date, start_time, end_time, is_booked)
      VALUES (?, ?, ?, 0)
    `);

    const results = db.transaction(() => {
      return slots.map((slot) =>
        insert.run(slot.date, slot.startTime, slot.endTime)
      );
    })();

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAvailability = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare("DELETE FROM availability WHERE id = ?").run(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
