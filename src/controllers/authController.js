import 'dotenv/config'
import { Pool } from 'pg';
import bcrypt from "bcryptjs";
import { generateToken } from '../utils/generateToken.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const client = await pool.connect();
  const userExists = await client.query(`SELECT EXISTS( SELECT 1 FROM users WHERE email = $1) AS condition`, [email]);
  const result = userExists.rows[0].condition;
  if (result) {
    return res.status(400).json({ error: 'user already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await client.query('INSERT INTO users (name, email, password) VALUES($1, $2, $3);', [name, email, hashedPassword]);
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      }
    }
  })

}

const login = async (req, res) => {
  const { email, password } = req.body;
  const client = await pool.connect();
  const userExists = await client.query(`SELECT EXISTS( SELECT 1 FROM users WHERE  email = $1) AS condition`, [email]);
  const result = userExists.rows[0].condition;
  if (!result) {
    return res.status(401).json({ error: 'invalid email or password' });
  }
  const user = await client.query('SELECT password, id FROM users WHERE email = $1;', [email])
  const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'invalid email or password' });
  }
  const token = generateToken(user.rows[0].id)
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    }
  })
}
export { register, login }
