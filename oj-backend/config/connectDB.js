const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/online-judge';

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(dbUrl);
        console.log(`Database connected: ${connect.connection.host} ${connect.connection.name}`)
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;