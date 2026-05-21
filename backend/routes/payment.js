const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Generate unique payment reference
const generateReference = () => {
  return 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// PROCESS PAYMENT & CREATE ORDER
router.post('/process', verifyToken, async (req, res) => {
  const { 
    items, 
    delivery_address, 
    payment_method,
    card_number,
    card_holder,
    phone_number,
    amount 
  } = req.body;
  const customer_id = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  if (!payment_method) {
    return res.status(400).json({ message: 'Payment method required' });
  }

  // Validate payment based on method
  if (payment_method === 'card') {
    if (!card_number || card_number.replace(/\s/g, '').length < 13) {
      return res.status(400).json({ message: 'Invalid card number' });
    }
    if (!card_holder || card_holder.trim().length < 3) {
      return res.status(400).json({ message: 'Invalid card holder name' });
    }
  } else if (payment_method === 'mobile_money') {
    if (!phone_number || phone_number.length < 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }
  }

  // Simulate payment processing
  const reference = generateReference();
  
  // Simulate random payment failures (5% chance) - remove if you want 100% success
  const shouldFail = Math.random() < 0.05;
  if (shouldFail && payment_method === 'card') {
    return res.status(400).json({ 
      message: 'Payment declined. Please try again or use different card.',
      reference 
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let total = 0;
    const itemsWithPrices = [];

    for (const item of items) {
      const [menuItem] = await connection.query(
        'SELECT price, name FROM menu_items WHERE id = ?',
        [item.menu_item_id]
      );
      if (menuItem.length === 0) throw new Error('Item not found');
      const price = Number(menuItem[0].price);
      total += price * item.quantity;
      itemsWithPrices.push({ ...item, price, name: menuItem[0].name });
    }

    // Determine payment status based on method
    const paymentStatus = payment_method === 'cash_on_delivery' ? 'pending' : 'paid';
    const paidAt = payment_method === 'cash_on_delivery' ? null : new Date();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (customer_id, total, delivery_address, status, payment_status, payment_method, payment_reference, paid_at) 
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [customer_id, total, delivery_address || null, paymentStatus, payment_method, reference, paidAt]
    );

    const order_id = orderResult.insertId;

    for (const item of itemsWithPrices) {
      await connection.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.menu_item_id, item.quantity, item.price]
      );
    }

    await connection.commit();
    
    console.log(`✅ Order #${order_id} - Payment: ${payment_method.toUpperCase()} - $${total} - Ref: ${reference}`);
    
    res.status(201).json({ 
      message: payment_method === 'cash_on_delivery' 
        ? 'Order placed! Pay when you receive your order.' 
        : 'Payment successful! Order placed.',
      order_id, 
      total,
      reference,
      payment_method,
      payment_status: paymentStatus
    });
  } catch (error) {
    await connection.rollback();
    console.error('Payment error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// VERIFY CARD (Mock validation - looks real)
router.post('/verify-card', verifyToken, (req, res) => {
  const { card_number } = req.body;
  const cleaned = card_number.replace(/\s/g, '');
  
  // Detect card type
  let cardType = 'Unknown';
  if (/^4/.test(cleaned)) cardType = 'Visa';
  else if (/^5[1-5]/.test(cleaned)) cardType = 'MasterCard';
  else if (/^3[47]/.test(cleaned)) cardType = 'American Express';
  else if (/^6/.test(cleaned)) cardType = 'Discover';
  
  res.json({ cardType, valid: cleaned.length >= 13 });
});

module.exports = router;