import React, { useState } from 'react';

// A single editable variant row (size / price / stock, plus enable + delete).
function AdminVariant({ variant, authFetch, onChanged }) {
    const [size, setSize] = useState(variant.size || '');
    const [price, setPrice] = useState(String(variant.price));
    const [stock, setStock] = useState(String(variant.stock));
    const [err, setErr] = useState(null);

    const dirty =
        (size || '') !== (variant.size || '') ||
        price !== String(variant.price) ||
        stock !== String(variant.stock);

    const call = async (options) => {
        setErr(null);
        const res = await authFetch(`/api/admin/variants/${variant.id}`, options);
        if (!res.ok) {
            const d = await res.json();
            throw new Error(d.message || 'Failed');
        }
        await onChanged();
    };

    const save = async () => {
        try {
            await call({
                method: 'PUT',
                body: JSON.stringify({ size: size || null, price, stock: parseInt(stock, 10) || 0 }),
            });
        } catch (e) { setErr(e.message); }
    };

    const toggleActive = async () => {
        try {
            await call({ method: 'PUT', body: JSON.stringify({ active: !variant.active }) });
        } catch (e) { setErr(e.message); }
    };

    const del = async () => {
        if (!window.confirm('Delete this size?')) return;
        try {
            await call({ method: 'DELETE' });
        } catch (e) { setErr(e.message); }
    };

    return (
        <tr className={variant.active ? '' : 'table-secondary text-muted'}>
            <td>
                <input
                    className="form-control form-control-sm"
                    style={{ width: '80px' }}
                    value={size}
                    placeholder="—"
                    onChange={e => setSize(e.target.value)}
                />
            </td>
            <td>
                <input
                    className="form-control form-control-sm"
                    style={{ width: '90px' }}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
            </td>
            <td>
                <input
                    className="form-control form-control-sm"
                    style={{ width: '70px' }}
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                />
            </td>
            <td>
                {dirty ? (
                    <button className="btn btn-sm btn-success" onClick={save}>Save</button>
                ) : (
                    <button className="btn btn-sm btn-outline-secondary" onClick={toggleActive}>
                        {variant.active ? 'Disable' : 'Enable'}
                    </button>
                )}
            </td>
            <td>
                <button className="btn btn-sm btn-outline-danger" onClick={del} title="Delete size">✕</button>
                {err && <span className="text-danger small ms-1">{err}</span>}
            </td>
        </tr>
    );
}

// A product card: editable name/category/description, hide/unhide, delete,
// and its variants table with an add-size row.
export default function AdminProduct({ product, authFetch, onChanged, categories }) {
    const [name, setName] = useState(product.name);
    const [category, setCategory] = useState(product.category);
    const [description, setDescription] = useState(product.description || '');
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState(null);
    const [newVariant, setNewVariant] = useState({ size: '', price: '', stock: '' });

    const dirty =
        name !== product.name ||
        category !== product.category ||
        (description || '') !== (product.description || '');

    const call = async (path, options) => {
        setErr(null);
        const res = await authFetch(path, options);
        if (!res.ok) {
            const d = await res.json();
            throw new Error(d.message || 'Failed');
        }
        await onChanged();
    };

    const saveProduct = async () => {
        setSaving(true);
        try {
            await call(`/api/admin/products/${product.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, category, description }),
            });
        } catch (e) { setErr(e.message); }
        finally { setSaving(false); }
    };

    const toggleActive = async () => {
        try {
            await call(`/api/admin/products/${product.id}`, {
                method: 'PUT',
                body: JSON.stringify({ active: !product.active }),
            });
        } catch (e) { setErr(e.message); }
    };

    const deleteProduct = async () => {
        if (!window.confirm(`Delete "${product.name}" and all its sizes? This cannot be undone.`)) return;
        try {
            await call(`/api/admin/products/${product.id}`, { method: 'DELETE' });
        } catch (e) { setErr(e.message); }
    };

    const addVariant = async () => {
        try {
            await call(`/api/admin/products/${product.id}/variants`, {
                method: 'POST',
                body: JSON.stringify({
                    size: newVariant.size || null,
                    price: newVariant.price,
                    stock: parseInt(newVariant.stock, 10) || 0,
                }),
            });
            setNewVariant({ size: '', price: '', stock: '' });
        } catch (e) { setErr(e.message); }
    };

    return (
        <div className={`card mb-3 admin-product ${product.active ? '' : 'admin-product-hidden'}`}>
            <div className="card-body">
                {err && <div className="alert alert-danger py-1">{err}</div>}

                <div className="row g-2 align-items-center mb-2">
                    <div className="col-auto">
                        {product.images && product.images[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="admin-noimg" />
                        )}
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="col text-end">
                        {!product.active && <span className="badge bg-secondary me-2">Hidden</span>}
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={toggleActive}>
                            {product.active ? 'Hide' : 'Unhide'}
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={deleteProduct}>Delete</button>
                    </div>
                </div>

                <input
                    className="form-control mb-2"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                {dirty && (
                    <button className="btn btn-sm btn-success mb-2" onClick={saveProduct} disabled={saving}>
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                )}

                <table className="table table-sm align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.variants.map(v => (
                            <AdminVariant key={v.id} variant={v} authFetch={authFetch} onChanged={onChanged} />
                        ))}
                        <tr>
                            <td>
                                <input
                                    className="form-control form-control-sm"
                                    style={{ width: '80px' }}
                                    placeholder="—"
                                    value={newVariant.size}
                                    onChange={e => setNewVariant({ ...newVariant, size: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    className="form-control form-control-sm"
                                    style={{ width: '90px' }}
                                    placeholder="0.00"
                                    value={newVariant.price}
                                    onChange={e => setNewVariant({ ...newVariant, price: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    className="form-control form-control-sm"
                                    style={{ width: '70px' }}
                                    placeholder="0"
                                    value={newVariant.stock}
                                    onChange={e => setNewVariant({ ...newVariant, stock: e.target.value })}
                                />
                            </td>
                            <td colSpan="2">
                                <button className="btn btn-sm btn-outline-primary" onClick={addVariant}>+ Add size</button>
                                <small className="text-muted ms-2">Leave size blank for one-size items.</small>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
