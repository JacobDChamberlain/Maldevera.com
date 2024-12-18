import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const InventoryContext = createContext()

export function useInventory() {
    return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://maldeverawebsite-backend.onrender.com/api/inventory')
    // fetch('http://localhost:5001/api/inventory') //* please set up dev / prod environment and use env vars so i dont have to swap these out every time. please. and remember, start env vars with REACT_APP_<envvarname>
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
      const response = await fetch('https://maldeverawebsite-backend.onrender.com/api/inventory')
      // const response = await fetch('http://localhost:5001/api/inventory')
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