const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, text: 'Apprendre DevOps', done: false },
  { id: 2, text: 'Faire le mini-projet', done: false }
];

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todo = { id: Date.now(), text: req.body.text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: 'Supprimé' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;