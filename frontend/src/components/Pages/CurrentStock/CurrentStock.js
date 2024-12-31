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
  }, [backendBaseURL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='stock-wrapper'>
      <div className='stock-container'>
        <h1 className='stock-header'>Current Stock</h1>
        <div className='table-wrapper'>
          <table className='stock-table'>
            <thead>
              <tr>
                <th className='stock-cell'>Item Name</th>
                <th className='stock-cell'>Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventory
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <tr key={item.id}>
                    <td className='stock-cell'>{item.name}</td>
                    <td className='stock-cell'>{item.stock}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurrentStock;