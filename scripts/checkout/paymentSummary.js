import {cart} from '../../data/cart.js';
import { getProductById } from '../../data/products.js';
import {getDeliveryOptionById} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../helpers/currency.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {

    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.cartItems.forEach((cartItem) => {
        const product = getProductById(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforTaxCents * 0.1;
    const totalCents = totalBeforTaxCents + taxCents;

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

    document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

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

        window.location.href = "orders.html";
    });
}