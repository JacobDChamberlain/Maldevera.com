import { createContext, useContext, useState, useEffect, useCallback } from 'react';
const backendBaseURL = process.env.REACT_APP_BACKEND_URL;

const InventoryContext = createContext()

export function useInventory() {
    return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${backendBaseURL}/api/inventory`)
      .then(response => response.json())
      .then(data => {
        setInventory(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching inventory:', error)
        setLoading(false)
      })
  }, [])

  const refreshInventory = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${backendBaseURL}/api/inventory`)
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error('Error refreshing inventory:', error)
    }
    setLoading(false)
  }, [])

  return (
    <InventoryContext.Provider value={{ inventory, loading, refreshInventory }}>
      {children}
    </InventoryContext.Provider>
  )
}