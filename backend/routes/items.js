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

// GET single item by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST comment to item
router.post('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const newComment = {
            text: text.trim(),
            createdAt: new Date()
        };

        item.comments.push(newComment);
        await item.save();

        // Emit socket event
        req.io.emit('item:comment-added', {
            itemId: id,
            comment: newComment
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE comment from item
router.delete('/:id/comments/:commentId', async (req, res) => {
    try {
        const { id, commentId } = req.params;

        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Find and remove the comment
        const commentIndex = item.comments.findIndex(
            comment => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        item.comments.splice(commentIndex, 1);
        await item.save();

        // Emit socket event
        req.io.emit('item:comment-deleted', {
            itemId: id,
            commentId: commentId
        });

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new item
router.post('/', async (req, res) => {
    try {
        const { title, location, category, date, time, neighborhood } = req.body;

        if (!title || !category) {
            return res.status(400).json({ error: 'Title and category are required' });
        }

        const item = new Item({
            title,
            location: location || '',
            category,
            date,
            time,
            neighborhood: neighborhood || '',
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
