import {cart} from '../data/cart.js';
import { getProductById, loadProducts, products } from '../data/products.js';

loadProducts().then(() => {
    loadPage();
})

function loadPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    const product = getProductById(productId);

    if (!product) {
        document.querySelector('.js-product-page').innerHTML = '<p>Product not found.</p>';
        return;
    }

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

    document.querySelector(".js-product-page").innerHTML = productHTML;
    cart.updateCartQuantity();

    new Swiper('.swiper', {
        pagination: {
            el: '.swiper-pagination',
        },
    });

    document.querySelectorAll(".js-add-to-cart").forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

            cart.addToCart(productId, quantity);
            cart.updateCartQuantity();
        });
    });
}