import React, { useCallback, useEffect, useState } from 'react';
import Login from '../../Login/Login';
import AdminProduct from './AdminProduct';
import './ManageStore.css';

const backendBaseURL = process.env.REACT_APP_BACKEND_URL;
const CATEGORIES = ['clothing', 'music', 'accessory'];
const EMPTY_DRAFT = { name: '', category: 'clothing', description: '', images: '' };

export default function ManageStore() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [draft, setDraft] = useState(EMPTY_DRAFT);
    const [adding, setAdding] = useState(false);

    // Wraps fetch with the auth header and centralised 401 handling.
    const authFetch = useCallback(async (path, options = {}) => {
        const res = await fetch(`${backendBaseURL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                ...(options.headers || {}),
            },
        });
        if (res.status === 401) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            throw new Error('Session expired — please log in again.');
        }
        return res;
    }, []);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/admin/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
            setError(null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        if (isLoggedIn) loadProducts();
    }, [isLoggedIn, loadProducts]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!draft.name.trim()) {
            setError('Name is required');
            return;
        }
        setAdding(true);
        setError(null);
        try {
            const images = draft.images
                .split('\n')
                .map(s => s.trim())
                .filter(Boolean);
            const res = await authFetch('/api/admin/products', {
                method: 'POST',
                body: JSON.stringify({
                    name: draft.name,
                    category: draft.category,
                    description: draft.description,
                    images,
                }),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || 'Failed to add product');
            }
            setDraft(EMPTY_DRAFT);
            await loadProducts();
        } catch (e) {
            setError(e.message);
        } finally {
            setAdding(false);
        }
    };

    if (!isLoggedIn) {
        return <Login setIsLoggedIn={setIsLoggedIn} />;
    }

    return (
        <div className="container py-4 manage-store">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="m-0">Manage Store</h1>
                <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Add a product</h5>
                    <form onSubmit={handleAddProduct} className="row g-2">
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Name"
                                value={draft.name}
                                onChange={e => setDraft({ ...draft, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={draft.category}
                                onChange={e => setDraft({ ...draft, category: e.target.value })}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-md-5">
                            <input
                                className="form-control"
                                placeholder="Description"
                                value={draft.description}
                                onChange={e => setDraft({ ...draft, description: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <textarea
                                className="form-control"
                                rows="2"
                                placeholder="Image URL(s) — one per line"
                                value={draft.images}
                                onChange={e => setDraft({ ...draft, images: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" type="submit" disabled={adding}>
                                {adding ? 'Adding…' : '+ Add Product'}
                            </button>
                            <small className="text-muted ms-2">Add sizes &amp; prices after creating it below.</small>
                        </div>
                    </form>
                </div>
            </div>

            {loading ? (
                <div>Loading…</div>
            ) : products.length === 0 ? (
                <div className="text-muted">No products yet.</div>
            ) : (
                products.map(product => (
                    <AdminProduct
                        key={product.id}
                        product={product}
                        authFetch={authFetch}
                        onChanged={loadProducts}
                        categories={CATEGORIES}
                    />
                ))
            )}
        </div>
    );
}
