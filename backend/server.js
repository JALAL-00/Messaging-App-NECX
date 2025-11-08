import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, 'db/db.json');
const adapter = new JSONFile(dbFile);
const defaultData = { users: [], messages: [] };
export const db = new Low(adapter, defaultData);
await db.read();

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running on port 4000' });
});
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.post('/api/import', upload.single('backup'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded.' });
        }

        const fileContent = req.file.buffer.toString('utf8');
        const dataToImport = JSON.parse(fileContent);

        if (!dataToImport.users || !dataToImport.messages) {
            return res.status(400).json({ error: 'Invalid JSON file format. Must contain users and messages arrays.' });
        }

        db.data = dataToImport;
        await db.write();

        console.log('Database successfully overwritten by import.');
        res.status(200).json({ message: 'Data imported successfully!' });
    } catch (error) {
        console.error("Import failed:", error);
        next(error);
    }
});

app.use('*', (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
