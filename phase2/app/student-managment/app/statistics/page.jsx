'use client';

import { useEffect, useState } from 'react';
import { getStatistics } from '@/app/actions/server-actions';

export default function StatisticsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function loadStats() {
      const data = await getStatistics();
      setStats(data);
    }
    loadStats();
  }, []);

  return (
    <div className="stats-container">
      <h1 className="stats-title">📊 System Statistics</h1>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h2 className="stat-heading">{stat.title}</h2>
            <p className="stat-value">{stat.value}</p>
            {stat.description && <p className="stat-description">{stat.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}