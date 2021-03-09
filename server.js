const express = require('express');
const app = express();

// Define routes
app.use('/api/hello', require('./routes/api/hello'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
