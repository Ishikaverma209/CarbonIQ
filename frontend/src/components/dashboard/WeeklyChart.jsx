import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-hover)',
        borderRadius: '8px',
        padding: '12px 16px',
      }}>
        <p style={{ 
          fontSize: '11px', 
          color: 'var(--text-muted)', 
          marginBottom: '8px', 
          fontWeight: '500', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: index < payload.length - 1 ? '4px' : 0 
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '2px', 
              background: entry.color 
            }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {entry.name}:
            </span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {entry.value} kg
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WeeklyChart = ({ data = [] }) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('area');

  useEffect(() => {
    if (data.length > 0) {
      setChartData(data);
    } else {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const demoData = days.map((day) => ({
        day,
        carbon: Math.round((Math.random() * 8 + 2) * 10) / 10,
        saved: Math.round((Math.random() * 5 + 1) * 10) / 10,
      }));
      setChartData(demoData);
    }
  }, [data]);

  const totalCarbon = chartData.reduce((sum, d) => sum + (d.carbon || 0), 0);
  const totalSaved = chartData.reduce((sum, d) => sum + (d.saved || 0), 0);
  const avgCarbon = chartData.length > 0 ? (totalCarbon / chartData.length).toFixed(1) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px' 
      }}>
        <div>
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            color: 'var(--text-primary)',
            marginBottom: '2px',
          }}>
            Weekly Overview
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Your carbon footprint trends
          </p>
        </div>

        {/* Chart type toggle */}
        <div style={{
          display: 'flex',
          gap: '2px',
          padding: '3px',
          borderRadius: '6px',
          background: 'var(--bg-tertiary)',
        }}>
          {['area', 'bar'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              style={{
                padding: '5px 12px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: chartType === type ? 'var(--bg-secondary)' : 'transparent',
                color: chartType === type ? 'var(--text-primary)' : 'var(--text-tertiary)',
              }}
            >
              {type === 'area' ? 'Area' : 'Bar'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {[
          { label: 'Total', value: `${totalCarbon.toFixed(1)}`, unit: 'kg CO₂', color: 'var(--accent)' },
          { label: 'Saved', value: `${totalSaved.toFixed(1)}`, unit: 'kg CO₂', color: 'var(--success)' },
          { label: 'Daily Avg', value: avgCarbon, unit: 'kg CO₂', color: 'var(--info)' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--bg-tertiary)',
            }}
          >
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              fontWeight: '500', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '4px' 
            }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: '600', color: stat.color }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={false}
                dx={-8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="carbon"
                name="Emissions"
                stroke="var(--accent)"
                strokeWidth={1.5}
                fill="url(#colorCarbon)"
                dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
                activeDot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="saved"
                name="Saved"
                stroke="var(--success)"
                strokeWidth={1.5}
                fill="url(#colorSaved)"
                dot={{ r: 3, fill: 'var(--success)', strokeWidth: 0 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={false}
                dx={-8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="carbon" name="Emissions" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={24} />
              <Bar dataKey="saved" name="Saved" fill="var(--success)" radius={[3, 3, 0, 0]} maxBarSize={24} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeeklyChart;
