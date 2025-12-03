import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        default: '',
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['beach', 'night', 'food', 'tour']
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Item', itemSchema);
