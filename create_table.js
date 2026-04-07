import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
})

async function setup() {
  const client = await pool.connect();
  try {
    console.log("connected bro")
    await client.query('DROP TABLE IF EXISTS watchlistItem;');
    await client.query('DROP TYPE IF EXISTS watchliststatus;');
    await client.query('DROP TABLE IF EXISTS movies;');
    await client.query('DROP TABLE IF EXISTS users;');
    console.log("table dropped")

    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        createdAt DATE DEFAULT CURRENT_DATE
      ); 
    `);
    await client.query(`
      CREATE TABLE movies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255),
        overview VARCHAR(255),
        release_year INT,
        genres TEXT[],
        runtime INT,
        posterURL VARCHAR(255),
        createdBy UUID,
        createdAt DATE DEFAULT CURRENT_DATE,

        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
      );
    `)
    await client.query(`CREATE TYPE watchliststatus AS ENUM('PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED');`)
    await client.query(`
      CREATE TABLE watchlistItem (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        userID UUID,
        movieID UUID,
        status watchliststatus DEFAULT 'PLANNED',
        rating INT,
        notes VARCHAR(255),
        createdat DATE DEFAULT CURRENT_DATE,
        updatedAt DATE DEFAULT CURRENT_DATE,
        
        FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (movieID) REFERENCES movies(id) ON DELETE CASCADE
      );
    `)
  } catch (error) {
    console.error('connection failed', error.stack);
  }
  finally {
    client.release();
    pool.end();
  }
}
setup();
