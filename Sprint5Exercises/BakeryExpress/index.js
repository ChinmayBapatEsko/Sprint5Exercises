const express = require('express');
const db = require('./Database');
const routes = require('./routes/routes');
const cors = require('cors');

const app = express();
db.connect();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
