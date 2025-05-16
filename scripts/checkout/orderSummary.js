import {updateProductQuantity, calculateCartQuantity, cart, deleteFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products, getProductById} from '../../data/products.js';
import {formatCurrency} from '../helpers/currency.js';
import {deliveryOptions, getDeliveryOptionById} from '../../data/deliveryOptions.js';
import  dayjs from 'https://unpkg.com/dayjs@1.11.9/esm/index.js';

export function renderOrderSummary() {
    let orderSummaryHTML = '';

    cart.forEach((cartItem) => {

        const productId = cartItem.productId;
        const matchingProduct = getProductById(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOptionById(deliveryOptionId);

        const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

        orderSummaryHTML += `
            <div class="cart-item-container 
            js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${deliveryDate}
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image"
                    src="${matchingProduct.image}">

                    <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                        Quantity: <span class="quantity-label">${cartItem.productQuantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                        </span>
                        <input class="quantity-input">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
                        Save
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
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

    function deliveryOptionsHTML(matchingProductId, cartItem) {
        let html = '';
        deliveryOptions.forEach((option) => {
            const deliveryDate = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');
            const deliveryPrice = (option.priceCents === 0) ? 'FREE' : `$${formatCurrency(option.priceCents)} - `;

            const isChecked = option.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProductId}" data-delivery-option-id="${option.id}">
                    <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
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

    function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector(".js-return-to-home-link").innerHTML = `${cartQuantity} ${cartQuantity === 1 ? "item" : "items"}`;
    }

    document.querySelector(".js-order-summary").innerHTML = orderSummaryHTML;
    updateCartQuantity();

    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            deleteFromCart(productId);
            updateCartQuantity();
            const containerToDelete = document.querySelector(`.js-cart-item-container-${productId}`);
            containerToDelete.remove();
        })
    })

    document.querySelectorAll(".js-update-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add("is-editing-quantity");

            const previousQuantity = container.querySelector(".quantity-label").innerText.trim();
            container.querySelector(".quantity-input").value = previousQuantity;
        });
    });

    document.querySelectorAll(".js-save-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.remove("is-editing-quantity");

            const productQuantity = Number(container.querySelector(".quantity-input").value);
            updateProductQuantity(productId, productQuantity);
            updateCartQuantity();
            container.querySelector(".quantity-label").innerHTML = productQuantity;
        });
    });

    document.querySelectorAll(".js-delivery-option").forEach((option) => {
        option.addEventListener("click", () => {
            const {productId, deliveryOptionId} = option.dataset
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
        });
    });
}