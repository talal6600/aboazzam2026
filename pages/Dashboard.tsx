import React from 'react';
import { SIM_LABELS } from '../constants';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { transactions, fuelLogs, stock, settings } = useData();

  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
  const fuelSpend = fuelLogs.reduce((sum, f) => sum + f.amount, 0);
  const progress = settings.weeklyTarget
    ? Math.min(100, Math.round((totalSales / settings.weeklyTarget) * 100))
    : 0;

  const latestTransactions = transactions.slice(0, 5);
  const latestFuel = fuelLogs.slice(0, 5);

  return (
    <div className="page-stack">
      <div className="stat-grid">
        <div className="card stat-card">
          <span className="label">إجمالي المبيعات</span>
          <span className="value">{totalSales.toFixed(2)} ر.س</span>
          <span className="pill">اليوم بالكامل</span>
        </div>
        <div className="card stat-card">
          <span className="label">عدد الشرائح المباعة</span>
          <span className="value">{totalQuantity}</span>
          <span className="pill">كل الأصناف</span>
        </div>
        <div className="card stat-card">
          <span className="label">مصروف الوقود</span>
          <span className="value">{fuelSpend.toFixed(2)} ر.س</span>
          <span className="pill">رحلات العمل</span>
        </div>
        <div className="card stat-card">
          <span className="label">تحقيق الهدف الأسبوعي</span>
          <div className="progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="value" style={{ fontSize: 16 }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="split-grid">
        <div className="card-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>آخر العمليات</h3>
            <span className="meta">{transactions.length} عملية</span>
          </div>
          <div className="list-stack">
            {latestTransactions.length === 0 && <span className="meta">لا توجد بيانات بعد</span>}
            {latestTransactions.map((t) => (
              <div key={t.id} className="list-card" style={{ background: 'rgba(14,165,233,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{SIM_LABELS[t.type]}</strong>
                  <span>{new Date(t.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="meta" style={{ marginTop: 4 }}>
                  الكمية: {t.quantity} | المبلغ: {t.amount.toFixed(2)} ر.س
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>حالة المخزون</h3>
            <span className="meta">جاهز للتسليم</span>
          </div>
          <div className="items-grid">
            {(['jawwy', 'sawa', 'multi'] as const).map((type) => (
              <div key={type} className="list-card">
                <div className="meta">{SIM_LABELS[type]}</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{stock[type]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>آخر سجلات الوقود</h3>
            <span className="meta">{fuelLogs.length} سجل</span>
          </div>
          <div className="list-stack">
            {latestFuel.length === 0 && <span className="meta">لا توجد سجلات</span>}
            {latestFuel.map((log) => (
              <div key={log.id} className="list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>وقود {log.fuelType}</strong>
                  <span>{new Date(log.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="meta" style={{ marginTop: 4 }}>
                  {log.liters} لتر | {log.amount.toFixed(2)} ر.س | {log.km} كم
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
