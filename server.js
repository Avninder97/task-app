require('dotenv').config();

// const db = require('./utils/db');
const express = require('express');
const app = express();

const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

const main = async () => {
    app.listen(3000, () => {
        console.log('Server started at Port 3000');
    })
}

main();