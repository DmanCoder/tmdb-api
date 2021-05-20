const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

// Define routes
app.use(cors());
app.use('/api/popular/tv', require('./routes/api/popular/tv'));
app.use('/api/tv/on_the_air', require('./routes/api/free/tv'));
app.use('/api/trending/all/week', require('./routes/api/trending/trending'));
app.use('/api/search/multi', require('./routes/api/search/search'));
app.use('/api/trailers/tv', require('./routes/api/trailer/tv'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
