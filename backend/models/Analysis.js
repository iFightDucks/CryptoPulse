const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  cryptoSymbol: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  marketAnalysis: {
    fundamental: String,
    technical: String,
    keyFactors: [String]
  },
  sentiment: {
    overall: String,
    fearGreed: String
  },
  pricePrediction: {
    shortTerm: String,
    trendDirection: String,
    supportLevels: [Number],
    resistanceLevels: [Number]
  },
  technicalIndicators: {
    patterns: [String],
    volumeAnalysis: String
  },
  recommendation: String
});

module.exports = mongoose.model('Analysis', AnalysisSchema);