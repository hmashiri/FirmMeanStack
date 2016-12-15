var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema   = new Schema({

        title: String,
        bodyDescription: String,
        createdBy: String,


    },
    { versionKey: false ,
        timestamps: true }
);

module.exports = mongoose.model('message', MessageSchema);