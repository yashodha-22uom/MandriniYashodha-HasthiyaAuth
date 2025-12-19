import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const setupDatabase = async () => {
  try {
    console.log('Setting up database...\n');

    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to MySQL server');

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'hasthiyaauth';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.query(`USE ${dbName}`);

    // Read and execute SQL file
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.toLowerCase().includes('create database') || 
          statement.toLowerCase().includes('use ')) {
        continue; // Skip these as we've already handled them
      }
      await connection.query(statement);
    }

    console.log(' Tables created successfully');
    console.log('\n Database schema:');
    console.log('   - users');
    console.log('   - refresh_tokens');

    await connection.end();
    console.log('\n Database setup completed successfully!');
    console.log('\n You can now start the server with: npm run dev\n');
    
  } catch (error) {
    console.error(' Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
