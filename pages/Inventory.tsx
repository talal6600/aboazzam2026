import React, { useState } from 'react';
import { SIM_COLORS, SIM_LABELS } from '../constants';
import { useData } from '../context/DataContext';
import { SimType, StockLog } from '../types';

export const Inventory: React.FC = () => {
  const { stock, damaged, stockLogs, updateStock } = useData();
  const [type, setType] = useState<SimType>('jawwy');
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<StockLog['action']>('add');

  const submit = () => {
    if (quantity <= 0) return;
    updateStock(type, quantity, action);
    setQuantity(1);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '16px',
      }}>
        <h3 style={{ marginTop: 0 }}>إدارة المخزون</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>نوع الشريحة</span>
            <select value={type} onChange={(e) => setType(e.target.value as SimType)} style={{ padding: '10px', borderRadius: '10px' }}>
              <option value="jawwy">{SIM_LABELS.jawwy}</option>
              <option value="sawa">{SIM_LABELS.sawa}</option>
              <option value="multi">{SIM_LABELS.multi}</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>الكمية</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              style={{ padding: '10px', borderRadius: '10px' }}
            />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '8px', marginBottom: '12px' }}>
          {[
            { key: 'add', label: 'إضافة' },
            { key: 'return_company', label: 'إرجاع' },
            { key: 'to_damaged', label: 'تالف' },
            { key: 'recover', label: 'استرجاع التالف' },
            { key: 'flush', label: 'إتلاف نهائي' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setAction(btn.key as StockLog['action'])}
              style={{
                padding: '10px',
                borderRadius: '12px',
                border: action === btn.key ? '2px solid #0ea5e9' : '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#e2e8f0',
                cursor: 'pointer',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button onClick={submit} style={{ padding: '12px', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', width: '100%', fontWeight: 700 }}>
          حفظ الحركة
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginTop: '16px' }}>
          {(['jawwy', 'sawa', 'multi'] as const).map((sim) => (
            <div key={sim} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>{SIM_LABELS[sim]}</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{stock[sim]} متاح</div>
              <div style={{ fontSize: '12px', color: '#f97316' }}>{damaged[sim]} تالف</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '16px',
        maxHeight: '520px',
        overflowY: 'auto',
      }}>
        <h3 style={{ marginTop: 0 }}>سجل المخزون</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stockLogs.length === 0 && <span style={{ color: '#94a3b8' }}>لا توجد سجلات</span>}
          {stockLogs.map((log) => (
            <div key={log.id} style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              borderLeft: `4px solid ${SIM_COLORS[log.type]}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{SIM_LABELS[log.type]}</strong>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(log.date).toLocaleString('ar-SA')}</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                {log.quantity} شريحة | نوع الإجراء: {log.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
