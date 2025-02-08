import React from 'react';
import type { StockHistory } from '../types';

interface StockHistoryProps {
  stockHistory: StockHistory[];
  productName: string;
}

const StockHistoryComponent: React.FC<StockHistoryProps> = ({ stockHistory, productName }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Historial de Stock - {productName}</h2>
      {stockHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockHistory.map((item) => (
                <tr key={item.date}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.stock}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay historial de stock para este producto.</p>
      )}
    </div>
  );
};

export default StockHistoryComponent;
