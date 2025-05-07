const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
  content: { type: String, required: true },
  inputType: {
    type: String,
    enum: ['radio', 'checkbox', 'text'],
    required: true
  },
  points: { type: Number, required: true },
  answersList: {
    type: Map,
    of: String,
    default: undefined
  },
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true
  }
});

const testSchema = new Schema({
  name: { type: String, required: true },
  questions: [questionSchema],
  visits: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  author: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
