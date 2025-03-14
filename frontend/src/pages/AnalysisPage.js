import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCryptoData, useCryptoAnalysis } from '../hooks/useCryptoData';
import PriceChart from '../components/charts/PriceChart';
import AnalysisSummary from '../components/analysis/AnalysisSummary';
import Spinner from '../components/ui/Spinner';

const AnalysisPage = () => {
  const { symbol } = useParams();
  const { marketData, loading: loadingData } = useCryptoData(symbol);
  const { analysis, loading: loadingAnalysis, error } = useCryptoAnalysis(symbol);
  
  if (loadingData || loadingAnalysis) {
    return <Spinner message={`Analyzing ${symbol}...`} />;
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
        <h2>Analysis for {symbol}</h2>
        <div>
          <Link to={`/history/${symbol}`} className="btn btn-outline-primary me-2">
            View History
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <PriceChart marketData={marketData} />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Key Stats</h5>
            </div>
            <div className="card-body">
              {marketData.length > 0 && (
                <>
                  <div className="mb-2">
                    <strong>Current Price:</strong> ${marketData[marketData.length - 1].close.toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>24h High:</strong> ${Math.max(...marketData.slice(-2).map(d => d.high)).toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>24h Low:</strong> ${Math.min(...marketData.slice(-2).map(d => d.low)).toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>24h Volume:</strong> ${marketData[marketData.length - 1].volume.toFixed(2)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <AnalysisSummary analysis={analysis} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;