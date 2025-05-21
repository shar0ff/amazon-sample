import {cart} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

loadProducts().then(() => {
  renderProductsGrid();
});

function renderProductsGrid() {
  let productsHTML = '';

  const url = new URLSearchParams(location.search)
  let search = url.get('search');

  let filteredProducts = products;

  if (search) {
    search = search.toLowerCase()
    filteredProducts = products.filter(product => {
      return product.name.toLowerCase().includes(search) 
      || product.keywords.some(keyword => keyword.toLowerCase().includes(search));
    })
  }

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
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

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  const productsGrid = document.querySelector(".js-products-grid");
  productsGrid.innerHTML = productsHTML;

  cart.updateCartQuantity();

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

      cart.addToCart(productId, quantity);
      cart.updateCartQuantity();
    });
  });

  document.querySelector(".js-search-button").addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar").value;
    window.location.href = `amazon.html?search=${search}`;
  });

  document.querySelector(".js-search-button").addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
      const search = document.querySelector(".js-search-bar").value;
      window.location.href = `amazon.html?search=${search}`;
    }
  });
}