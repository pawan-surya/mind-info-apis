const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    token: {
        type: String
    },
    registerDate: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('Users', userSchema);