const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

// enable cors for all routes
app.use(cors());

// serve static files
app.use("/movie_img", express.static(path.join(__dirname, "movie_img")));

/**
 * Get a random list of images from a folder filtered by extension
 * @param {string} folder_path - folder path containing images
 * @param {string} extension - file extension to filter by (e.g. "webp", "jpg")
 * @param {number} num_img - number of images to return (clamped to total available)
 * @returns {Promise<Array>} - list of movie objects
 */
function get_random_img_list(folder_path, extension = "webp", num_img = 6) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder_path, (err, files) => {
      if (err) {
        return reject(err);
      }

      const movie_files = files.filter((file) => file.endsWith(`.${extension}`));

      if (movie_files.length === 0) {
        return resolve([]);
      }

      // shuffle files
      const shuffled_files = movie_files.sort(() => 0.5 - Math.random());

      // clamp to available count
      const safe_count = Math.min(num_img, movie_files.length);

      // pick exactly safe_count
      const selected_files = shuffled_files.slice(0, safe_count);

      const movies = selected_files.map((file) => {
        const id = path.parse(file).name;
        return {
          id: id,
          title: `movie_${id}`,
          image: `/movie_img/${file}`,
        };
      });

      resolve(movies);
    });
  });
}

// endpoint to return random movies
app.get("/api/data", async (req, res) => {
  const folder_path = path.join(__dirname, "movie_img");
  const extension = req.query.extension || "webp"; // default to webp if not given
  const num_img = parseInt(req.query.num_img) || 12; // default 12

  try {
    const movies = await get_random_img_list(folder_path, extension, num_img);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "unable_to_read_movie_folder" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ server_running_at http://localhost:${PORT}`);
});
