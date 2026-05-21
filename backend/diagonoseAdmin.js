const bcrypt = require('bcryptjs');
const pool = require('./db');

async function diagnose() {
  console.log('\n========================================');
  console.log('🔍 ADMIN LOGIN DIAGNOSTIC');
  console.log('========================================\n');

  try {
    // 1. Check database connection
    console.log('1️⃣ Testing database connection...');
    await pool.query('SELECT 1');
    console.log('    Database connected\n');

    // 2. Check if admins table exists
    console.log('2️⃣ Checking admins table...');
    const [tables] = await pool.query("SHOW TABLES LIKE 'admins'");
    if (tables.length === 0) {
      console.log('   ADMINS TABLE DOES NOT EXIST!');
      console.log('    Solution: Run delivery.sql first\n');
      process.exit(1);
    }
    console.log('    Admins table exists\n');

    // 3. Check admin users
    console.log('3️⃣ Checking admin users...');
    const [admins] = await pool.query('SELECT * FROM admins');
    console.log(`   Found ${admins.length} admin(s)\n`);

    if (admins.length === 0) {
      console.log('    NO ADMIN USERS! Creating one now...\n');
      await pool.query(
        'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
        ['admin', 'admin123', 'admin@quickbite.com']
      );
      console.log('   Admin created!\n');
    } else {
      admins.forEach((a, i) => {
        console.log(`   Admin #${i + 1}:`);
        console.log(`     - ID: ${a.id}`);
        console.log(`     - Username: "${a.username}"`);
        console.log(`     - Password: "${a.password}"`);
        console.log(`     - Password length: ${a.password.length}`);
        console.log(`     - Is hashed: ${a.password.startsWith('$2') ? 'YES' : 'NO (plain text)'}`);
        console.log('');
      });
    }

    // 4. Test login with admin/admin123
    console.log('4️⃣ Testing login with: admin / admin123\n');
    const [testLogin] = await pool.query('SELECT * FROM admins WHERE username = ?', ['admin']);
    
    if (testLogin.length === 0) {
      console.log('    No admin with username "admin"');
      process.exit(1);
    }

    const admin = testLogin[0];
    let passwordMatch = false;

    if (admin.password.startsWith('$2')) {
      console.log('   Password is hashed, comparing with bcrypt...');
      passwordMatch = await bcrypt.compare('admin123', admin.password);
    } else {
      console.log('   Password is plain text, direct comparison...');
      passwordMatch = (admin.password === 'admin123');
    }

    if (passwordMatch) {
      console.log('    PASSWORD WORKS!\n');
      console.log('========================================');
      console.log(' EVERYTHING IS WORKING!');
      console.log('========================================');
      console.log('Login with:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('========================================\n');
    } else {
      console.log('    PASSWORD DOES NOT MATCH!\n');
      console.log('    FIXING NOW... Resetting password to "admin123"');
      
      await pool.query('UPDATE admins SET password = ? WHERE username = ?', ['admin123', 'admin']);
      
      console.log('    FIXED!\n');
      console.log('========================================');
      console.log(' ADMIN PASSWORD RESET TO: admin123');
      console.log('========================================');
      console.log('Now login with:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('========================================\n');
    }

    process.exit(0);
  } catch (err) {
    console.error(' ERROR:', err.message);
    console.error('\nFull error:', err);
    process.exit(1);
  }
}

diagnose();