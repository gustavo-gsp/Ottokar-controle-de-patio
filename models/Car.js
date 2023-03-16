const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
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
        type: Date,
        default: Date.now(),
    },    
});

module.exports = mongoose.model('Car', carSchema);