const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    user: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    func: {
        type: String,
        require: true,
    },
    carsToday: {
        type: [mongoose.Schema.Types.Mixed]
    },
});

module.exports = mongoose.model('User', userSchema);