const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/Bakery';

async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process on connection error
    }
}

module.exports = { connect };
