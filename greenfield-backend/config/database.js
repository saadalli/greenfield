const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'greenfieldsuperm_db_local',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  
  // Connection pool settings
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false',
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT) || 10000,
  
  // Additional settings
  timezone: '+00:00', // Store dates in UTC
  dateStrings: false,
  multipleStatements: false, // Security: prevent SQL injection with multiple statements
};

// Add SSL configuration if enabled
if (process.env.DB_SSL === 'true') {
  config.ssl = {
    rejectUnauthorized: false
  };
}

// Create the connection pool
const pool = mysql.createPool(config);

// Log connection on startup
if (process.env.NODE_ENV === 'development') {
  pool.getConnection()
    .then(connection => {
      console.log('✅ MySQL Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('❌ MySQL Database connection failed:', err.message);
    });
}

// Helper function to execute queries
const query = async (sql, params = []) => {
  const start = Date.now();
  try {
    const [results] = await pool.execute(sql, params);
    const duration = Date.now() - start;
    
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('Executed query', { 
        sql: sql.substring(0, 100), 
        duration, 
        rows: Array.isArray(results) ? results.length : 'N/A'
      });
    }
    
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    console.error('SQL:', sql);
    throw error;
  }
};

// Helper function to get a connection from the pool (for transactions)
const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('Connection acquired from pool');
    }
    
    return connection;
  } catch (error) {
    console.error('Error getting connection from pool:', error.message);
    throw error;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const [result] = await pool.execute('SELECT NOW() as now, DATABASE() as database_name');
    console.log('✅ Database connection test successful');
    console.log(`📅 Server time: ${result[0].now}`);
    console.log(`🗄️  Database: ${result[0].database_name}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool has ended');
  } catch (error) {
    console.error('Error closing database pool:', error.message);
  }
};

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

module.exports = {
  query,
  getConnection,
  pool,
  testConnection,
  closePool
};