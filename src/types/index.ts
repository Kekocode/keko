export interface Product {
  id: number;
  name: string;
  supplier_price: number;
}

export interface StockHistory {
  product_id: number;
  date: string;
  stock: number;
}
//ya no es necesario, ahora esta la vista
// export interface TopSalesItem {
//   product_id: number;
//   date: string;
//   sales: number;
//   product_name: string
// }

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  subscriptionStatus: 'active' | 'inactive';
}
