import React, { useState } from 'react';
import { FUEL_LABELS } from '../constants';
import { useData } from '../context/DataContext';
import { FuelLog } from '../types';

export const Fuel: React.FC = () => {
  const { fuelLogs, addFuelLog, removeFuelLog } = useData();
  const [form, setForm] = useState<Omit<FuelLog, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    fuelType: '91',
    amount: 0,
    liters: 0,
    km: 0,
  });

  const submit = () => {
    if (form.liters <= 0 || form.amount <= 0) return;
    addFuelLog({ ...form, date: new Date(form.date).toISOString() });
    setForm((prev) => ({ ...prev, amount: 0, liters: 0, km: 0 }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '16px',
      }}>
        <h3 style={{ marginTop: 0 }}>تسجيل وقود جديد</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>التاريخ</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{ padding: '10px', borderRadius: '10px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>نوع الوقود</span>
            <select
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelLog['fuelType'] })}
              style={{ padding: '10px', borderRadius: '10px' }}
            >
              <option value="91">{FUEL_LABELS['91']}</option>
              <option value="95">{FUEL_LABELS['95']}</option>
              <option value="diesel">{FUEL_LABELS.diesel}</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>المبلغ (ر.س)</span>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              min={0}
              style={{ padding: '10px', borderRadius: '10px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>اللترات</span>
            <input
              type="number"
              value={form.liters}
              onChange={(e) => setForm({ ...form, liters: Number(e.target.value) })}
              min={0}
              style={{ padding: '10px', borderRadius: '10px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>قراءة العداد (كم)</span>
            <input
              type="number"
              value={form.km}
              onChange={(e) => setForm({ ...form, km: Number(e.target.value) })}
              min={0}
              style={{ padding: '10px', borderRadius: '10px' }}
            />
          </label>
        </div>
        <button onClick={submit} style={{ marginTop: '12px', padding: '12px', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', width: '100%', fontWeight: 700 }}>
          إضافة السجل
        </button>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '16px',
        maxHeight: '520px',
        overflowY: 'auto',
      }}>
        <h3 style={{ marginTop: 0 }}>السجلات السابقة</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {fuelLogs.length === 0 && <span style={{ color: '#94a3b8' }}>لا توجد سجلات</span>}
          {fuelLogs.map((log) => (
            <div key={log.id} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{FUEL_LABELS[log.fuelType]}</strong>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(log.date).toLocaleString('ar-SA')}</div>
                </div>
                <button
                  onClick={() => removeFuelLog(log.id)}
                  style={{ border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer' }}
                >
                  حذف
                </button>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                {log.liters} لتر | {log.amount.toFixed(2)} ر.س | {log.km} كم
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
