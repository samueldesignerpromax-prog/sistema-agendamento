import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', description: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const appRes = await api.get('/api/admin/appointments');
      setAppointments(appRes.data);
      const servRes = await api.get('/api/services');
      setServices(servRes.data);
    } catch (err) {
      alert('Erro ao carregar dados admin');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/appointments/${id}/status`, { status: newStatus });
      loadData();
      alert('✅ Status atualizado!');
    } catch (err) {
      alert('❌ Erro ao atualizar status');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/services', {
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
      });
      setNewService({ name: '', price: '', duration: '', description: '' });
      loadData();
      alert('✅ Serviço criado!');
    } catch (err) {
      alert('❌ Erro ao criar serviço');
    }
  };

  return (
    <div>
      <h2>👑 Painel Administrativo</h2>
      <p>Bem-vindo, {user.name}</p>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: 8 }}>
        <h3>➕ Criar Novo Serviço</h3>
        <form onSubmit={handleAddService}>
          <input placeholder="Nome" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required />
          <input placeholder="Preço (R$)" type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
          <input placeholder="Duração (min)" type="number" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} required />
          <input placeholder="Descrição" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} />
          <button type="submit" style={{ padding: '8px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 5, marginTop: 5 }}>Adicionar</button>
        </form>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>📋 Todos os Agendamentos</h3>
        {appointments.length === 0 && <p>Nenhum agendamento.</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: '#fff' }}>
              <th style={{ padding: 8 }}>Cliente</th>
              <th style={{ padding: 8 }}>Data/Hora</th>
              <th style={{ padding: 8 }}>Serviços</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{a.client?.name || a.client}</td>
                <td>{a.date} {a.time}</td>
                <td>{a.services?.map(s => s.name).join(', ') || 'N/A'}</td>
                <td>{a.status}</td>
                <td>
                  <select onChange={e => handleStatusChange(a._id, e.target.value)} defaultValue={a.status}>
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmar</option>
                    <option value="completed">Finalizar</option>
                    <option value="canceled">Cancelar</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>📦 Serviços Cadastrados</h3>
      <ul>
        {services.map(s => <li key={s._id}>{s.name} - R${s.price} - {s.duration}min</li>)}
      </ul>
    </div>
  );
}
