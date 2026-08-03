import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#222', padding: '10px 20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#00ff41', fontWeight: 'bold', textDecoration: 'none' }}>
        📅 Sistema Agendamento
      </Link>
      {token ? (
        <>
          <span style={{ color: '#ccc' }}>Olá, {user.name || 'Usuário'}</span>
          {user.role === 'admin' && (
            <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
          )}
          <Link to="/cliente" style={{ color: '#fff', textDecoration: 'none' }}>Meus Agendamentos</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto', background: '#ff4444', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
            Sair
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Cadastrar</Link>
        </>
      )}
    </nav>
  );
}
