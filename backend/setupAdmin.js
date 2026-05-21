const bcrypt = require('bcryptjs');
const pool = require('./db');

async function setupAdmin() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    // Delete existing admin
    await pool.query('DELETE FROM admins WHERE username = ?', ['admin']);
    
    // Insert new admin with fresh hash
    await pool.query(
      'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
      ['admin', hash, 'admin@quickbite.com']
    );
    
    console.log('');
    console.log('========================================');
    console.log('✅ ADMIN CREATED SUCCESSFULLY!');
    console.log('========================================');
    console.log('🔑 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('🌐 URL: http://localhost:5173/admin/login');
    console.log('========================================');
    console.log('');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setupAdmin();