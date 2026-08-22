import { useState } from "react";
import { useMerchCart } from "../../../context/MerchCartContext";

export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// Shared size/stock/add-to-cart logic for a single product, used by both the
// grid StoreItem and the 3D booth's ProductDetail. Keeps one source of truth so
// the two views can never drift on how a variant gets added to the cart.
export function useProductPurchase(product) {
    const { getItemQuantity, increaseItemQuantity } = useMerchCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [itemAdded, setItemAdded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const variants = product.variants || [];

    // A product is "sized" when its variants carry sizes. Non-sized products
    // (CDs, patches, …) have a single size-less variant.
    const hasSizes = variants.some(v => v.size);

    // size -> stock, straight from the variant data (no name-splitting)
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

    return {
        variants,
        hasSizes,
        availableSizes,
        sortedSizes,
        isSoldOut,
        minPrice,
        priceVaries,
        selectedSize,
        setSelectedSize,
        handleSizeChange,
        itemAdded,
        showAlert,
        setShowAlert,
        alertMessage,
        handleAddToCart,
    };
}
