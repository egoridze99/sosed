const mongoose = require('mongoose');

const telefoneSchema = mongoose.Schema({
    name : String,
    telefone : String
});

const Telefone = mongoose.model('Telefone', telefoneSchema);

module.exports = Telefone;