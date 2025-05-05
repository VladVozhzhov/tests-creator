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
    createdTests: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Test' } ],
    refreshToken: { type: String, required: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)