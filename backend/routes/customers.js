const express = require('express');
const pool = require('../db');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// GET ALL CUSTOMERS (Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [customers] = await pool.query(`
      SELECT 
        c.id, c.fullname, c.email, c.phone, c.address, c.profile_picture, c.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    const customersWithStats = customers.map(c => ({
      ...c,
      total_orders: Number(c.total_orders) || 0,
      total_spent: Number(c.total_spent) || 0,
      is_active: c.last_order_date ? 
        (new Date() - new Date(c.last_order_date)) < (30 * 24 * 60 * 60 * 1000) : false
    }));

    res.json(customersWithStats);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CUSTOMER ORDERS (Admin)
router.get('/:id/orders', verifyAdmin, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );

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

// GET DETAILED STATS (Admin)
router.get('/stats/detailed', verifyAdmin, async (req, res) => {
  try {
    const [activeUsers] = await pool.query(`
      SELECT COUNT(DISTINCT customer_id) as count 
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const [newThisWeek] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM customers 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    const [totalCustomers] = await pool.query('SELECT COUNT(*) as count FROM customers');

    const [topCustomers] = await pool.query(`
      SELECT c.id, c.fullname, c.email, c.profile_picture,
        COUNT(o.id) as orders_count,
        COALESCE(SUM(o.total), 0) as total_spent
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      WHERE o.status != 'cancelled'
      GROUP BY c.id
      ORDER BY total_spent DESC
      LIMIT 5
    `);

    const [topItems] = await pool.query(`
      SELECT mi.id, mi.name, mi.image_url, mi.price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY mi.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    const [revenueByDay] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const [ordersByStatus] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    const [thisMonth] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
      FROM orders
      WHERE MONTH(created_at) = MONTH(NOW())
        AND YEAR(created_at) = YEAR(NOW())
        AND status != 'cancelled'
    `);

    const [lastMonth] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
      FROM orders
      WHERE MONTH(created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
        AND YEAR(created_at) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
        AND status != 'cancelled'
    `);

    const [avgOrder] = await pool.query(`
      SELECT COALESCE(AVG(total), 0) as avg_value
      FROM orders
      WHERE status != 'cancelled'
    `);

    res.json({
      activeUsers: Number(activeUsers[0].count) || 0,
      newThisWeek: Number(newThisWeek[0].count) || 0,
      totalCustomers: Number(totalCustomers[0].count) || 0,
      topCustomers: topCustomers.map(c => ({
        ...c,
        orders_count: Number(c.orders_count) || 0,
        total_spent: Number(c.total_spent) || 0
      })),
      topItems: topItems.map(i => ({
        ...i,
        total_sold: Number(i.total_sold) || 0,
        revenue: Number(i.revenue) || 0,
        price: Number(i.price) || 0
      })),
      revenueByDay: revenueByDay.map(r => ({
        ...r,
        orders: Number(r.orders) || 0,
        revenue: Number(r.revenue) || 0
      })),
      ordersByStatus: ordersByStatus.reduce((acc, curr) => {
        acc[curr.status] = Number(curr.count);
        return acc;
      }, {}),
      thisMonth: {
        revenue: Number(thisMonth[0].revenue) || 0,
        orders: Number(thisMonth[0].orders) || 0
      },
      lastMonth: {
        revenue: Number(lastMonth[0].revenue) || 0,
        orders: Number(lastMonth[0].orders) || 0
      },
      averageOrderValue: Number(avgOrder[0].avg_value) || 0
    });
  } catch (error) {
    console.error('Detailed stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE CUSTOMER (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Cannot delete - has orders' });
  }
});

module.exports = router;