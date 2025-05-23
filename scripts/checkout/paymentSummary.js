import {cart} from '../../data/cart.js';
import { getProductById } from '../../data/products.js';
import {getDeliveryOptionById} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../helpers/currency.js';
import { addOrder } from '../../data/orders.js';

/**
 * Renders the payment summary sidebar on the checkout page.
 * Calculates subtotal, shipping cost, estimated tax, and total,
 * and displays them in a structured format.
 * 
 * Also handles the "Place your order" button logic:
 * - Sends order to backend
 * - Stores order locally
 * - Resets the cart
 * - Redirects to the orders page
 */
export function renderPaymentSummary() {

    let productPriceCents = 0;
    let shippingPriceCents = 0;

    // Calculate total product and shipping cost
    cart.cartItems.forEach((cartItem) => {
        const product = getProductById(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforTaxCents * 0.1;
    const totalCents = totalBeforTaxCents + taxCents;

    // Generate the HTML for the payment summary
    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${cart.calculateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-shipping-price">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-total-price">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
            Place your order
        </button>
    `

    // Inject HTML into the DOM
    document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

    // Event listener: submit order and redirect
    document.querySelector(".js-place-order").addEventListener("click", async () => {
        try {
            const response = await fetch("https://supersimplebackend.dev/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cart: cart.cartItems
                })
            });


            const order = await response.json();
            addOrder(order);
        } catch(error) {
            console.log("An error occurred while creating an order!");
        }

        // Clear cart and redirect
        cart.resetCart();
        window.location.href = "orders.html";
    });
}