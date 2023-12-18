const mongoose = require('mongoose');

const vacanciesSchema = new mongoose.Schema ({
    number: {
        type: String,
        require: true,
    },
    carName: {
        type: String,
    },
    plate: {
        type: String,
    },
    entryDate: {
        type: String,
    },
    historic: {
        type: [mongoose.Schema.Types.Mixed],
    },
});

module.exports = mongoose.model('Vacancies', vacanciesSchema);