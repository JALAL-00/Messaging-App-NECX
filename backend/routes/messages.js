import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../server.js'; // We will export db from server.js

const router = Router();

// GET /api/messages - Get all messages
router.get('/', async (req, res) => {
  await db.read();
  // Sort messages by timestamp, oldest first, for proper display order
  const sortedMessages = db.data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  res.status(200).json(sortedMessages);
});

// POST /api/messages - Create a new message
router.post('/', async (req, res, next) => {
    try {
        const { text, senderId } = req.body;

        if (!text || !senderId) {
            return res.status(400).json({ error: 'Message text and senderId are required.' });
        }
        
        await db.read();

        const sender = db.data.users.find(u => u.id === senderId);
        if (!sender) {
            return res.status(404).json({ error: 'Sender user not found.' });
        }
        
        const newMessage = {
            id: uuidv4(),
            text: text,
            senderId: senderId,
            senderName: sender.name, // Denormalize senderName for convenience
            timestamp: new Date().toISOString()
        };

        db.data.messages.push(newMessage);
        await db.write();

        res.status(201).json(newMessage);
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});


export default router;