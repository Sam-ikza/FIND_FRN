// Vercel serverless entry point — exports the Express app as a request handler.
// REST API routes (/api/*) are served from here; static frontend files are
// served by Vercel's CDN from the frontend/dist build output.
module.exports = require('../backend/app');
