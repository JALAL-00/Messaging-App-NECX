import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Import our new route handlers
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';


// --- Database Setup ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'db/db.json');

const adapter = new JSONFile(file);
const defaultData = { users: [], messages: [] };
export const db = new Low(adapter, defaultData);
// Read data from DB to start with
await db.read();

// --- App & Middleware Setup ---
const app = express();
const PORT = 4000; // Updated Port as per requirements

app.use(cors());
app.use(express.json());


// --- API Routes ---
// Health check endpoint remains the same
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running on port 4000' });
});

// Use the routers for specific endpoints
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);


// --- Error Handling ---
// 404 Not Found Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});