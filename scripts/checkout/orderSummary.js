import {cart} from '../../data/cart.js';
import { getProductById } from '../../data/products.js';
import {formatCurrency} from '../helpers/currency.js';
import {deliveryOptions, getDeliveryOptionById, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

/**
 * Renders the full order summary on the checkout page, including:
 * - Each cart item with delivery info
 * - Quantity editing UI
 * - Delivery option selection
 * - Delete & save actions
 * Also sets up all related event listeners.
 */
export function renderOrderSummary() {
    let orderSummaryHTML = '';

    cart.cartItems.forEach((cartItem) => {

        const productId = cartItem.productId;
        const matchingProduct = getProductById(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOptionById(deliveryOptionId);
        const deliveryDate = calculateDeliveryDate(deliveryOption);

        orderSummaryHTML += `
            <div class="cart-item-container js-cart-item-container
            js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${deliveryDate}
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image"
                    src="${matchingProduct.image}">

                    <div class="cart-item-details">
                    <div class="product-name js-product-name-${matchingProduct.id}">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price js-product-price-${matchingProduct.id}">
                        ${matchingProduct.getPrice()}
                    </div>
                    <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                        <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                        </span>
                        <input class="quantity-input">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
                        Save
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                        Delete
                        </span>
                    </div>
                    </div>

                    <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                        ${deliveryOptionsHTML(matchingProduct.id, cartItem)}
                    </div>
                </div>
            </div>
        `;
    });

/**
   * Generates HTML for all available delivery options for a given product.
   *
   * @param {string} matchingProductId - ID of the product.
   * @param {Object} cartItem - The cart item object containing current deliveryOptionId.
   * @returns {string} - HTML markup for the delivery option selection section.
   */
    function deliveryOptionsHTML(matchingProductId, cartItem) {
        let html = '';
        deliveryOptions.forEach((option) => {
            const deliveryDate = calculateDeliveryDate(option);
            const deliveryPrice = (option.priceCents === 0) ? 'FREE' : `$${formatCurrency(option.priceCents)} - `;

            const isChecked = option.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option js-delivery-option-${matchingProductId}-${option.id}" data-product-id="${matchingProductId}" data-delivery-option-id="${option.id}">
                    <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input js-delivery-option-input-${matchingProductId}-${option.id}"
                    name="delivery-option-${matchingProductId}">
                    <div>
                    <div class="delivery-option-date">
                        ${deliveryDate}
                    </div>
                    <div class="delivery-option-price">
                        ${deliveryPrice} Shipping
                    </div>
                    </div>
                </div>
            `
        });
        return html;
    }

/**
   * Updates the mini-cart quantity display in the header and the checkout summary line.
   */
    function updateCartQuantity() {
        const cartQuantity = cart.calculateCartQuantity();
        document.querySelector(".js-return-to-home-link").innerHTML = `${cartQuantity} ${cartQuantity === 1 ? "item" : "items"}`;
    }

    // Inject compiled HTML into the DOM
    document.querySelector(".js-order-summary").innerHTML = orderSummaryHTML;
    updateCartQuantity();

    // Event: Delete item from cart
    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            cart.deleteFromCart(productId);
            updateCartQuantity();
            renderOrderSummary();
            renderPaymentSummary();
        })
    })

    // Event: Enter quantity edit mode
    document.querySelectorAll(".js-update-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add("is-editing-quantity");

            const previousQuantity = container.querySelector(".quantity-label").innerText.trim();
            container.querySelector(".quantity-input").value = previousQuantity;
        });
    });

    // Event: Save new quantity
    document.querySelectorAll(".js-save-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.remove("is-editing-quantity");

            const quantity = Number(container.querySelector(".quantity-input").value);
            cart.updatequantity(productId, quantity);
            updateCartQuantity();
            container.querySelector(".quantity-label").innerHTML = quantity;
            renderPaymentSummary();
        });
    });

    // Event: Change delivery option
    document.querySelectorAll(".js-delivery-option").forEach((option) => {
        option.addEventListener("click", () => {
            const {productId, deliveryOptionId} = option.dataset
            cart.updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}