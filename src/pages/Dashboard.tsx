import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import TopSales from '../components/TopSales';
import ProductModal from '../components/ProductModal';
import SummaryCards from '../components/SummaryCards'; // Nuevo componente
import SalesChart from '../components/SalesChart'; // Nuevo componente

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topSales, setTopSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [summaryData, setSummaryData] = useState<{ totalSales: number; totalProducts: number; bestSellingProduct: string; totalStock: number; }>({ totalSales: 0, totalProducts: 0, bestSellingProduct: '', totalStock: 0 });
  const [salesChartData, setSalesChartData] = useState<{ date: string; sales: number }[]>([]);

  useEffect(() => {
    fetchTopSales();
    fetchSummaryData();
    fetchSalesChartData();
  }, []);

  const fetchTopSales = async () => {
      setLoading(true);
      setError(null);
      try {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];

          const { data, error } = await supabase
              .from('product_sales')
              .select('product_id, stock_difference, product_name, supplier_price, date')
              .gte('date', sevenDaysAgoString)
              .order('stock_difference', { ascending: true });

          if (error) throw error;

          const filteredData = data
              ? data.filter(item => item.stock_difference >= -700)
              : [];

          const salesByProduct: { [key: number]: { product_name: string; supplier_price: number; totalSales: number; } } = {};
          filteredData.forEach(item => {
              if (!salesByProduct[item.product_id]) {
                  salesByProduct[item.product_id] = {
                      product_name: item.product_name,
                      supplier_price: item.supplier_price,
                      totalSales: 0,
                  };
              }
              if (item.stock_difference < 0) {
                  salesByProduct[item.product_id].totalSales += Math.abs(item.stock_difference);
              }
          });

          const sortedSales = Object.entries(salesByProduct)
              .map(([productId, data]) => ({
                  product_id: Number(productId),
                  product_name: data.product_name,
                  supplier_price: data.supplier_price,
                  sales: data.totalSales,
              }))
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 50);

          setTopSales(sortedSales);

      } catch (err) {
          setError(err instanceof Error ? err.message : 'Error fetching top sales');
      } finally {
          setLoading(false);
      }
  };
    
    const fetchSummaryData = async () => {
      try {
          // Ventas totales (últimos 7 días)
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];

          const { data: salesData, error: salesError } = await supabase
              .from('product_sales')
              .select('sales')
              .gte('date', sevenDaysAgoString);
          if (salesError) throw salesError;
          const totalSales = salesData ? salesData.reduce((acc, item) => acc + item.sales, 0) : 0;

          // Número total de productos
          const { data: productsData, error: productsError, count } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
          if (productsError) throw productsError;
          const totalProducts = count ?? 0;

          // Producto más vendido (últimos 7 días) -  obtenerlo desde fetchTopSales
          const bestSellingProduct = topSales.length > 0 ? topSales[0].product_name : '';

          //Stock total
          const { data: stockData, error: stockError } = await supabase.rpc('get_total_stock');
          if(stockError) throw stockError;
          const totalStock = stockData ?? 0;

          setSummaryData({ totalSales, totalProducts, bestSellingProduct, totalStock });

      } catch (error) {
          console.error("Error al cargar los datos de resumen:", error);
      }
  };

    const fetchSalesChartData = async () => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('product_sales')
                .select('date, sales')
                .gte('date', sevenDaysAgoString)
                .order('date', { ascending: true });

            if (error) throw error;

            // Agrupar por fecha y sumar las ventas
            const salesByDate: { [key: string]: number } = {};
            data.forEach(item => {
                if (!salesByDate[item.date]) {
                    salesByDate[item.date] = 0;
                }
                salesByDate[item.date] += item.sales;
            });

            // Convertir a un array de objetos
            const chartData = Object.entries(salesByDate).map(([date, sales]) => ({
                date,
                sales,
            }));

            setSalesChartData(chartData);
        } catch (error) {
            console.error("Error al cargar los datos del gráfico de ventas:", error);
        }
    };

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard de Ventas</h1>
            <p className="mt-2 text-lg text-gray-600">Análisis de ventas de los últimos 7 días.</p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}

              <SummaryCards data={summaryData} />
              <SalesChart data={salesChartData} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Top 50 Ventas</h2>
                  <TopSales topSales={topSales} onProductClick={handleProductClick} />
                </div>
                <div>
                  {/* Aquí irá el gráfico del producto seleccionado (modal) */}
                  {isModalOpen && selectedProductId && (
                    <ProductModal productId={selectedProductId} onClose={closeModal} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
