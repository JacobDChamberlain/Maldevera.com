import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutSuccess.css';

const SuccessfulPurchase = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/merch'); // Navigate to the homepage or desired route
  };

  return (
    <div className='success-purchase-wrapper'>
      <div style={styles.container}>
        <h1 style={styles.title}>Thank You for Your Purchase!</h1>
        <p style={styles.subtitle}>Your transaction was successful. 🎉</p>

        <button onClick={handleContinueShopping} style={styles.button}>
          Continue Shopping
        </button>
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
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: '16px',
    margin: '10px 0',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default SuccessfulPurchase;
