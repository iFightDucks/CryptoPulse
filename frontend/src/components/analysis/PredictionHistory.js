import React from 'react';

const PredictionHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return <div>No prediction history available</div>;
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Prediction History</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Recommendation</th>
                <th>Sentiment</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item._id}>
                  <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                  <td>${item.currentPrice.toFixed(2)}</td>
                  <td>{item.recommendation}</td>
                  <td>{item.sentiment.overall}</td>
                  <td>{item.pricePrediction.trendDirection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PredictionHistory;