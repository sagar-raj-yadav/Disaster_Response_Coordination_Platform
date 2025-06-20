const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('./middlewares/auth');
require('dotenv').config();

const disasterRoutes = require('./routes/disasterRoutes');
const socialRoutes = require('./routes/socialRoutes');
const geocodeRoutes = require('./routes/geocodeRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const updateRoutes = require('./routes/updateRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 60 }));
app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.use('/disasters', disasterRoutes(io));
app.use('/geocode', geocodeRoutes);
app.use('/verify', verifyRoutes);
app.use('/resources', resourceRoutes(io));
app.use('/updates', updateRoutes);
app.use('/social', socialRoutes(io));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
