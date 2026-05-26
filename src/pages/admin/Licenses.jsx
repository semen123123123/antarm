import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export default function AdminLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadLicenses(); }, [filter]);

  const loadLicenses = () => {
    setLoading(true);
    const params = filter === 'all' ? '' : `?verified=${filter === 'verified' ? 'true' : 'false'}`;
    api.get(`/admin/licenses${params}`).then(setLicenses).finally(() => setLoading(false));
  };

  const handleVerify = async (id, verified) => {
    try {
      await api.put(`/admin/licenses/${id}/verify`, { verified, expiryDate: '2027-01-01' });
      loadLicenses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Лицензии (ФЗ-150)</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'verified', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', fontSize: 12, borderRadius: '8px',
                background: filter === f ? '#4a9eff' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filter === f ? '#4a9eff' : 'rgba(255,255,255,0.1)'}`,
                color: filter === f ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'Все' : f === 'verified' ? 'Верифицированные' : 'Ожидают'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Загрузка...</p>
      ) : licenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
          <p>Нет лицензий для отображения</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Клиент</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Номер лицензии</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Тип</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Дата выдачи</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Статус</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(lic => (
                <tr key={lic.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>#{lic.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {lic.user_name}
                    <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{lic.user_email}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontFamily: 'monospace' }}>{lic.license_number}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{lic.license_type || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{lic.issue_date || '—'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {lic.verified ? (
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: 12, background: 'rgba(40,167,69,0.15)', color: '#28a745' }}>Верифицирована</span>
                    ) : (
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: 12, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Ожидает</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {!lic.verified ? (
                      <button onClick={() => handleVerify(lic.id, true)} style={{ padding: '4px 12px', fontSize: 12, background: 'rgba(40,167,69,0.2)', borderRadius: '6px', color: '#28a745', cursor: 'pointer' }}>
                        Верифицировать
                      </button>
                    ) : (
                      <button onClick={() => handleVerify(lic.id, false)} style={{ padding: '4px 12px', fontSize: 12, background: 'rgba(245,158,11,0.2)', borderRadius: '6px', color: '#f59e0b', cursor: 'pointer' }}>
                        Отозвать
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
