import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true
  }
})
export const authMiddleware = async (req, res, next) => {

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, not token provided" })
  }
  const client = await pool.connect();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await client.query('SELECT id FROM users WHERE id = $1;', [decoded.id]);
    if (user.rowCount === 0) {
      return res.status(401).json({ error: "user no longer exists" })
    }
    req.user = user.rows[0].id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "not authorized" });
  }
} 
