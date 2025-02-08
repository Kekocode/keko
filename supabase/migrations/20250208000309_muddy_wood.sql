-- Productos
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS stock_history;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  supplier_price numeric NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer productos"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Historial de Stock
CREATE TABLE stock_history (
  product_id integer REFERENCES products(id) ON DELETE CASCADE,
  date date NOT NULL,
  stock integer NOT NULL,
  PRIMARY KEY (product_id, date)
);

ALTER TABLE stock_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer historial"
  ON stock_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Vista de Ventas (Opcional, pero recomendada)
CREATE OR REPLACE VIEW product_sales AS
SELECT
    sh1.product_id,
    sh1.date,
    sh1.stock,
    COALESCE(sh1.stock - LAG(sh1.stock, 1, sh1.stock) OVER (PARTITION BY sh1.product_id ORDER BY sh1.date), 0) AS sales
FROM
    stock_history sh1
ORDER BY
    sh1.product_id,
    sh1.date;

ALTER TABLE product_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden leer product_sales" ON product_sales FOR SELECT TO authenticated USING (true);
