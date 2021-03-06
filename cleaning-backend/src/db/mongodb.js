const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to database.');
}).catch((e) => {
    console.log('Database connection failed.');
});