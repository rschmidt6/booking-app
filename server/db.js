// server/db.js
import Database from "better-sqlite3";

const db = new Database("bookings.db", { verbose: console.log });

const init = () => {
  // Drop existing tables
  db.exec(`
    DROP TABLE IF EXISTS appointments;
    DROP TABLE IF EXISTS availability;
    DROP TABLE IF EXISTS flash_images;
    DROP TABLE IF EXISTS email_subscribers;
  `);

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_booked INTEGER DEFAULT 0,
      UNIQUE(date, start_time, end_time)
    );

    CREATE TABLE IF NOT EXISTS appointments (
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

    CREATE TABLE IF NOT EXISTS flash_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      public_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS email_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_subscribed INTEGER DEFAULT 1
    );
  `);

  // Insert test data
  const mockData = createMockData();
  insertMockData(mockData);
};

const createMockData = () => {
  return {
    availability: [
      // Monday December 2, 2024
      ["2024-12-02", "14:00", "15:00", 0],
      ["2024-12-02", "17:00", "18:00", 0],

      // Wednesday December 4, 2024
      ["2024-12-04", "14:00", "15:00", 0],
      ["2024-12-04", "17:00", "18:00", 0],

      // Saturday December 7, 2024
      ["2024-12-07", "14:00", "15:00", 1],
      ["2024-12-07", "17:00", "18:00", 1],

      // Monday December 9, 2024
      ["2024-12-09", "14:00", "15:00", 0],
      ["2024-12-09", "17:00", "18:00", 1],

      // Wednesday December 11, 2024
      ["2024-12-11", "14:00", "15:00", 1],
      ["2024-12-11", "17:00", "18:00", 0],

      // Saturday December 14, 2024
      ["2024-12-14", "14:00", "15:00", 0],
      ["2024-12-14", "17:00", "18:00", 1],

      // Monday December 16, 2024
      ["2024-12-16", "14:00", "15:00", 0],
      ["2024-12-16", "17:00", "18:00", 0],

      // Wednesday December 18, 2024
      ["2024-12-18", "14:00", "15:00", 0],
      ["2024-12-18", "17:00", "18:00", 0],

      // Saturday December 21, 2024
      ["2024-12-21", "14:00", "15:00", 0],
      ["2024-12-21", "17:00", "18:00", 0],

      // Monday December 23, 2024
      ["2024-12-23", "14:00", "15:00", 0],
      ["2024-12-23", "17:00", "18:00", 0],

      // Wednesday December 25, 2024
      ["2024-12-25", "14:00", "15:00", 0],
      ["2024-12-25", "17:00", "18:00", 0],

      // Saturday December 28, 2024
      ["2024-12-28", "14:00", "15:00", 0],
      ["2024-12-28", "17:00", "18:00", 0],

      // Monday December 30, 2024
      ["2024-12-30", "14:00", "15:00", 1],
      ["2024-12-30", "17:00", "18:00", 0],

      // Wednesday January 1, 2025
      ["2025-01-01", "14:00", "15:00", 0],
      ["2025-01-01", "17:00", "18:00", 0],

      // Saturday January 4, 2025
      ["2025-01-04", "14:00", "15:00", 0],
      ["2025-01-04", "17:00", "18:00", 0],

      // Monday January 6, 2025
      ["2025-01-06", "14:00", "15:00", 0],
      ["2025-01-06", "17:00", "18:00", 0],

      // Wednesday January 8, 2025
      ["2025-01-08", "14:00", "15:00", 0],
      ["2025-01-08", "17:00", "18:00", 0],

      // Saturday January 11, 2025
      ["2025-01-11", "14:00", "15:00", 0],
      ["2025-01-11", "17:00", "18:00", 0],

      // Monday January 13, 2025
      ["2025-01-13", "14:00", "15:00", 0],
      ["2025-01-13", "17:00", "18:00", 0],

      // Wednesday January 15, 2025
      ["2025-01-15", "14:00", "15:00", 0],
      ["2025-01-15", "17:00", "18:00", 0],

      // Saturday January 18, 2025
      ["2025-01-18", "14:00", "15:00", 0],
      ["2025-01-18", "17:00", "18:00", 0],

      // Monday January 20, 2025
      ["2025-01-20", "14:00", "15:00", 0],
      ["2025-01-20", "17:00", "18:00", 0],

      // Wednesday January 22, 2025
      ["2025-01-22", "14:00", "15:00", 0],
      ["2025-01-22", "17:00", "18:00", 0],

      // Saturday January 25, 2025
      ["2025-01-25", "14:00", "15:00", 0],
      ["2025-01-25", "17:00", "18:00", 0],

      // Monday January 27, 2025
      ["2025-01-27", "14:00", "15:00", 0],
      ["2025-01-27", "17:00", "18:00", 0],

      // Wednesday January 29, 2025
      ["2025-01-29", "14:00", "15:00", 0],
      ["2025-01-29", "17:00", "18:00", 1],
    ],
    appointments: [
      [
        "John Doe",
        "john@example.com",
        25,
        "@johnd",
        200,
        "Small arm tattoo",
        3,
      ],
      ["Jane Smith", "jane@example.com", 30, "@janes", 500, "Back piece", 5],
    ],
  };
};

const insertMockData = (mockData) => {
  const insertAvailability = db.prepare(`
    INSERT INTO availability (date, start_time, end_time, is_booked)
    VALUES (?, ?, ?, ?)
  `);

  const insertAppointment = db.prepare(`
    INSERT INTO appointments (
      client_name, email, age, instagram_handle, 
      budget, service_description, availability_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    mockData.availability.forEach((slot) => insertAvailability.run(slot));
    mockData.appointments.forEach((appt) => insertAppointment.run(appt));
  })();
};

export { db, init };
