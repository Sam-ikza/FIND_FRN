const http = require('http');
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = require('./app');
const initChat = require('./services/chat');

if (process.env.NODE_ENV === 'production') {
  const staticLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get(/^(?!\/api).*/, staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initChat(server);

server.listen(PORT, () => console.log(`NestBud server running on port ${PORT}`));
