const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
        User: { type: Number, default: 2001 },
        Editor: Number,
        Admin: Number
    },
    likedTests: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Test' } ],
    createdTests: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Test' } ],
    completedTests: 
    [
        { 
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        score: { type: Number, required: true },
        dateCompleted: { type: Date, default: Date.now }
        }
    ],
    refreshToken: { type: String, required: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)