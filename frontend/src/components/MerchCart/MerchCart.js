import { Offcanvas, Stack, Modal, Button } from "react-bootstrap";
import { useMerchCart } from "../../context/MerchCartContext";
import { CartItem } from "../CartItem/CartItem";
import './MerchCart.css';
import formatCurrency from "../../utilities/formatCurrency";
import { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";

const backendBaseURL = process.env.REACT_APP_BACKEND_URL;

export function MerchCart({ isOpen }) {
    const { closeCart, cartItems, clearCart, increaseItemQuantity, decreaseItemQuantity } = useMerchCart();
    const { inventory } = useInventory();
    const [merchItems, setMerchItems] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Fetch the inventory data from the backend
    useEffect(() => {
        if (inventory) setMerchItems(inventory);
    }, [inventory]);

    const handlePurchase = () => {
        const itemsToPurchase = cartItems.map(({ id, quantity }) => ({
            id,
            quantity,
        }));

        const payload = itemsToPurchase;

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
                    window.location.href = data.url; // Redirect to Stripe's checkout page
                }
            })
            .catch(err => {
                console.error('Error from frontend handlePurchase: ', err);
                setAlertMessage("An error occurred. Please try again.");
                setShowAlert(true);
            });
    };

    return (
        <>
            <Offcanvas show={isOpen} onHide={closeCart} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
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
                            onClick={handlePurchase} // Directly call handlePurchase
                            disabled={cartItems.length === 0}
                        >
                            Purchase
                        </button>
                        {/* <div className="ms-auto fs-5">
                            Page Under Construction
                            <div className="ms-auto fs-6">
                                For all merch & size inquiries, please message us on Instagram @maldevera, or any social media platform.
                            </div>
                        </div> */}
                        <div className="ms-auto fs-6" style={{ fontStyle: "italic", fontSize: "smaller", color: "grey" }}>
                            Taste the corners of your wallet...
                        </div>

                    </Stack>
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
