import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express';

import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import clerkWebhook from "./routes/clerkWebhook.js";

dotenv.config();

const app = express();

// 1. Clerk Middleware (Adds auth data to the req object)
app.use(clerkMiddleware());

// 2. Body Parser
app.use(express.json());

// 3. Hardened CORS Configuration
// Required for authentication headers to pass between different Render domains
app.use(
  cors({
    origin: "https://remote-interview-platform-1-xh21.onrender.com", // Your specific frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 4. API Routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/webhooks", clerkWebhook); // Handles Clerk user sync logic
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// 5. Basic Health & Root Routes
app.get("/", (req, res) => {
  res.send("InterCode Backend API is Live! 🚀");
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "API is up and running",
    timestamp: new Date().toISOString()
  });
});

// 6. Database Connection & Server Start
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error.message);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();