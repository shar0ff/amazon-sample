import {cart} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

/**
 * Loads products from the backend, then renders the product grid.
 */
loadProducts().then(() => {
  renderProductsGrid();
});


/**
 * Renders the product listing grid on the main Amazon-like page.
 * Handles:
 * - Filtering products based on a "search" URL query parameter
 * - Displaying product info and quantity selectors
 * - Adding items to the cart
 * - Showing "Added to Cart" confirmation message
 * - Handling product detail redirection
 * - Handling search input and button events
 */
function renderProductsGrid() {
  let productsHTML = '';

  const url = new URLSearchParams(location.search)
  let search = url.get('search');

  let filteredProducts = products;

  // Filter by search query, if present
  if (search) {
    search = search.toLowerCase()
    filteredProducts = products.filter(product => {
      return product.name.toLowerCase().includes(search) 
      || product.keywords.some(keyword => keyword.toLowerCase().includes(search));
    })
  }

  // Build HTML for each product in the filtered list
  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container js-product-container">
        <div class="product-image-container js-product-image-container" data-product-id=${product.id}>
          <img class="product-image"
          src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
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

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  // Inject products into the page
  const productsGrid = document.querySelector(".js-products-grid");
  productsGrid.innerHTML = productsHTML;

  cart.updateCartQuantity();

  // Add to Cart button logic
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
           let addedMessageTimeoutId;
      const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

      cart.addToCart(productId, quantity);
      cart.updateCartQuantity();

      addedMessage.classList.add('added-to-cart-visible');

      setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);
    });
  });

  // Search button click event
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar").value;
    window.location.href = `index.html?search=${search}`;
  });

  // Optional: Handle Enter key on the search button
  document.querySelector(".js-search-button").addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
      const search = document.querySelector(".js-search-bar").value;
      window.location.href = `index.html?search=${search}`;
    }
  });

  // Navigate to product detail page on image click
  document.querySelectorAll(".js-product-image-container").forEach((container) => {
    container.addEventListener("click", () => {
      let productId = container.dataset.productId;
      window.location.href = `product.html?productId=${productId}`;
    });
  });
}