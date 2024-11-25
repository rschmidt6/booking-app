// server/controllers/emailController.js
import { db } from "../db.js";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: env.email.service,
  auth: {
    user: env.email.user,
    pass: env.email.password,
  },
});

export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = db
      .prepare("SELECT * FROM email_subscribers WHERE email = ?")
      .get(email);

    if (existing) {
      if (existing.is_subscribed) {
        return res.status(400).json({ error: "Email already subscribed" });
      } else {
        // Re-subscribe
        db.prepare(
          "UPDATE email_subscribers SET is_subscribed = 1 WHERE email = ?"
        ).run(email);
        return res.json({ message: "Successfully re-subscribed" });
      }
    }

    // Add new subscriber
    db.prepare("INSERT INTO email_subscribers (email) VALUES (?)").run(email);

    // Send welcome email
    await transporter.sendMail({
      to: email,
      subject: "Welcome to Our Newsletter!",
      html: "Thank you for subscribing to our newsletter!",
    });

    res.status(201).json({ message: "Successfully subscribed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unsubscribeEmail = (req, res) => {
  try {
    const { email } = req.body;
    const result = db
      .prepare("UPDATE email_subscribers SET is_subscribed = 0 WHERE email = ?")
      .run(email);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    res.json({ message: "Successfully unsubscribed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
