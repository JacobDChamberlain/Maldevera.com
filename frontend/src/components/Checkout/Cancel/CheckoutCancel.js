import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutCancel.css';

const FailedPurchase = () => {
  const navigate = useNavigate();

  const handleGoToMerch = () => {
    navigate('/merch'); // Navigate to the Merch page or desired route
  };

  // const handleRetry = () => {
  //   console.log('Retry payment'); // Placeholder for retry functionality
  // };

  return (
    <div className='cancel-purchase-wrapper'>
      <div style={styles.container}>
        <h1 style={styles.title}>Purchase Failed</h1>
        <p style={styles.subtitle}>We're sorry, but your transaction could not be completed. 😞</p>

        <div style={styles.actions}>
          {/* <button onClick={handleRetry} style={styles.retryButton}>
            Retry Payment
          </button> */}
          <button onClick={handleGoToMerch} style={styles.cartButton}>
            Merch Page
          </button>
        </div>
      </div>
    </div>
  );
};

// Default styles for the component
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: '24px',
    color: '#f44336',
  },
  subtitle: {
    fontSize: '16px',
    margin: '10px 0',
  },
  actions: {
    marginTop: '20px',
  },
  retryButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#2196f3',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cartButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default FailedPurchase;
