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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>InterCode API | System Status</title>
        <style>
            :root {
                --primary: #10b981;
                --bg: #0f172a;
                --surface: #1e293b;
                --text: #f8fafc;
            }
            body {
                background-color: var(--bg);
                color: var(--text);
                font-family: 'Fira Code', 'Courier New', monospace;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                overflow: hidden;
            }
            .terminal {
                background: var(--surface);
                padding: 2.5rem;
                border-radius: 1rem;
                border: 1px solid #334155;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.1);
                max-width: 500px;
                width: 90%;
                position: relative;
            }
            .header-dots {
                display: flex;
                gap: 8px;
                position: absolute;
                top: 15px;
                left: 15px;
            }
            .dot-red { background: #ef4444; width: 12px; height: 12px; border-radius: 50%; }
            .dot-yellow { background: #f59e0b; width: 12px; height: 12px; border-radius: 50%; }
            .dot-green { background: #10b981; width: 12px; height: 12px; border-radius: 50%; }

            h1 {
                font-size: 1.8rem;
                margin: 0 0 1rem 0;
                color: var(--primary);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .status-line {
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .pulse {
                width: 10px;
                height: 10px;
                background: var(--primary);
                border-radius: 50%;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                animation: pulse-green 2s infinite;
            }
            .stats {
                color: #94a3b8;
                font-size: 0.9rem;
                line-height: 1.6;
                border-top: 1px solid #334155;
                padding-top: 1.5rem;
            }
            .footer-btn {
                margin-top: 2rem;
                display: inline-block;
                padding: 10px 20px;
                background: #10b9811a;
                border: 1px solid var(--primary);
                color: var(--primary);
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .footer-btn:hover {
                background: var(--primary);
                color: var(--bg);
            }

            @keyframes pulse-green {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
        </style>
    </head>
    <body>
        <div class="terminal">
            <div class="header-dots">
                <div class="dot-red"></div>
                <div class="dot-yellow"></div>
                <div class="dot-green"></div>
            </div>
            <h1>InterCode Backend</h1>
            <div class="status-line">
                <div class="pulse"></div>
                <span>SYSTEM ONLINE</span>
            </div>
            <div class="stats">
                > Initializing Database... Connected<br>
                > Port: ${process.env.PORT || 8080}<br>
                > Origin: Authorized ✅<br>
                > Status: 200 OK
            </div>
            <a href="https://remote-interview-platform-1-xh21.onrender.com" class="footer-btn">Launch Frontend</a>
        </div>
    </body>
    </html>
  `);
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