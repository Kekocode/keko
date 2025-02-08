-- Función para calcular la diferencia de stock e insertar/actualizar en stock_history
CREATE OR REPLACE FUNCTION calculate_and_insert_stock_history(
  p_product_id INTEGER,
  p_date DATE,
  p_stock INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_previous_stock INTEGER;
BEGIN
  -- Obtener el stock del día anterior
  SELECT stock INTO v_previous_stock
  FROM stock_history
  WHERE product_id = p_product_id
  AND date = p_date - INTERVAL '1 day'
  LIMIT 1;

  -- Insertar o actualizar el registro de stock_history.
  INSERT INTO stock_history (product_id, date, stock)
  VALUES (p_product_id, p_date, p_stock)
  ON CONFLICT (product_id, date)
  DO UPDATE SET stock = EXCLUDED.stock;

END;
$$ LANGUAGE plpgsql;

-- Vista product_sales (modificada)
DROP VIEW IF EXISTS product_sales;

CREATE OR REPLACE VIEW product_sales AS
SELECT
    sh1.product_id,
    sh1.date,
    sh1.stock,
    products.name AS product_name,
    products.supplier_price,
    COALESCE(sh1.stock - LAG(sh1.stock, 1) OVER (PARTITION BY sh1.product_id ORDER BY sh1.date), 0) AS stock_difference
FROM
    stock_history sh1
JOIN products ON sh1.product_id = products.id
ORDER BY
    sh1.product_id,
    sh1.date;
