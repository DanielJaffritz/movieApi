import express from "express"

import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlists", watchlistRoutes)

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
