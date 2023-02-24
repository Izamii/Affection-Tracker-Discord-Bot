const mongoose = require('mongoose');

const affectionSchema = new mongoose.Schema({
    _id: {},
    name: String,
    dateable: Boolean,
    affection: {}
}, {minimize: false});

affectionSchema.methods.getSingleAffection = function (name) {
    if (this.affection[name] === undefined) {
        return null;
    }
    return this.affection[name];
}

affectionSchema.methods.getAllAffections = function () {
    return Object.entries(this.affection)
        .sort(([, a], [, b]) => b - a);
}

const affectionData = mongoose.model('affectionData', affectionSchema, 'affection');


module.exports = affectionData;