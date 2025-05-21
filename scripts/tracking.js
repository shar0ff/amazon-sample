import {getOrderById} from '../data/orders.js';
import {getProductById, loadProducts} from '../data/products.js';
import {cart} from '../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

/**
 * Initializes the order tracking page by:
 * - Loading product data
 * - Fetching the specific order and product from the URL query parameters
 * - Calculating delivery progress
 * - Rendering a progress bar and order info
 */
async function loadPage() {
  await loadProducts();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrderById(orderId);
  const product = getProductById(productId);

  // Find the matching product line within the order
  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  // Calculate delivery progress as a percentage
  const today = dayjs();
  const orderDate = dayjs(order.orderTime);
  const deliveryDate = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderDate) / (deliveryDate - orderDate)) * 100;

  // Generate the tracking page HTML
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
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${percentProgress >= 100 ? "current-status" : ''}">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  // Inject the generated HTML into the DOM
  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

  // Update cart quantity in the header
  cart.updateCartQuantity();
}

// Start page
loadPage();