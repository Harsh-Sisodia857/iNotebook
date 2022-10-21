const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/iNotebook-2";

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("MongoDb connected Successfully");
    })
}

module.exports = connectToMongo;