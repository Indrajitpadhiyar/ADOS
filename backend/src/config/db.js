import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * MongoDB Enterprise-Grade Connection Manager
 * Features:
 * - Connection pooling (minPoolSize, maxPoolSize)
 * - Auto-reconnect handling
 * - Event-driven telemetry
 * - Graceful teardown
 */
class DatabaseConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log("ℹ️ MongoDB is already connected.");
      return;
    }

    const mongooseOptions = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      autoIndex: env.NODE_ENV !== "production", // Don't auto-build indexes in high-scale prod
    };

    // Attach event listeners prior to opening connection
    mongoose.connection.on("connected", () => {
      this.isConnected = true;
      console.log(`✅ MongoDB Connected successfully [Host: ${mongoose.connection.host}, DB: ${mongoose.connection.name}]`);
    });

    mongoose.connection.on("error", (err) => {
      this.isConnected = false;
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      this.isConnected = false;
      console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
    });

    try {
      await mongoose.connect(env.MONGO_URL, mongooseOptions);
    } catch (error) {
      console.error("❌ Initial MongoDB Connection Failed:", error.message);
      // In enterprise applications, fail-fast if DB cannot be reached at boot
      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) return;
    try {
      await mongoose.connection.close(false);
      this.isConnected = false;
      console.log("🛑 MongoDB connection cleanly closed.");
    } catch (error) {
      console.error("❌ Error during MongoDB disconnection:", error.message);
    }
  }
}

export const dbConnection = new DatabaseConnection();
