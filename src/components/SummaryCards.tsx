import React from 'react';
import { ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';

interface SummaryCardsProps {
  data: {
    totalSales: number;
    totalProducts: number;
    bestSellingProduct: string;
    totalStock: number;
  };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <ShoppingCart className="h-10 w-10 text-indigo-600 mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ventas Totales</h3>
          <p className="text-2xl font-bold text-gray-700">{data.totalSales.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <Package className="h-10 w-10 text-green-600 mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Productos Totales</h3>
          <p className="text-2xl font-bold text-gray-700">{data.totalProducts}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <TrendingUp className="h-10 w-10 text-red-600 mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Producto Más Vendido</h3>
          <p className="text-sm text-gray-700">{data.bestSellingProduct || 'N/A'}</p>
        </div>
      </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <Users className="h-10 w-10 text-blue-600 mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Stock Total</h3>
          <p className="text-sm text-gray-700">{data.totalStock}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
