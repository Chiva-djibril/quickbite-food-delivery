const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// ========== CUSTOMER REGISTER ==========
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, password, phone, address } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const [existing] = await pool.query('SELECT id FROM customers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO customers (fullname, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [fullname, email, hashedPassword, phone || null, address || null]
    );

    const token = jwt.sign(
      { id: result.insertId, email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: { 
        id: result.insertId, 
        fullname, 
        email, 
        phone: phone || null,
        address: address || null,
        profile_picture: null,
        role: 'customer' 
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ========== CUSTOMER LOGIN ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    const [customers] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);

    if (customers.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const customer = customers[0];
    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: customer.id,
        fullname: customer.fullname,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        profile_picture: customer.profile_picture,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== ADMIN LOGIN ==========
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    const [admins] = await pool.query('SELECT * FROM admins WHERE username = ?', [cleanUsername]);

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = admins[0];
    let isMatch = false;

    if (admin.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(cleanPassword, admin.password);
    } else {
      isMatch = (cleanPassword === admin.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful!',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullname: admin.username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ========== UPDATE PROFILE ==========
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { fullname, phone, address, profile_picture } = req.body;

    await pool.query(
      'UPDATE customers SET fullname = ?, phone = ?, address = ?, profile_picture = ? WHERE id = ?',
      [fullname, phone || null, address || null, profile_picture || null, decoded.id]
    );

    const [updated] = await pool.query(
      'SELECT id, fullname, email, phone, address, profile_picture FROM customers WHERE id = ?', 
      [decoded.id]
    );
    
    res.json({
      message: 'Profile updated!',
      user: { ...updated[0], role: 'customer' }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;