import {getOrderById} from '../data/orders.js';
import {getProductById, loadProducts} from '../data/products.js';
import {cart} from '../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  await loadProducts();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrderById(orderId);
  const product = getProductById(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
      Arriving on ${
        dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
      }
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
  cart.updateCartQuantity();
}

loadPage();