import React from 'react';

const AnalysisSummary = ({ analysis }) => {
  if (!analysis) return <div>No analysis data available</div>;
  
  const recommendationClass = () => {
    const rec = analysis.recommendation;
    if (rec.includes('Strong Buy')) return 'text-success fw-bold';
    if (rec.includes('Buy')) return 'text-success';
    if (rec.includes('Strong Sell')) return 'text-danger fw-bold';
    if (rec.includes('Sell')) return 'text-danger';
    if (rec.includes('Hold')) return 'text-warning';
    return 'text-secondary';
  };
  
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Analysis Summary for {analysis.crypto_symbol}</h5>
        <span className="badge bg-primary">${analysis.current_price.toFixed(2)}</span>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <h6>Recommendation</h6>
          <p className={recommendationClass()}>{analysis.recommendation}</p>
        </div>
        
        <div className="mb-3">
          <h6>Market Analysis</h6>
          <p>{analysis.market_analysis.fundamental}</p>
        </div>
        
        <div className="mb-3">
          <h6>Technical Analysis</h6>
          <p>{analysis.market_analysis.technical}</p>
        </div>
        
        <div className="mb-3">
          <h6>Key Factors</h6>
          <ul>
            {analysis.market_analysis.key_factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <h6>Price Prediction</h6>
            <p>{analysis.price_prediction.short_term}</p>
            <p><strong>Trend:</strong> {analysis.price_prediction.trend_direction}</p>
          </div>
          
          <div className="col-md-6 mb-3">
            <h6>Sentiment</h6>
            <p><strong>Overall:</strong> {analysis.sentiment.overall}</p>
            <p><strong>Fear & Greed:</strong> {analysis.sentiment.fear_greed}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <h6>Support & Resistance Levels</h6>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Support:</strong> {analysis.price_prediction.support_levels.join(', ') || 'None identified'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Resistance:</strong> {analysis.price_prediction.resistance_levels.join(', ') || 'None identified'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer text-muted">
        Analysis generated on {new Date(analysis.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default AnalysisSummary;