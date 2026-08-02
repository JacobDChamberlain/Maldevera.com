import { createContext, useContext, useState, useEffect, useCallback } from 'react';
const backendBaseURL = process.env.REACT_APP_BACKEND_URL;

const InventoryContext = createContext()

export function useInventory() {
    return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  // `products` (nested variants) drives the storefront.
  // `inventory` (flat, one row per variant) keeps the cart working unchanged.
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [prods, inv] = await Promise.all([
      fetch(`${backendBaseURL}/api/products`).then(response => response.json()),
      fetch(`${backendBaseURL}/api/inventory`).then(response => response.json()),
    ])
    // Guard against error responses (e.g. { success: false, ... }) so a bad
    // fetch can never crash the storefront — worst case it renders empty.
    setProducts(Array.isArray(prods) ? prods : [])
    setInventory(Array.isArray(inv) ? inv : [])
  }, [])

  useEffect(() => {
    load()
      .catch(error => console.error('Error fetching inventory:', error))
      .finally(() => setLoading(false))
  }, [load])

  const refreshInventory = useCallback(async () => {
    setLoading(true)
    try {
      await load()
    } catch (error) {
      console.error('Error refreshing inventory:', error)
    }
    setLoading(false)
  }, [load])

  return (
    <InventoryContext.Provider value={{ products, inventory, loading, refreshInventory }}>
      {children}
    </InventoryContext.Provider>
  )
}
