import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5003;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'users.json');

const readUsers = () => {
	if (!fs.existsSync(DATA_FILE)) return [];
	const data = fs.readFileSync(DATA_FILE, 'utf-8');
	return JSON.parse(data || '[]');
};

const writeUsers = (users) => {
	fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

app.post('/api/info', (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(400)
			.json({ message: 'Email and password are required.' });
	}

	const users = readUsers();
	users.push({ email, password });
	writeUsers(users);

	res.status(201).json({ message: 'User data saved successfully.' });
});

app.get('/api/info', (req, res) => {
	const users = readUsers();
	res.status(200).json(users);
});

app.get('/api/info/:email', (req, res) => {
	const { email } = req.params;
	const users = readUsers();
	const user = users.find((u) => u.email === email);

	if (!user) {
		return res.status(404).json({ message: 'User not found.' });
	}

	res.status(200).json(user);
});

app.delete('/api/info', (req, res) => {
	console.log('DELETE /api/info called'); // Debugging line
	fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
	res.status(200).json({ message: 'All user data has been cleared.' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});