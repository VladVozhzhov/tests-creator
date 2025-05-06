const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const testSchema = new Schema ({
    name: { type: String, required: true },
    questions: [
        {
            name: { type: String, required: true},
            content: { type: String, required: true},
            answersList: { type: Map, of: String, required: true },
            correctAnswer: { type: String, required: true },
            points: { type: Number, required: true }
        }
    ],
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    author: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Test', testSchema)