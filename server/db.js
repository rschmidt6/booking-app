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
      ["2024-11-25", "09:00", "10:00", 0],
      ["2024-11-25", "10:00", "11:00", 0],
      ["2024-11-25", "11:00", "12:00", 1],
      ["2024-11-25", "13:00", "14:00", 0],
      ["2024-11-26", "09:00", "10:00", 0],
      ["2024-11-26", "10:00", "11:00", 1],
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
