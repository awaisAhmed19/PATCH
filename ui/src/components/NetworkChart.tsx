
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const NetworkChart = () => {
  const data = [
    { subject: 'Web Servers', A: 120, fullMark: 150 },
    { subject: 'Database', A: 98, fullMark: 150 },
    { subject: 'Network Devices', A: 86, fullMark: 150 },
    { subject: 'Endpoints', A: 99, fullMark: 150 },
    { subject: 'Cloud Services', A: 85, fullMark: 150 }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        🔗 Network Security Coverage
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              tick={{ fontSize: 11, fill: '#666' }}
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 10, fill: '#666' }}
              tickCount={4}
            />
            <Radar
              name="Coverage"
              dataKey="A"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkChart;
