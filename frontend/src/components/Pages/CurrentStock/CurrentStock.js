import React, { useEffect, useState } from 'react';
import './CurrentStock.css';

const CurrentStock = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendBaseURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${backendBaseURL}/api/inventory`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInventory(data);
      } catch (err) {
        setError('Error fetching inventory data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='stock-wrapper'>
      <div style={styles.container}>
            <h1 style={styles.header}>Current Stock</h1>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.cell}>Item Name</th>
                    <th style={styles.cell}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory
                    .sort((a, b) => a.id - b.id)
                    .map((item) => (
                      <tr key={item.id}>
                        <td style={styles.cell}>{item.name}</td>
                        <td style={styles.cell}>{item.stock}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '16px',
    position: 'fixed', // Ensures it stays fixed relative to the viewport
    bottom: '30px', // Position from the bottom of the viewport
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)', // Exact centering
    background: 'rgba(255, 255, 255, 0.9)', // Slightly opaque white
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
    backdropFilter: 'blur(10px)', // Glassy effect for modern browsers
    WebkitBackdropFilter: 'blur(10px)', // Safari compatibility
    overflow: 'hidden', // Prevent content from spilling out
  },
  header: {
    textAlign: 'center',
    fontSize: '1.5rem',
    marginBottom: '16px',
    color: '#333', // Ensures readability
  },
  tableWrapper: {
    maxHeight: '300px', // Prevents the table from overflowing the container
    overflowY: 'auto', // Adds vertical scrolling for long lists
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  cell: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    padding: '8px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    color: '#333', // Keeps text readable
  },
};

export default CurrentStock;
