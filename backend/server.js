const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const dbConnect = require('./config/database');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});