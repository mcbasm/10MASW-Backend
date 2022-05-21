//#region IMPORTS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//#endregion IMPORTS

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema);