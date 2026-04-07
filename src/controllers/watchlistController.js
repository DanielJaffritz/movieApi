import 'dotenv/config';
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});
export const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  const client = await pool.connect();
  try {
    const movie = await client.query('SELECT * FROM movies WHERE id = $1', [movieId])

    if (movie.rowCount === 0) {
      res.status(404).json({
        error: "Movie not found"

      })
    }
    const existingInWatchlist = await client.query('SELECT EXISTS(SELECT 1 FROM watchlistitem WHERE userId = $1 AND movieId = $2) as Condition', [req.user, movieId])
    const result = existingInWatchlist.rows[0].condition;
    if (result) {
      res.status(400).json({ error: "Movie already in the watchlist" })
    }
    const watchlistitem = await client.query('INSERT INTO watchlistitem (userId, movieId, status, rating, notes) VALUES($1, $2, $3, $4, $5);', [req.user, movieId, status.toUpperCase(), rating, notes])
    res.status(201).json({
      status: "success",
      message: "movie added to the watchlist"
    })
  } catch (error) {
    console.error("mmalo", error.stack);

  }
}
export const updateWatchlist = async (req, res) => {
  const { status, rating, notes } = req.body;

  const client = await pool.connect();
  try {
    const watchlistitem = await client.query('SELECT * FROM watchlistitem WHERE id = $1', [req.params.id]);

    if (watchlistitem.rowCount === 0) {
      return res.status(404).json({ error: "item not found" });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    const updatedData = await client.query('UPDATE watchlistitem SET status = $1, rating = $2, notes = $3 WHERE id = $4', [updateData.status, updateData.rating, updateData.notes, watchlistitem.rows[0].id])

    res.status(201).json({ message: "updated succesfully" });
  } catch (error) {
    res.status(401).json({ error: "An error ocurred during the operation" })
  }
}
export const removeFromWatchlist = async (req, res) => {

  const client = await pool.connect();
  try {
    const movie = await client.query('SELECT id FROM watchlistitem WHERE id = $1', [req.params.id]);
    if (movie.rowCount === 0) {
      return res.status(404).json({ error: "item not found" });
    }
    const item = await client.query('DELETE FROM watchlistitem WHERE id = $1', [movie.rows[0].id])
    res.status(201).json({ message: "item deleted" })
  } catch (error) {
    res.status(401).json({ error: "An error ocurred during the operation" })
  }
}
