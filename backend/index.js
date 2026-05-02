const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const PORT = 5000;

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const todosGauge = new client.Gauge({
  name: 'todos_total',
  help: 'Nombre total de todos',
  registers: [register]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requetes HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

app.use(cors());
app.use(express.json());

// Middleware pour compter les requetes
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
  });
  next();
});

let todos = [
  { id: 1, text: 'Apprendre DevOps', done: false },
  { id: 2, text: 'Faire le mini-projet', done: false }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Metrics endpoint pour Prometheus
app.get('/metrics', async (req, res) => {
  todosGauge.set(todos.length);
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
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