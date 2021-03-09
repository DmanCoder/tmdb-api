const express = require('express');
const app = express();

// Define routes
// app.use('/api/hello', require('./routes/api/hello'));
app.use('/hello', require('./routes/api/hello'));
app.use('/sum', require('./routes/api/sum'));
app.use('/reverse-words', require('./routes/api/reverse'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
