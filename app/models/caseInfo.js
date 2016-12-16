var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CaseInfoSchema = new Schema({
    caseName: String,
    attorney: String,
    caseNumber: String,
    practiceArea: String,
    customerName: String


}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('caseInfo', CaseInfoSchema);
