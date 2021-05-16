const express = require('express');
const app = express();

require('dotenv').config();

// Define routes
app.use('/api/popular/tv', require('./routes/api/popular/tv'));
app.use('/api/tv/on_the_air', require('./routes/api/free/tv'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
