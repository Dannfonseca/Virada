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
    date: {
        type: Date,
        required: false
    },
    time: {
        type: String,
        required: false
    },
    neighborhood: {
        type: String,
        trim: true,
        required: false
    },
    done: {
        type: Boolean,
        default: false
    },
    comments: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Item', itemSchema);
