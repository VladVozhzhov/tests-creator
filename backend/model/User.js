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
    completedTests: [
        {
          testId: {
            type: require('mongoose').Schema.Types.ObjectId,
            ref: 'Test'
          },
          score: Number,
          maxScore: Number,
          dateCompleted: Date,
          questionResults: [
            {
              questionId: require('mongoose').Schema.Types.ObjectId,
              correct: Boolean,
              pointsEarned: Number
            }
          ],
          answers: {} 
        }
      ],
    refreshToken: { type: String, required: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)