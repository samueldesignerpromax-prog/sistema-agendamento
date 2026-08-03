import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { name, email, password });
      alert('✅ Cadastro realizado! Faça login.');
      navigate('/login');
    } catch (err) {
      alert('❌ Erro: ' + (err.response?.data?.error || 'Falha na conexão'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Cadastrar</h2>
      <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
      <button type="submit" style={{ padding: 10, background: '#28a745', color: '#fff', border: 'none', borderRadius: 5, width: '100%' }}>Cadastrar</button>
    </form>
  );
}
