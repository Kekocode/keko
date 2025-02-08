-- Agrega función para obtener el stock total de todos los productos
CREATE OR REPLACE FUNCTION get_total_stock()
RETURNS INTEGER AS $$
DECLARE
    total_stock INTEGER;
BEGIN
    SELECT COALESCE(SUM(stock), 0) INTO total_stock
    FROM stock_history
    WHERE (product_id, date) IN (
        SELECT product_id, MAX(date)
        FROM stock_history
        GROUP BY product_id
    );

    RETURN total_stock;
END;
$$ LANGUAGE plpgsql;
