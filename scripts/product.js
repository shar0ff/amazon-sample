import {cart} from '../data/cart.js';
import { getProductById, loadProducts, products } from '../data/products.js';

/**
 * Loads all product data from the backend and renders the
 * product detail page for the product specified in the URL query.
 */
loadProducts().then(() => {
    loadPage();
})

/**
 * Renders the product detail page for a single product.
 * Handles:
 * - Fetching product ID from the URL
 * - Displaying product information (image, name, price, rating)
 * - Swiper carousel for product image(s)
 * - Quantity selector and "Add to Cart" functionality
 * - Updates the cart quantity indicator
 */
function loadPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    const product = getProductById(productId);

    // Handle invalid product ID
    if (!product) {
        document.querySelector('.js-product-page').innerHTML = '<p>Product not found.</p>';
        return;
    }

    // Generate HTML for the product details section
    let productHTML = `
        <div class="product-detail-page">
            <div class="product-images">
                <div class="swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide"><img src="${product.image}" class="product-image-large"/></div>
                </div>
                <div class="swiper-pagination"></div>
                </div>
            </div>

            <div class="product-info">
                <h1 class="product-name">${product.name}</h1>

                <div class="product-rating">
                <img class="product-rating-stars" src="${product.getStarsUrl()}" />
                <span class="product-rating-count">(${product.rating.count})</span>
                </div>

                <div class="product-price">
                ${product.getPrice()}
                </div>

                <div class="product-description">
                ${product.extraInfoHTML()}
                </div>

                <div class="product-quantity-container">
                    <select class="js-quantity-selector-${product.id}">
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    // Inject the generated HTML into the DOM
    document.querySelector(".js-product-page").innerHTML = productHTML;

    // Update cart quantity in header
    cart.updateCartQuantity();

    // Initialize Swiper carousel
    new Swiper('.swiper', {
        pagination: {
            el: '.swiper-pagination',
        },
    });

    /**
     * Attach event listeners to the "Add to Cart" button(s).
     */
    document.querySelectorAll(".js-add-to-cart").forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

            cart.addToCart(productId, quantity);
            cart.updateCartQuantity();
        });
    });
}