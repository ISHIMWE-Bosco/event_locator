const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = require('../db');

const seedDatabase = async () => {
  try {
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM events');
    await pool.query('DELETE FROM event_categories');
    
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);
    
    const users = [
      { name: 'Bosco Ishimwe', email: 'bosco@example.com', password: hashedPassword1, location: 'POINT(30.0605 -1.9501)' },
      { name: 'Alice Mwiza', email: 'alice@example.com', password: hashedPassword2, location: 'POINT(30.0739 -1.9441)' }
    ];
    
    for (let user of users) {
      await pool.query(
        `INSERT INTO users (name, email, password, location) VALUES ($1, $2, $3, ST_GeomFromText($4, 4326))`,
        [user.name, user.email, user.password, user.location]
      );
    }
    
    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    pool.end();
  }
};

seedDatabase();