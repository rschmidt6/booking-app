import Database from "better-sqlite3";

const db = new Database("bookings.db", { verbose: console.log });

const init = () => {
  // Drop existing tables
  db.exec(`
    DROP TABLE IF EXISTS appointments;
    DROP TABLE IF EXISTS availability;
  `);

  // Create tables
  db.exec(`
    CREATE TABLE availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_booked BOOLEAN DEFAULT FALSE,
      UNIQUE(date, start_time, end_time)
    );

    CREATE TABLE appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      client_name TEXT NOT NULL,
      email TEXT NOT NULL,
      age INTEGER NOT NULL,
      instagram_handle TEXT,
      budget DECIMAL(10,2),
      service_description TEXT NOT NULL,
      availability_id INTEGER NOT NULL,
      FOREIGN KEY(availability_id) REFERENCES availability(id)
    );
  `);

  // Insert some test data
  const insertAvailability = db.prepare(`
    INSERT INTO availability (date, start_time, end_time, is_booked)
    VALUES (?, ?, ?, ?)
  `);

  // Add some test time slots
  const testSlots = [
    ["2024-11-25", "09:00", "10:00", false],
    ["2024-11-25", "10:00", "11:00", false],
    ["2024-11-25", "11:00", "12:00", false],
    ["2024-11-25", "13:00", "14:00", false],
    ["2024-11-25", "14:00", "15:00", false],
    ["2024-11-26", "09:00", "10:00", false],
    ["2024-11-26", "10:00", "11:00", false],
    ["2024-11-26", "11:00", "12:00", false],
  ];

  testSlots.forEach((slot) => {
    insertAvailability.run(slot);
  });
};

// Helper functions for common queries
const getAvailableSlots = db.prepare(`
  SELECT * FROM availability 
  WHERE is_booked = FALSE 
  AND date >= date('now')
  ORDER BY date, start_time
`);

const bookSlot = db.prepare(`
  UPDATE availability 
  SET is_booked = TRUE 
  WHERE id = ?
`);

const createAppointment = db.prepare(`
  INSERT INTO appointments (
    client_name, email, age, instagram_handle, 
    budget, service_description, availability_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

export { db, init, getAvailableSlots, bookSlot, createAppointment };
