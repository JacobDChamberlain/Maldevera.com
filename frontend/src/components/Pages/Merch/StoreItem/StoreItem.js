import React from "react";
import formatCurrency from "../../../../utilities/formatCurrency";
import './StoreItem.css';
import { useProductPurchase } from "../useProductPurchase";
import { Button, Modal } from "react-bootstrap";

export default function StoreItem({ product }) {
    const {
        hasSizes,
        availableSizes,
        sortedSizes,
        isSoldOut,
        minPrice,
        priceVaries,
        selectedSize,
        handleSizeChange,
        itemAdded,
        showAlert,
        setShowAlert,
        alertMessage,
        handleAddToCart,
    } = useProductPurchase(product);

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
