import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ClienteDashboard() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Carregar serviços e agendamentos do cliente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await api.get('/api/services');
        setServices(servicesRes.data);

        const myAppointments = await api.get('/api/appointments/my');
        setAppointments(myAppointments.data);
      } catch (err) {
        alert('Erro ao carregar dados');
      }
    };
    fetchData();
  }, []);

  // Buscar horários disponíveis quando a data mudar
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (!date) return;
    try {
      const res = await api.get(`/api/appointments/available?date=${date}`);
      setAvailableTimes(res.data.available);
    } catch (err) {
      alert('Erro ao buscar horários');
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedServiceId) {
      return alert('Preencha data, horário e serviço.');
    }
    try {
      await api.post('/api/appointments', {
        date: selectedDate,
        time: selectedTime,
        services: [selectedServiceId],
      });
      alert('✅ Agendamento realizado! Aguarde confirmação.');
      // Recarregar agendamentos
      const myAppointments = await api.get('/api/appointments/my');
      setAppointments(myAppointments.data);
      setSelectedTime('');
      setAvailableTimes([]);
    } catch (err) {
      alert('❌ Erro: ' + (err.response?.data?.message || 'Falha no agendamento'));
    }
  };

  return (
    <div>
      <h2>Olá, {user.name} (Cliente)</h2>

      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>📅 Fazer Agendamento</h3>
        <div>
          <label>Data: <input type="date" value={selectedDate} onChange={handleDateChange} /></label>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Serviço:
            <select value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
              <option value="">Selecione</option>
              {services.map(s => <option key={s._id} value={s._id}>{s.name} - R${s.price}</option>)}
            </select>
          </label>
        </div>
        {availableTimes.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <label>Horário:
              <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                <option value="">Selecione</option>
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
        )}
        {availableTimes.length === 0 && selectedDate && <p>Não há horários disponíveis nessa data.</p>}
        <button onClick={handleBooking} style={{ marginTop: 10, padding: '8px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 5 }}>Agendar</button>
      </div>

      <h3>📋 Meus Agendamentos</h3>
      {appointments.length === 0 && <p>Nenhum agendamento encontrado.</p>}
      <ul>
        {appointments.map(a => (
          <li key={a._id} style={{ padding: 8, borderBottom: '1px solid #ddd' }}>
            <strong>{a.date} às {a.time}</strong> - 
            {a.services.map(s => s.name).join(', ')} 
            <span style={{ marginLeft: 10, background: a.status === 'confirmed' ? '#28a745' : '#ffc107', padding: '2px 8px', borderRadius: 20, fontSize: '0.8rem', color: '#000' }}>
              {a.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
