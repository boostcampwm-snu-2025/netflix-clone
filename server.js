// server.js (CommonJS)
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const ROOT = __dirname;
const FILE = path.join(ROOT, 'likes.json');
IMAGES_DIR='./images/slider/'

app.use(express.json());
app.use(express.static(ROOT)); // serves index.html, script.js, images/, etc.

// Optional: read existing likes
app.get('/api/likes', async (req, res) => {
  try {
    const txt = await fs.readFile(FILE, 'utf8');
    return res.json(JSON.parse(txt));
  } catch {
    return res.json([]); // file may not exist yet
  }
});

app.get('/api/images', async (_req, res) => {
  try {
    const entries = await fs.readdir(IMAGES_DIR, { withFileTypes: true });
    const allow = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
    const files = entries
      .filter(d => d.isFile())
      .map(d => d.name)
      .filter(name => allow.has(path.extname(name).toLowerCase()))
      .map(name => ({
        url: `./images/${encodeURIComponent(name)}`,
        alt: path.parse(name).name.replace(/[-_]/g, ' '),
      }));

    console.log('[GET] /api/images ->', files.map(f => f.url)); // 👈 see URLs
    res.json(files);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Save likes array to ./likes.json
app.post('/api/save-likes', async (req, res) => {
  try {
    const likes = req.body;
    if (!Array.isArray(likes)) {
      return res.status(400).json({ error: 'likes must be an array' });
    }
    await fs.writeFile(FILE, JSON.stringify(likes, null, 2), 'utf8');
    return res.json({ ok: true, path: './likes.json' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to save likes.json' });
  }
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
