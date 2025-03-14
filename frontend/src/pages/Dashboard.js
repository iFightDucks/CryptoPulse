import React from 'react';
import CryptoSelector from '../components/dashboard/CryptoSelector';

const Dashboard = () => {
  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1>Cryptocurrency AI Analysis Platform</h1>
        <p className="lead">
          Get AI-powered analysis and predictions for cryptocurrency markets using 
          advanced machine learning models.
        </p>
      </div>
      
      <div className="row">
        <div className="col-md-8 mx-auto">
          <CryptoSelector />
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Market Analysis</h5>
              <p className="card-text">
                Our platform analyzes market data using multiple AI models to provide comprehensive insights.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Technical Indicators</h5>
              <p className="card-text">
                Get support/resistance levels, trend analysis, and pattern recognition from our technical analysis.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">News & Sentiment</h5>
              <p className="card-text">
                Incorporate latest news and market sentiment to understand what's driving price action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;