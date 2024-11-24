// server/db.js
import Database from "better-sqlite3";

const db = new Database("bookings.db", { verbose: console.log });

const init = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      UNIQUE(appointment_date, appointment_time)
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
  `);
};

export { db, init };
