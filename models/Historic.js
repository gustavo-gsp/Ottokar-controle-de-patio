const mongoose = require('mongoose');

const historicCarSchema = new mongoose.Schema ({
    carName: {
        type: String,
        require: true,
    },plate: {
        type: String,
        require: true,
    },stage: {
        type: String,
        require: true,
        default: 'Agendado',
    },responsible: {
        type: String,
        require: true,
    },forecast: {
        type: String,
        require: true,  
    },complaint: {
        type: String,
    },services: {
        type: String,
    },parts: {
        type: String,
    },date: {
        type: String,
    },specialty: {
        type: String,
        require: true,
    },historic: {
        type: String,
    },
});

module.exports = mongoose.model('Historic', historicCarSchema);