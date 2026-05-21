const express = require('express');
const pool = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// PLACE ORDER (Customer)
router.post('/', verifyToken, async (req, res) => {
  const { items, delivery_address } = req.body;
  const customer_id = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let total = 0;
    const itemsWithPrices = [];
    
    for (const item of items) {
      const [menuItem] = await connection.query(
        'SELECT price FROM menu_items WHERE id = ?',
        [item.menu_item_id]
      );
      if (menuItem.length === 0) {
        throw new Error(`Menu item ${item.menu_item_id} not found`);
      }
      const price = Number(menuItem[0].price);
      total += price * item.quantity;
      itemsWithPrices.push({ ...item, price });
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, total, delivery_address) VALUES (?, ?, ?)',
      [customer_id, total, delivery_address || null]
    );

    const order_id = orderResult.insertId;

    for (const item of itemsWithPrices) {
      await connection.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.menu_item_id, item.quantity, item.price]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully!',
      order_id,
      total
    });
  } catch (error) {
    await connection.rollback();
    console.error('Order error:', error);
    res.status(500).json({ message: error.message || 'Failed to place order' });
  } finally {
    connection.release();
  }
});

// CUSTOMER ORDERS
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, mi.name 
         FROM order_items oi 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items.map(i => ({
        ...i,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 0
      }));
      order.total = Number(order.total) || 0;
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ALL ORDERS (Admin)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const { date } = req.query;
    let query = `
      SELECT o.*, c.fullname, c.email, c.phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
    `;
    const params = [];

    if (date) {
      query += ' WHERE DATE(o.created_at) = ?';
      params.push(date);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);

    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, mi.name 
         FROM order_items oi 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items.map(i => ({
        ...i,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 0
      }));
      order.total = Number(order.total) || 0;
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE STATUS (Admin)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// STATS (Admin)
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const [totalOrders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [todayOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()'
    );
    const [totalRevenue] = await pool.query(
      'SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != "cancelled"'
    );
    const [totalCustomers] = await pool.query('SELECT COUNT(*) as count FROM customers');
    const [pendingOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
    );

    res.json({
      totalOrders: Number(totalOrders[0].count) || 0,
      todayOrders: Number(todayOrders[0].count) || 0,
      totalRevenue: Number(totalRevenue[0].revenue) || 0,
      totalCustomers: Number(totalCustomers[0].count) || 0,
      pendingOrders: Number(pendingOrders[0].count) || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;