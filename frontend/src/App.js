import { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://devops-todo-app-q1ek.onrender.com/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then(r => r.json())
      .then(setTodos)
      .catch(err => console.log(err));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setText('');
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', fontFamily: 'Arial' }}>
      <h1>📝 Todo List - DevOps Project</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nouvelle tâche..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Ajouter
        </button>
      </div>
      <ul style={{ marginTop: 20, listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 10,
            marginBottom: 8,
            background: '#f5f5f5',
            borderRadius: 5
          }}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;