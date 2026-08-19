import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

// GET /api/gallery — public, optional ?category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    let sql    = 'SELECT * FROM gallery ORDER BY album_sort_order ASC, sort_order ASC, created_at DESC'
    const params = []
    if (category && category !== 'all') {
      sql = 'SELECT * FROM gallery WHERE category = $1 ORDER BY album_sort_order ASC, sort_order ASC, created_at DESC'
      params.push(category)
    }
    const { rows } = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/gallery — admin only (handles multiple file uploads via cloudinary)
router.post('/', protect, authorize('admin'), upload.array('images', 20), async (req, res) => {
  try {
    const { title, category, sort_order } = req.body

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' })
    }

    const baseSortOrder = parseInt(sort_order) || 0;
    const numFiles = req.files.length;

    // Check if album already exists to inherit its album_sort_order
    const { rows: existing } = await pool.query('SELECT album_sort_order FROM gallery WHERE title = $1 LIMIT 1', [title]);
    let albumSort = 0;
    
    if (existing.length > 0) {
      albumSort = existing[0].album_sort_order;
    } else {
      // It's a completely new album! Shift all existing albums down by 1 to make this one priority 0
      await pool.query('UPDATE gallery SET album_sort_order = album_sort_order + 1');
      albumSort = 0;
    }

    await pool.query(
      'UPDATE gallery SET sort_order = sort_order + $1 WHERE title = $2 AND sort_order >= $3',
      [numFiles, title, baseSortOrder]
    );

    const insertedRows = [];
    for (let i = 0; i < numFiles; i++) {
      const file = req.files[i];
      const { rows } = await pool.query(
        'INSERT INTO gallery (title, image_url, category, sort_order, album_sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, file.path, 'general', baseSortOrder + i, albumSort]
      )
      insertedRows.push(rows[0]);
    }
    
    res.status(201).json(insertedRows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error uploading file' })
  }
})

// PUT /api/gallery/album-sort — admin only
router.put('/album-sort', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, sort_order } = req.body
    const newSort = parseInt(sort_order);
    if (isNaN(newSort)) return res.status(400).json({ message: 'Invalid sort_order' });

    const { rows } = await pool.query('SELECT album_sort_order FROM gallery WHERE title = $1 LIMIT 1', [title]);
    if (rows.length === 0) return res.status(404).json({ message: 'Album not found' });
    
    const oldSort = rows[0].album_sort_order;

    if (oldSort !== newSort) {
      if (newSort < oldSort) {
        await pool.query(
          'UPDATE gallery SET album_sort_order = album_sort_order + 1 WHERE title != $1 AND album_sort_order >= $2 AND album_sort_order < $3',
          [title, newSort, oldSort]
        );
      } else {
        await pool.query(
          'UPDATE gallery SET album_sort_order = album_sort_order - 1 WHERE title != $1 AND album_sort_order <= $2 AND album_sort_order > $3',
          [title, newSort, oldSort]
        );
      }
      
      await pool.query('UPDATE gallery SET album_sort_order = $1 WHERE title = $2', [newSort, title]);
    }

    res.json({ message: 'Album sort order updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating album sort order' })
  }
})

// PUT /api/gallery/:id — admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { sort_order } = req.body
    const newSort = parseInt(sort_order);
    if (isNaN(newSort)) {
      return res.status(400).json({ message: 'Invalid sort_order' });
    }

    const { rows } = await pool.query('SELECT sort_order, title FROM gallery WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Item not found' });
    
    const oldSort = rows[0].sort_order;
    const albumTitle = rows[0].title;

    if (oldSort !== newSort) {
      if (newSort < oldSort) {
        await pool.query(
          'UPDATE gallery SET sort_order = sort_order + 1 WHERE title = $1 AND sort_order >= $2 AND sort_order < $3 AND id != $4',
          [albumTitle, newSort, oldSort, req.params.id]
        );
      } else {
        await pool.query(
          'UPDATE gallery SET sort_order = sort_order - 1 WHERE title = $1 AND sort_order <= $2 AND sort_order > $3 AND id != $4',
          [albumTitle, newSort, oldSort, req.params.id]
        );
      }
      
      await pool.query('UPDATE gallery SET sort_order = $1 WHERE id = $2', [newSort, req.params.id]);
    }

    res.json({ message: 'Item updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating item' })
  }
})

// DELETE /api/gallery/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
