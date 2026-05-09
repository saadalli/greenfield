require('dotenv').config();
const { Client } = require('pg');

// Try different hosts
const configs = [
  {
    name: 'Domain (greenfieldsupermarket.com)',
    host: 'greenfieldsupermarket.com'
  },
  {
    name: 'Server IP (95.216.242.146)',
    host: '95.216.242.146'
  },
  {
    name: 'Localhost',
    host: 'localhost'
  }
];

async function testConnection(config) {
  console.log(`\n🔍 Testing: ${config.name}`);
  console.log(`   Host: ${config.host}`);
  
  const client = new Client({
    host: config.host,
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionTimeoutMillis: 10000,
    ssl: false
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as time');
    console.log('   ✅ SUCCESS!');
    console.log('   Database time:', result.rows[0].time);
    await client.end();
    return true;
  } catch (err) {
    console.log('   ❌ FAILED');
    console.log('   Error:', err.message);
    return false;
  }
}

(async () => {
  console.log('🚀 Testing PostgreSQL Connections...');
  console.log('Database:', process.env.DB_NAME);
  console.log('User:', process.env.DB_USER);
  console.log('Password:', process.env.DB_PASSWORD ? '***set***' : '⚠️ NOT SET!');
  
  for (const config of configs) {
    const success = await testConnection(config);
    if (success) {
      console.log('\n✅ WINNER! USE THIS IN YOUR .env:');
      console.log(`DB_HOST=${config.host}`);
      process.exit(0);
    }
  }
  
  console.log('\n❌ All attempts failed!');
  console.log('\nNext steps:');
  console.log('1. Check DB_PASSWORD in .env');
  console.log('2. Try: psql -h greenfieldsupermarket.com -U greenfieldsuperm_user -d greenfieldsuperm_db');
  console.log('3. Contact hosting support');
  process.exit(1);
})();
