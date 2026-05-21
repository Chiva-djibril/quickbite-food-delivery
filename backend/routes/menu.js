const express = require('express');
const pool = require('../db');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// GET ALL MENU ITEMS
router.get('/', async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT * FROM menu_items WHERE available = TRUE ORDER BY category, name'
    );
    // Ensure prices are numbers
    const safeItems = items.map(item => ({
      ...item,
      price: Number(item.price) || 0
    }));
    res.json(safeItems);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SINGLE ITEM
router.get('/:id', async (req, res) => {
  try {
    const [items] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);
    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ ...items[0], price: Number(items[0].price) || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD ITEM (Admin)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price required' });
    }

    const [result] = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', Number(price), category || '', image_url || '']
    );

    res.status(201).json({ message: 'Menu item added!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE ITEM (Admin)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url, available } = req.body;
    await pool.query(
      `UPDATE menu_items SET name=?, description=?, price=?, 
       category=?, image_url=?, available=? WHERE id=?`,
      [name, description, Number(price), category, image_url, available ? 1 : 0, req.params.id]
    );
    res.json({ message: 'Menu item updated!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE ITEM (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Menu item deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;