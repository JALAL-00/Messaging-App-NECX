import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../server.js';

const router = Router();

router.get('/', (req, res) => {
    const sortedMessages = [...db.data.messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.status(200).json(sortedMessages);
});

router.post('/', async (req, res, next) => {
    try {
        const { text, senderId } = req.body;
        if (!text || !senderId) {
            return res.status(400).json({ error: 'Message text and senderId are required.' });
        }
        const sender = db.data.users.find(u => u.id === senderId);
        if (!sender) {
            return res.status(404).json({ error: 'Sender user not found.' });
        }
        const newMessage = {
            id: uuidv4(),
            text,
            senderId,
            senderName: sender.name,
            timestamp: new Date().toISOString()
        };
        db.data.messages.push(newMessage);
        await db.write();
        res.status(201).json(newMessage);
    } catch (error) {
        next(error); 
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const initialLength = db.data.messages.length;
        db.data.messages = db.data.messages.filter(msg => msg.id !== id);
        if (db.data.messages.length === initialLength) {
             return res.status(404).json({ error: `Message with id ${id} not found.` });
        }
        await db.write();
        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message text cannot be empty.' });
        }
        const messageToUpdate = db.data.messages.find(msg => msg.id === id);
        if (!messageToUpdate) {
            return res.status(404).json({ error: 'Message not found.' });
        }
        messageToUpdate.text = text.trim();
        messageToUpdate.edited = true;
        messageToUpdate.editedAt = new Date().toISOString();
        await db.write();
        res.status(200).json(messageToUpdate);
    } catch (error) {
        next(error);
    }
});

export default router;
