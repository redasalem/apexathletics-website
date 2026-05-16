'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SalesChartProps {
  data: { date: string, revenue: number }[];
  title?: string;
}

export default function SalesChart({ data, title = 'Sales Trend (Last 7 Days)' }: SalesChartProps) {
  return (
    <div className="bg-surface border border-border p-6 rounded-2xl h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest text-sm">{title}</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d80000" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#d80000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#737373', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#737373', fontSize: 10, fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#171717', 
                border: '1px solid #333333', 
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#d80000' }}
              cursor={{ stroke: '#d8000030', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#d80000" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
