// controllers/cryptoController.js
const axios = require('axios');
const ccxt = require('ccxt');
const Analysis = require('../models/Analysis.js');

const exchange = new ccxt.binance();

exports.getMarketData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const timeframe = req.query.timeframe || '1d';
    const limit = parseInt(req.query.limit) || 30;
    
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
    const data = ohlcv.map(item => ({
      timestamp: new Date(item[0]),
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: item[5]
    }));
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCryptoNews = async (req, res) => {
  try {
    const { crypto } = req.params;
    const days = parseInt(req.query.days) || 3;
    
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: crypto,
        from: fromDate.toISOString().split('T')[0],
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY,
        language: 'en'
      }
    });
    
    if (response.status === 200) {
      res.json(response.data.articles.slice(0, 10));
    } else {
      throw new Error(`Error fetching news: ${response.status}`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMarketSentiment = async (req, res) => {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    
    if (response.status === 200) {
      const data = response.data;
      res.json({
        fearGreedValue: data.data[0].value,
        fearGreedClass: data.data[0].value_classification,
        timestamp: data.data[0].timestamp
      });
    } else {
      throw new Error('Failed to fetch sentiment data');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AI analysis controller
exports.analyzeWithAI = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Collect data
    const marketData = await getMarketDataHelper(symbol);
    const cryptoName = symbol.split('/')[0];
    const newsData = await getNewsHelper(cryptoName);
    const sentimentData = await getSentimentHelper();
    const currentPrice = await getCurrentPriceHelper(symbol);
    
    // Analyze with AI models
    const geminiAnalysis = await analyzeWithGemini(cryptoName, marketData, newsData);
    const deepseekAnalysis = await analyzeWithDeepseek(cryptoName, marketData, sentimentData);
    
    // Combine analyses
    const combinedAnalysis = combineAnalyses(
      geminiAnalysis,
      deepseekAnalysis,
      currentPrice,
      marketData,
      symbol
    );
    
    // Save to database
    const analysisRecord = new Analysis({
      cryptoSymbol: symbol,
      currentPrice: currentPrice,
      marketAnalysis: {
        fundamental: combinedAnalysis.market_analysis.fundamental,
        technical: combinedAnalysis.market_analysis.technical,
        keyFactors: combinedAnalysis.market_analysis.key_factors
      },
      sentiment: {
        overall: combinedAnalysis.sentiment.overall,
        fearGreed: combinedAnalysis.sentiment.fear_greed
      },
      pricePrediction: {
        shortTerm: combinedAnalysis.price_prediction.short_term,
        trendDirection: combinedAnalysis.price_prediction.trend_direction,
        supportLevels: combinedAnalysis.price_prediction.support_levels,
        resistanceLevels: combinedAnalysis.price_prediction.resistance_levels
      },
      technicalIndicators: {
        patterns: combinedAnalysis.technical_indicators.patterns,
        volumeAnalysis: combinedAnalysis.technical_indicators.volume_analysis
      },
      recommendation: combinedAnalysis.recommendation
    });
    
    await analysisRecord.save();
    res.json(combinedAnalysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPredictionHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const analyses = await Analysis.find({ cryptoSymbol: symbol })
                                 .sort({ timestamp: -1 })
                                 .limit(10);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
async function getMarketDataHelper(symbol, timeframe = '1d', limit = 30) {
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  return ohlcv.map(item => ({
    timestamp: new Date(item[0]),
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    volume: item[5]
  }));
}

async function getCurrentPriceHelper(symbol) {
  const ticker = await exchange.fetchTicker(symbol);
  return ticker.last;
}

async function getNewsHelper(crypto, days = 3) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q: crypto,
      from: fromDate.toISOString().split('T')[0],
      sortBy: 'publishedAt',
      apiKey: process.env.NEWS_API_KEY,
      language: 'en'
    }
  });
  
  if (response.status === 200) {
    return response.data.articles.slice(0, 10);
  } else {
    throw new Error(`Error fetching news: ${response.status}`);
  }
}

async function getSentimentHelper() {
  const response = await axios.get('https://api.alternative.me/fng/');
  
  if (response.status === 200) {
    const data = response.data;
    return {
      fear_greed_value: data.data[0].value,
      fear_greed_class: data.data[0].value_classification,
      timestamp: data.data[0].timestamp
    };
  } else {
    throw new Error('Failed to fetch sentiment data');
  }
}

async function analyzeWithGemini(crypto, marketData, newsData) {
  try {
    const dataStr = marketData.slice(-10).map(row => 
      `${row.timestamp} | Open: ${row.open} | Close: ${row.close} | Volume: ${row.volume}`
    ).join('\n');
    
    const newsStr = newsData.slice(0, 5).map(n => 
      `Title: ${n.title}, Description: ${n.description}`
    ).join('\n');
    
    const prompt = `
      Analyze the following cryptocurrency data for ${crypto}:
      
      Recent price data:
      ${dataStr}
      
      Recent news:
      ${newsStr}
      
      Based on this information, please provide:
      1. A short market analysis
      2. Key factors currently affecting the price
      3. A short-term price prediction (24-48 hours)
      4. Market sentiment assessment
      5. Key resistance and support levels
      
      Return your analysis as a structured JSON with these fields.
    `;
    
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      }
    });
    
    try {
      const textResponse = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(textResponse);
    } catch (e) {
      const jsonMatch = textResponse.match(/{[\s\S]*}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse JSON response" };
    }
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    return {
      market_analysis: "Analysis could not be completed due to an error.",
      key_factors: [],
      price_prediction: "Unavailable",
      sentiment: "Neutral",
      support_resistance: { support: [], resistance: [] }
    };
  }
}

async function analyzeWithDeepseek(crypto, marketData, sentimentData) {
  try {
    const closes = marketData.map(d => d.close);
    
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);
    
    const rsi = calculateRSI(closes);
    
    const techData = marketData.slice(-10).map((row, i) => {
      const index = closes.length - 10 + i;
      return `${row.timestamp} | Close: ${row.close} | SMA20: ${sma20[index] || 'N/A'} | SMA50: ${sma50[index] || 'N/A'} | RSI: ${rsi[index] || 'N/A'}`;
    }).join('\n');
    
    const prompt = `
      Perform a detailed technical analysis for ${crypto} based on the following data:
      
      Technical indicators:
      ${techData}
      
      Market sentiment:
      Fear & Greed Index: ${sentimentData.fear_greed_value} - ${sentimentData.fear_greed_class}
      
      Please analyze:
      1. Current trend direction
      2. Technical indicators assessment
      3. Pattern recognition (if any)
      4. Trading volume analysis
      5. Potential price targets based on technical analysis
      
      Provide your analysis in JSON format with these fields.
    `;
    
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    try {
      const textResponse = response.data.choices[0].message.content;
      return JSON.parse(textResponse);
    } catch (e) {
      const jsonMatch = textResponse.match(/{[\s\S]*}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse JSON response" };
    }
  } catch (error) {
    console.error('Error in DeepSeek analysis:', error);
    return {
      trend_direction: "Unknown",
      technical_assessment: "Analysis failed",
      patterns: [],
      volume_analysis: "No data",
      price_targets: { support: [], resistance: [] }
    };
  }
}

function calculateSMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  return result;
}

function calculateRSI(prices, period = 14) {
    const deltas = [];
    for (let i = 1; i < prices.length; i++) {
      deltas.push(prices[i] - prices[i - 1]);
    }
    
    const gains = deltas.map(d => d > 0 ? d : 0);
    const losses = deltas.map(d => d < 0 ? -d : 0);
    
    const avgGains = [];
    const avgLosses = [];
    
    for (let i = 0; i < gains.length; i++) {
      if (i < period) {
        if (i === period - 1) {
          avgGains.push(gains.slice(0, period).reduce((a, b) => a + b, 0) / period);
          avgLosses.push(losses.slice(0, period).reduce((a, b) => a + b, 0) / period);
        } else {
          avgGains.push(null);
          avgLosses.push(null);
        }
      } else {
        avgGains.push((avgGains[i - 1] * (period - 1) + gains[i]) / period);
        avgLosses.push((avgLosses[i - 1] * (period - 1) + losses[i]) / period);
      }
    }
    
    const rs = [];
    const rsi = [];
    
    for (let i = 0; i < avgGains.length; i++) {
      if (avgGains[i] === null) {
        rs.push(null);
        rsi.push(null);
      } else {
        rs.push(avgGains[i] / (avgLosses[i] === 0 ? 0.01 : avgLosses[i]));
        rsi.push(100 - (100 / (1 + rs[i])));
      }
    }
    
    return [null, ...rsi];
  }
  
  function combineAnalyses(geminiAnalysis, deepseekAnalysis, currentPrice, marketData, symbol) {
    return {
      timestamp: new Date().toISOString(),
      crypto_symbol: symbol,
      current_price: currentPrice,
      market_analysis: {
        fundamental: geminiAnalysis.market_analysis || "No data",
        technical: deepseekAnalysis.technical_assessment || "No data",
        key_factors: geminiAnalysis.key_factors || []
      },
      sentiment: {
        overall: geminiAnalysis.sentiment || "Neutral",
        fear_greed: deepseekAnalysis.market_sentiment?.fear_greed_class || "Unknown"
      },
      price_prediction: {
        short_term: geminiAnalysis.price_prediction || "No prediction",
        trend_direction: deepseekAnalysis.trend_direction || "Unknown",
        support_levels: deepseekAnalysis.price_targets?.support || [],
        resistance_levels: deepseekAnalysis.price_targets?.resistance || []
      },
      technical_indicators: {
        patterns: deepseekAnalysis.patterns || [],
        volume_analysis: deepseekAnalysis.volume_analysis || "No data"
      },
      recommendation: generateRecommendation(geminiAnalysis, deepseekAnalysis)
    };
  }
  
  function generateRecommendation(geminiAnalysis, deepseekAnalysis) {
    const sentiment = geminiAnalysis.sentiment || "Neutral";
    const trend = deepseekAnalysis.trend_direction || "Unknown";
    
    if (["Very Bullish", "Bullish"].includes(sentiment) && trend === "Uptrend") {
      return "Strong Buy";
    } else if (sentiment === "Bullish" && ["Uptrend", "Sideways"].includes(trend)) {
      return "Buy";
    } else if (["Very Bearish", "Bearish"].includes(sentiment) && trend === "Downtrend") {
      return "Strong Sell";
    } else if (sentiment === "Bearish" && ["Downtrend", "Sideways"].includes(trend)) {
      return "Sell";
    } else if (trend === "Sideways" && sentiment === "Neutral") {
      return "Hold";
    } else {
      return "Neutral - Watch for clearer signals";
    }
  }