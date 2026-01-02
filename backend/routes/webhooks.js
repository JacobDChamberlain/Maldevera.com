const express = require('express');
const { sequelize, Item } = require('../models');
const router = express.Router();

// Helper function to send email via Resend API
async function sendEmail({ from, to, subject, html }) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    return response.json();
}

router.post('/', async (req, res) => {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Parse purchased items from session metadata
            const purchasedItems = JSON.parse(session.metadata.purchasedItems);

            // Update stock in a transaction
            await sequelize.transaction(async (t) => {
                for (const { id, quantity } of purchasedItems) {
                    const item = await Item.findByPk(id, { transaction: t });

                    if (!item) {
                        throw new Error(`Item with ID ${id} not found`);
                    }

                    item.stock -= quantity;
                    await item.save({ transaction: t });
                }
            });

            console.log("Stock successfully updated for purchased items.");

            // Extract customer details and shipping info
            const { name, email, phone } = session.customer_details;
            const { line1, line2, city, state, postal_code, country } = session.customer_details.address;

            // Prepare email content for both Maldevera and Customer
            const purchasedItemsDetails = async (purchasedItems) => {
                let totalPrice = 0;

                const itemDetails = await Promise.all(
                    purchasedItems.map(async ({ id, quantity }) => {
                        const item = await Item.findByPk(id);

                        if (!item) {
                            throw new Error(`Item with ID ${id} not found`);
                        }

                        const itemTotal = parseFloat(item.price) * quantity;
                        totalPrice += itemTotal;

                        return `
                            <tr>
                                <td style='padding: 10px;'>${item.name}</td>
                                <td style='padding: 10px;'><img src='${item.images[0] || "https://via.placeholder.com/100"}' alt='${item.name}' width='100' /></td>
                                <td style='padding: 10px;'>$${parseFloat(item.price).toFixed(2)}</td>
                                <td style='padding: 10px;'>${quantity}</td>
                            </tr>
                        `;
                    })
                );

                return {
                    html: `
                        <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f4f4f4;'>
                                    <th style='padding: 10px; border: 1px solid #ddd;'>Name</th>
                                    <th style='padding: 10px; border: 1px solid #ddd;'>Picture</th>
                                    <th style='padding: 10px; border: 1px solid #ddd;'>Price</th>
                                    <th style='padding: 10px; border: 1px solid #ddd;'>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemDetails.join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style='padding: 10px; text-align: right; font-weight: bold;'>Total Price:</td>
                                    <td style='padding: 10px; font-weight: bold;'>$${totalPrice.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    `,
                    totalPrice
                };
            };

            const { html: purchasedItemsFormattedDetails, totalPrice } = await purchasedItemsDetails(purchasedItems);

            const customerEmailContent = `
                <div style='font-family: Arial, sans-serif; line-height: 1.5; color: #333;'>
                    <h1 style='background-color: #007bff; color: white; padding: 10px;'>Thank You for Your Order!</h1>
                    <p>Hi ${name},</p>
                    <p>Thank you for shopping with Maldevera! Here are the details of your order:</p>

                    <h2>Shipping Address:</h2>
                    <p>${line1}<br/>${line2 || ''}<br/>${city}, ${state} ${postal_code}<br/>${country}</p>

                    <h2>Order Details:</h2>
                    ${purchasedItemsFormattedDetails}

                    <p style='margin-top: 20px;'>We will process and ship your order soon. If you have any questions, feel free to contact us at <a href='mailto:MaldeveraTX@gmail.com'>MaldeveraTX@gmail.com</a>.</p>

                    <p>Thank you for supporting Maldevera!</p>
                    <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
                    <footer style='margin-top: 20px; font-size: 0.9em; color: #666;'>
                        <p>Maldevera Merch Store<br/>Dallas/New Orleans</p>
                    </footer>
                </div>
            `;

            // Send email to Customer via Resend
            await sendEmail({
                from: 'Maldevera Merch Store <orders@maldevera.com>',
                to: email,
                subject: 'Order Confirmation - Maldevera Merch Store',
                html: customerEmailContent,
            });

            console.log(`Email successfully sent to customer: ${email}`);

            // Send email to Maldevera
            const maldeveraEmailContent = `
                <h1>New Purchase Notification</h1>
                <h2>Customer Info:</h2>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
                </ul>
                <h2>Shipping Address:</h2>
                <p>${line1}<br/>${line2 || ''}<br/>${city}, ${state} ${postal_code}<br/>${country}</p>
                <h2>Purchased Items:</h2>
                ${purchasedItemsFormattedDetails}
            `;

            await sendEmail({
                from: 'Maldevera Merch Store <orders@maldevera.com>',
                to: 'MaldeveraTX@gmail.com',
                subject: 'New Merch Purchase - Order Details',
                html: maldeveraEmailContent,
            });

            console.log("Email successfully sent to MaldeveraTX@gmail.com");

        } catch (error) {
            console.error('Error updating stock or sending emails:', error);
        }
    }

    return res.json({ received: true });
});

module.exports = router;
