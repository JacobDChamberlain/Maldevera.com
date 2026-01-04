import React, { useEffect, useState } from 'react';
import Login from '../../Login/Login'; //* move ALL OF STOCK DISPLAY into a component, and show either Login or Stock based on presence of token.
import './CurrentStock.css';

const CurrentStock = () => {
  const [inventory, setInventory] = useState([]);
  const [localInventory, setLocalInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));


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
        setLocalInventory(data); // Initialize localInventory with fetched data
      } catch (err) {
        setError('Error fetching inventory data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [backendBaseURL]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  const handleCancel = () => {
    setLocalInventory(inventory); // Reset localInventory to original data
    setIsEditing(false); // Exit edit mode
  };

  const incrementStock = (id) => {
    setLocalInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: item.stock + 1 } : item
      )
    );
  };

  const decrementStock = (id) => {
    setLocalInventory((prev) =>
      prev.map((item) =>
        item.id === id && item.stock > 0
          ? { ...item, stock: item.stock - 1 }
          : item
      )
    );
  };

  const handleStockChange = (id, value) => {
    const newStock = parseInt(value, 10) || 0;
    setLocalInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
    );
  };

  const handleSave = async () => {
    // Create an object with only the changed items
    const updatedStock = localInventory.reduce((acc, item) => {
      const originalItem = inventory.find((invItem) => invItem.id === item.id);
      if (originalItem && originalItem.stock !== item.stock) {
        acc[item.id] = item.stock;
      }
      return acc;
    }, {});

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendBaseURL}/api/inventory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedStock),
      });
      if (!response.ok) {
        throw new Error('Failed to update inventory.');
      }
      setInventory(localInventory); // Sync with updated data
      setIsEditing(false);
    } catch (err) {
      setError('Error updating inventory.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }


  return (
    !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> :
    <div className="container py-4 current-stock-container">
      <h1 className="text-center mb-4">Current Stock</h1>
      <div className="text-end mb-3">
        {isEditing ? (
          <>
            <button className="btn btn-secondary me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-warning" onClick={handleLogout}>
              Logout
            </button>
            <button className="btn btn-primary" onClick={handleEditToggle}>
              Edit Stock
            </button>
          </>

        )}
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Item Name</th>
              <th className="text-center">Stock</th>
            </tr>
          </thead>
          <tbody>
            {localInventory
              .sort((a, b) => a.id - b.id)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="text-center">
                    {isEditing ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => decrementStock(item.id)}
                        >
                          -
                        </button>
                        <input
                          className="form-control form-control-sm text-center"
                          type="number"
                          style={{ width: '60px' }}
                          value={item.stock}
                          onChange={(e) =>
                            handleStockChange(item.id, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => incrementStock(item.id)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      item.stock
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentStock;