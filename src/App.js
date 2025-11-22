// src/App.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('posts')
        .select('id, list_item')
        .order('id', { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load your to-dos.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      setAdding(true);
      setError('');
      const text = newItem.trim();

      const { error } = await supabase
        .from('posts')
        .insert([{ list_item: text }]);

      if (error) throw error;

      setNewItem('');
      await fetchTodos();
    } catch (err) {
      console.error(err);
      setError('Could not add that to-do.');
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app-root">
      <div className="gradient-bg" />

      <main className="card">
        <header className="card-header">
          <h1 className="title">My Supabase To-Do</h1>
          <p className="subtitle">
            Powered by your <span>posts</span> table ✨
          </p>
        </header>

        <form className="input-row" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type="submit" disabled={adding}>
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>

        <div className="toolbar">
          <button onClick={fetchTodos} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh list'}
          </button>
          <span className="count">
            {todos.length === 0
              ? 'No items yet'
              : `${todos.length} item${todos.length > 1 ? 's' : ''}`}
          </span>
        </div>

        {error && <div className="error">{error}</div>}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="bullet" />
              <span className="text">{todo.list_item}</span>
            </li>
          ))}

          {!loading && todos.length === 0 && !error && (
            <li className="empty-state">
              Start by adding your first to-do above 👆
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
