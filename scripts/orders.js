import {getProductById, loadProducts} from '../data/products.js';
import {orders} from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from './helpers/currency.js';
import {cart} from '../data/cart.js';

/**
 * Initializes the orders page by:
 * - Loading product data
 * - Rendering a summary of each past order (date, total, ID)
 * - Rendering order line items (products, delivery date, quantity, actions)
 * - Binding "Buy Again" and "Track Package" interactions
 */
async function loadPage() {
    await loadProducts();

    let ordersHTML = '';

    orders.forEach((order) => {
        const orderDate = dayjs(order.orderTime).format('MMMM D');

        ordersHTML += `
            <div class="order-container">
                <div class="order-header">
                <div class="order-header-left-section">
                    <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${orderDate}</div>
                    </div>
                    <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formatCurrency(order.totalCostCents)}</div>
                    </div>
                </div>
                <div class="order-header-right-section">
                    <div class="order-header-label">Order ID:</div>
                    <div>${order.id}</div>
                </div>
                </div>
                <div class="order-details-grid">
                ${productsListHTML(order)}
                </div>
            </div>
        `;
    });

    /**
     * Generates the HTML block for all products in a given order.
     *
     * @param {Object} order - The order object containing product details.
     * @returns {string} - HTML representing product cards in the order.
     */
    function productsListHTML(order) {
        let productsListHTML = '';

        order.products.forEach((productDetails) => {
            const product = getProductById(productDetails.productId);

            productsListHTML += `
                <div class="product-image-container">
                <img src="${product.image}">
                </div>
                <div class="product-details">
                <div class="product-name">
                    ${product.name}
                </div>
                <div class="product-delivery-date">
                    Arriving on: ${
                    dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')
                    }
                </div>
                <div class="product-quantity">
                    Quantity: ${productDetails.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again" data-product-id=${productDetails.productId} data-product-quantity=${productDetails.quantity}>
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                </button>
                </div>
                <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                    <button class="track-package-button button-secondary">
                    Track package
                    </button>
                </a>
                </div>
            `;
        });

        return productsListHTML;
    }

    // Inject final HTML
    document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
    cart.updateCartQuantity();

    /**
     * Event: Handle Buy Again buttons – adds item to cart and updates UI.
     */
    document.querySelectorAll('.js-buy-again').forEach((button) => {
        button.addEventListener('click', () => {
        cart.addToCart(button.dataset.productId, Number(button.dataset.productQuantity));
        cart.updateCartQuantity();

        // Visual feedback
        button.innerHTML = 'Added';
        setTimeout(() => {
            button.innerHTML = `
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
            `;
        }, 1000);
        });
    });
}

loadPage();