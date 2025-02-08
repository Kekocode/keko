import React from 'react';

interface SalesChartProps {
  data: { date: string; sales: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No hay datos para mostrar el grafico</p>;
    }
  const maxValue = Math.max(...data.map((item) => item.sales));
  const minValue = Math.min(...data.map((item) => item.sales));
  const range = maxValue - minValue;
  const yOffset = 20;
  const chartHeight = 200;
  const chartWidth = 500;
    const padding = 20;

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
      const y = range === 0
        ? yOffset + chartHeight / 2
        : yOffset + chartHeight - ((item.sales - minValue) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

    // Calcular valores para el eje Y
    const numYTicks = 5;
    const yTickValues = Array.from({ length: numYTicks }, (_, i) => {
      return Math.round(minValue + (range / (numYTicks - 1)) * i);
    });

  return (
    <div className='mt-5'>
        <h2 className="text-xl font-semibold mb-4">Ventas Diarias (Últimos 7 Días)</h2>
        <svg width={chartWidth} height={chartHeight + 50} viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}>
        {/* Fondo */}
        <rect width={chartWidth} height={chartHeight} fill="#F7FAFC" rx="5" />

        {/* Eje Y */}
        {yTickValues.map((value, index) => {
            const y = yOffset + chartHeight - ((value - minValue) / range) * (chartHeight-padding);
            return (
            <React.Fragment key={`y-tick-${index}`}>
                <line x1={padding} y1={y} x2={chartWidth-padding} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2" />
                <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#4A5568">{value}</text>
            </React.Fragment>
            )
        })}
        {/* Definición del gradiente */}
        <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
        </defs>

        {/* Línea del gráfico */}
        <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Eje X (Fechas) */}
        {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
            return (
            <React.Fragment key={`label-${index}`}>
                <text x={x} y={chartHeight + 30} textAnchor="middle" fontSize="12" fill="#4A5568">
                {item.date.slice(5, 10)}
                </text>
                <line x1={x} y1={chartHeight + 15} x2={x} y2={chartHeight + 20} stroke="gray" strokeWidth="1" />
            </React.Fragment>
            );
        })}
        </svg>
    </div>
  );
};

export default SalesChart;
