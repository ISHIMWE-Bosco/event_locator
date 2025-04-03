const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../middleware/authMiddleware'); // Import authentication middleware

// Get all events
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, title, description, ST_AsText(location) as location, datetime, category_id, created_by, created_at FROM events'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get a specific event by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'SELECT id, title, description, ST_AsText(location) as location, datetime, category_id, created_by, created_at FROM events WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Event not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create a new event
router.post('/', async (req, res) => {
    const { title, description, location, datetime, category_id, created_by } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO events (title, description, location, datetime, category_id, created_by, created_at) 
            VALUES ($1, $2, ST_GeomFromText($3, 4326), $4, $5, $6, NOW()) RETURNING *`,
            [title, description, location, datetime, category_id, created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update an event (Allow Partial Updates)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, location, datetime, category_id, created_by } = req.body;

    try {
        const result = await db.query(
            `UPDATE events 
            SET 
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                location = COALESCE(ST_GeomFromText($3, 4326), location),
                datetime = COALESCE($4, datetime),
                category_id = COALESCE($5, category_id),
                created_by = COALESCE($6, created_by)
            WHERE id = $7 RETURNING *`,
            [title, description, location, datetime, category_id, created_by, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Event not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Event not found');
        }
        res.status(200).send('Event deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// Protected route: Create a new event (only for authenticated users)
router.post('/', authenticate, async (req, res) => {
    const { title, description, location, datetime, category_id } = req.body;
  
    try {
      const result = await db.query(
        'INSERT INTO events (title, description, location, datetime, category_id, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
        [title, description, location, datetime, category_id, req.user.id] // Use req.user.id (from decoded token)
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  // Location-based search (Get events within a radius from a point)
router.get('/search', async (req, res) => {
    const { latitude, longitude, radius } = req.query;

    // Check if the query parameters exist
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ msg: "Latitude, longitude, and radius are required." });
    }

    // Convert latitude, longitude, and radius to float values
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Check if the values are valid numbers
    if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
        return res.status(400).json({ msg: "Invalid latitude, longitude, or radius." });
    }

    try {
        // Execute the query to search for events
        const result = await db.query(
            `SELECT id, title, description, ST_AsText(location) as location, datetime, category_id, created_by, created_at
            FROM events
            WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)`,
            [lon, lat, rad]
        );

        // If no events are found, return a 404
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "No events found in this area." });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;
