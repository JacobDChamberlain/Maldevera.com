import React, { useState } from "react";
import formatCurrency from "../../../../utilities/formatCurrency";
import './StoreItem.css';
import { useMerchCart } from "../../../../context/MerchCartContext";
import { Button, Modal } from "react-bootstrap";

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function StoreItem({ product }) {
    const { getItemQuantity, increaseItemQuantity } = useMerchCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [itemAdded, setItemAdded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const variants = product.variants || [];

    // A product is "sized" when its variants carry sizes. Non-sized products
    // (CDs, patches, …) have a single size-less variant.
    const hasSizes = variants.some(v => v.size);

    // size -> stock, straight from the variant data (no more name-splitting)
    const availableSizes = variants.reduce((sizes, v) => {
        if (v.size) sizes[v.size] = v.stock;
        return sizes;
    }, {});

    const sortedSizes = Object.keys(availableSizes).sort(
        (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
    );

    // Whole product is sold out when every variant has no stock.
    const isSoldOut = variants.length === 0 || variants.every(v => v.stock === 0);

    // Price: single price when all variants agree, otherwise "from $X".
    const prices = variants.map(v => Number(v.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const priceVaries = prices.some(p => p !== minPrice);

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
        setItemAdded(false);
    };

    const flashAdded = () => {
        setItemAdded(true);
        setTimeout(() => setItemAdded(false), 1000);
    };

    const handleAddToCart = () => {
        if (hasSizes) {
            if (!selectedSize) {
                setAlertMessage("Please select a size");
                setShowAlert(true);
                return;
            }
            const variant = variants.find(v => v.size === selectedSize);
            if (variant && variant.stock > 0 && getItemQuantity(variant.id, selectedSize) + 1 <= variant.stock) {
                increaseItemQuantity(variant.id, selectedSize);
                flashAdded();
            } else {
                setAlertMessage("Selected size is out of stock");
                setShowAlert(true);
            }
        } else {
            const variant = variants[0];
            if (variant && variant.stock > 0 && getItemQuantity(variant.id, null) + 1 <= variant.stock) {
                increaseItemQuantity(variant.id, null);
                flashAdded();
            } else {
                setAlertMessage("This item is out of stock");
                setShowAlert(true);
            }
        }
    };

    return (
        <div className="store-item-wrapper">
            <img className="store-item-image" src={product.images[0]} alt={product.name} />
            <div className="store-item-info">
                <div className="store-item-name">{product.name.toUpperCase()}</div>
                <div className="store-item-price">
                    {priceVaries ? `from ${formatCurrency(minPrice)}` : formatCurrency(minPrice)}
                </div>

                {isSoldOut && <div className="store-item-soldout">Sold Out</div>}

                {/* Size selection dropdown (only if the product has sizes and stock remains) */}
                {hasSizes && !isSoldOut && (
                    <div className="store-item-sizes">
                        <select
                            id={`size-select-${product.id}`}
                            value={selectedSize}
                            onChange={handleSizeChange}
                            className="size-select"
                        >
                            <option value="">🤘Select Size🤘</option>
                            {sortedSizes.map((size) => (
                                <option key={size} value={size} disabled={availableSizes[size] === 0}>
                                    {size.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Add to cart button with feedback */}
                <button
                    style={{
                        border: "none",
                        borderRadius: "20px",
                        cursor: isSoldOut ? "not-allowed" : "pointer",
                        backgroundColor: itemAdded ? "lightgreen" : "white",
                        animation: itemAdded ? "bounce 0.3s ease" : "none"
                    }}
                    onClick={handleAddToCart}
                    disabled={itemAdded || isSoldOut}
                >
                    {isSoldOut ? "Sold Out" : itemAdded ? "Item Added!" : "+ Add To Cart"}
                </button>
            </div>

            <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Jeff says...</Modal.Title>
                </Modal.Header>
                <Modal.Body>{alertMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
