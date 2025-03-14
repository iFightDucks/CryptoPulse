// routes/index.js
const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// Market data routes
router.get('/market-data/:symbol', cryptoController.getMarketData);
router.get('/news/:crypto', cryptoController.getCryptoNews);
router.get('/sentiment', cryptoController.getMarketSentiment);

// Analysis routes
router.get('/analyze/:symbol', cryptoController.analyzeWithAI);
router.get('/prediction-history/:symbol', cryptoController.getPredictionHistory);

module.exports = router;