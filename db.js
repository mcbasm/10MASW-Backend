var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://mmartorellmorales:JgM5fyBvoJX8atsq@cluster0.km6i9.mongodb.net/test';

exports.connectToDB = () => {
    mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

exports.getConnection = () => {
    return mongoose.connection;
}