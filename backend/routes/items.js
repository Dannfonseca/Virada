import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

// GET all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new item
router.post('/', async (req, res) => {
    try {
        const { title, location, category } = req.body;

        if (!title || !category) {
            return res.status(400).json({ error: 'Title and category are required' });
        }

        const item = new Item({
            title,
            location: location || '',
            category,
            done: false
        });

        await item.save();

        // Emit socket event
        req.io.emit('item:created', item);

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH update item (toggle done)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { done } = req.body;

        const item = await Item.findByIdAndUpdate(
            id,
            { done },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Emit socket event
        req.io.emit('item:updated', item);

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Emit socket event
        req.io.emit('item:deleted', id);

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
