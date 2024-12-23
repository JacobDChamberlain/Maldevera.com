import { Offcanvas, Stack, Modal, Button } from "react-bootstrap";
import { useMerchCart } from "../../context/MerchCartContext";
import { CartItem } from "../CartItem/CartItem";
import './MerchCart.css';
import formatCurrency from "../../utilities/formatCurrency";
import { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import CustomerInfoForm from "../CustomerInfoForm/CustomerInfoForm";
const backendBaseURL = process.env.REACT_APP_BACKEND_URL;

export function MerchCart({ isOpen }) {
    const { closeCart, cartItems, clearCart, increaseItemQuantity, decreaseItemQuantity } = useMerchCart();
    const { inventory } = useInventory();
    const [merchItems, setMerchItems] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showForm, setShowForm] = useState(false); // Toggle between cart and form

    // Fetch the inventory data from the backend
    useEffect(() => {
        if (inventory) setMerchItems(inventory);
    }, [inventory]);

    const handlePurchase = (customerInfo) => {
        const itemsToPurchase = cartItems.map(({ id, quantity }) => ({
            id,
            quantity
        }));

        const payload = {
            items: itemsToPurchase,
            customerInfo,
        };

        fetch(`${backendBaseURL}/api/checkout/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                if (data.url) {
                    clearCart();
                    window.location.href = data.url;
                }
            })
            .catch(err => {
                console.error('Error from frontend handlePurchase: ', err);
                setAlertMessage("An error occurred. Please try again.");
                setShowAlert(true);
            });
    };

    const handleFormSubmit = (formData) => {
        handlePurchase(formData);
    };

    return (
        <>
            <Offcanvas show={isOpen} onHide={closeCart} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {showForm ? (
                        <CustomerInfoForm onSubmit={handleFormSubmit} />
                    ) : (
                        <Stack gap={3}>
                            {cartItems.map((item) => (
                                <CartItem
                                    key={`${item.id}-${item.size}`}
                                    {...item}
                                    merchItems={merchItems}
                                    increaseQuantity={() => increaseItemQuantity(item.id, item.size)}
                                    decreaseQuantity={() => decreaseItemQuantity(item.id, item.size)}
                                />
                            ))}
                            <div className="ms-auto fw-bold fs-5">
                                Total{" "}
                                {formatCurrency(
                                    cartItems.reduce((total, cartItem) => {
                                        const item = merchItems.find(i => i.id === cartItem.id);
                                        return total + (item?.price || 0) * cartItem.quantity;
                                    }, 0)
                                )}
                            </div>
                            <button
                                className="btn btn-primary w-100 mt-3"
                                onClick={() => setShowForm(true)} // Show the form when Purchase is clicked
                                disabled={cartItems.length === 0}
                            >
                                Purchase
                            </button>
                            <div className="ms-auto fs-5">
                                Page Under Construction
                                <div className="ms-auto fs-6">
                                    For all merch & size inquiries, please message us on Instagram @maldevera, or any social media platform.
                                </div>
                            </div>
                        </Stack>
                    )}
                </Offcanvas.Body>
            </Offcanvas>

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
        </>
    );
}
