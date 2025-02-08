import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProductModalProps {
  productId: number;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ productId, onClose }) => {
  const [stockData, setStockData] = useState<{ date: string; stock: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; date: string; show: boolean }>({
    x: 0,
    y: 0,
    value: 0,
    date: '',
    show: false,
  });

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: stockHistoryData, error: stockHistoryError } = await supabase
          .from('stock_history')
          .select('date, stock')
          .eq('product_id', productId)
          .order('date', { ascending: false })
          .limit(14);

        if (stockHistoryError) throw stockHistoryError;

        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('name')
          .eq('id', productId)
          .single();

        if (productError) throw productError;
        setProductName(productData.name);

        const reversedStockData = stockHistoryData ? [...stockHistoryData].reverse() : [];
        setStockData(reversedStockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [productId]);

  const renderStockChart = () => {
    if (stockData.length === 0) {
      return null;
    }

    const maxValue = Math.max(...stockData.map((item) => item.stock));
    const minValue = Math.min(...stockData.map((item) => item.stock));
    const range = maxValue - minValue;
    const yOffset = 20; // Más espacio en la parte superior
    const chartHeight = 250; // Aumentamos la altura
    const chartWidth = 500;  // Aumentamos el ancho
    const padding = 20;

    const points = stockData
      .map((item, index) => {
        const x = (index / (stockData.length - 1)) * (chartWidth-padding*2) + padding;
        const y = range === 0
          ? yOffset + chartHeight / 2
          : yOffset + chartHeight - ((item.stock - minValue) / range) * (chartHeight-padding);
        return `${x},${y}`;
      })
      .join(' ');

      // Calcular valores para el eje Y
    const numYTicks = 5;
    const yTickValues = Array.from({ length: numYTicks }, (_, i) => {
      return Math.round(minValue + (range / (numYTicks - 1)) * i);
    });

    return (
      <div className="relative">
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
            stroke="url(#lineGradient)" // Usar el gradiente
            strokeWidth="3"
            points={points}
            strokeLinecap="round" // Extremos redondeados
            strokeLinejoin="round" // Uniones redondeadas
          />

          {/* Puntos de datos (círculos) */}
          {stockData.map((item, index) => {
            const x = (index / (stockData.length - 1)) * (chartWidth - padding * 2) + padding;
            const y = range === 0
              ? yOffset + chartHeight / 2
              : yOffset + chartHeight - ((item.stock - minValue) / range) * (chartHeight-padding);
            return (
              <circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#4F46E5"
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({ x, y, value: item.stock, date: item.date, show: true })}
                onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
              />
            );
          })}

          {/* Eje X (Fechas) */}
          {stockData.map((item, index) => {
            const x = (index / (stockData.length - 1)) * (chartWidth-padding*2) + padding;
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
        {/* Tooltip */}
        {tooltip.show && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x + 15, // Ajuste para la posición
              top: tooltip.y - 45,  // Ajuste para la posición
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '4px',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              pointerEvents: 'none', // Para que no interfiera con el hover
            }}
          >
            Stock: {tooltip.value}<br />
            Fecha: {tooltip.date}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"> {/* Modal más grande */}
          <div className="bg-white px-6 pt-8 pb-6 sm:p-10 sm:pb-8">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl leading-6 font-semibold text-gray-900" id="modal-title">
                  Historial de Stock - {productName}
                </h3>
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {!loading && !error && (
                  <div className="mt-6">
                    {renderStockChart()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
