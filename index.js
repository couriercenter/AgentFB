// Basic Express server for agent waiting flag
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory database
const userFlags = {}; // Format: { user_id: true/false }

// POST /set-waiting
app.post('/set-waiting', (req, res) => {
  const { user_id, waiting } = req.body;
  if (!user_id || typeof waiting !== 'boolean') {
    return res.status(400).json({ error: 'Missing user_id or waiting (true/false)' });
  }
  userFlags[user_id] = waiting;
  res.json({ message: `Status updated for ${user_id}`, waiting });
});

// GET /check-waiting?user_id=xxx
app.get('/check-waiting', (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }
  const waiting = !!userFlags[user_id];
  res.json({ user_id, waiting });
});

// Health check
app.get('/', (req, res) => {
  res.send('Agent status API running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
