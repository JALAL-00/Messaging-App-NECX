import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../server.js';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json(db.data.users);
});

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'User name is required.' });
        }
        const existingUser = db.data.users.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (existingUser) {
            return res.status(409).json({ error: 'User with this name already exists.' });
        }
        const newUser = {
            id: uuidv4(),
            name: name.trim()
        };
        db.data.users.push(newUser);
        await db.write();
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

export default router;
