import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePredictionHistory } from '../hooks/useCryptoData';
import PredictionHistory from '../components/analysis/PredictionHistory';
import Spinner from '../components/ui/Spinner';

const HistoryPage = () => {
  const { symbol } = useParams();
  const { history, loading, error } = usePredictionHistory(symbol);
  
  if (loading) {
    return <Spinner message={`Loading history for ${symbol}...`} />;
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Prediction History for {symbol}</h2>
        <div>
          <Link to={`/analysis/${symbol}`} className="btn btn-outline-primary me-2">
            Current Analysis
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <PredictionHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;