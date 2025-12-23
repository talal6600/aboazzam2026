import React from 'react';
import { SIM_LABELS } from '../constants';
import { useData } from '../context/DataContext';

export const Reports: React.FC = () => {
  const { transactions, removeTransaction } = useData();

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>التقارير التفصيلية</h3>
        <span style={{ color: '#94a3b8' }}>{transactions.length} عملية</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>التاريخ</th>
              <th style={{ padding: '10px' }}>النوع</th>
              <th style={{ padding: '10px' }}>الكمية</th>
              <th style={{ padding: '10px' }}>المبلغ (ر.س)</th>
              <th style={{ padding: '10px' }}>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '12px', color: '#94a3b8' }}>لا توجد بيانات</td>
              </tr>
            )}
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '10px' }}>{new Date(t.date).toLocaleString('ar-SA')}</td>
                <td style={{ padding: '10px' }}>{SIM_LABELS[t.type]}</td>
                <td style={{ padding: '10px' }}>{t.quantity}</td>
                <td style={{ padding: '10px' }}>{t.amount.toFixed(2)}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => removeTransaction(t.id)}
                    style={{ border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer' }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
